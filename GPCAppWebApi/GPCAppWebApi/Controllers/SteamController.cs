using System.Threading.Tasks;
using System.Net.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Linq;
using System.Collections.Generic;
using GPC.NETCore.Models;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;

namespace GPC.NETCore.Controllers
{
    [ApiController]

    public class SteamController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly DbContextOptions<GPCdbContext> _options;
        public SteamController(DbContextOptions<GPCdbContext> options, IConfiguration configuration)
        {
            _options = options;
            _configuration = configuration;
        }

        // https://api.steampowered.com/ISteamApps/GetAppList/v0002
        [Route("steamTest")]
        [HttpGet]
        public async Task<string> GetSteamTestData()
        {
            var httpClient = HttpClientFactory.Create();
            var url = "https://store.steampowered.com/api/appdetails?appids=1233340&format=json";
            var data = await httpClient.GetStringAsync(url);

            return data;
        }

        [Route("steamGame/{id}")]
        [HttpGet]
        public async Task<string> GetSteamGame(int id)
        {
            var httpClient = HttpClientFactory.Create();
            var url = "https://store.steampowered.com/api/appdetails?appids={0}&format=json";
            url = string.Format(url, id);
            var data = await httpClient.GetStringAsync(url);
           
            return data;
        }

        [Route("steamGameList")]
        [HttpGet]
        public async Task<string> GetSteamGameList()
        {
            var httpClient = HttpClientFactory.Create();
            
            var url = "https://api.steampowered.com/ISteamApps/GetAppList/v0001";
            var urlAlt = "https://api.steampowered.com/ISteamApps/GetAppList/v0002";
            
            var useDataFromDB = false;
            var saveDataToDB = false;
            var useUrlAlt = false;
            
            Dictionary<int,string> dict = new Dictionary<int,string>();
            //url = urlAlt; // to del
            // Get list of games id from Steam from first source;
            var data = await httpClient.GetStringAsync(url);
            JObject parsedData = JObject.Parse(data);

            // If obtained data does not contain any data, use second source
            var test = parsedData["applist"]["apps"]["app"].ToList().Count;
            useUrlAlt = (parsedData["applist"]["apps"].SelectToken("app", errorWhenNoMatch: false) is null) || (parsedData["applist"]["apps"]["app"].ToList().Count <= 1) ? true : false; 
            if (useUrlAlt) {
                data = await httpClient.GetStringAsync(urlAlt);
                parsedData = JObject.Parse(data);
            }

            // If second source also does not contain data, try to get copy of them from database (not actual data)
            useDataFromDB = useUrlAlt && parsedData["applist"].SelectToken("apps", errorWhenNoMatch: false) is null ? true : false;

            if (useDataFromDB) {
                dict = getGamesIdFromDB();
            }


            if (!useDataFromDB && !useUrlAlt) {
                dict = parsedData["applist"]["apps"]["app"].ToList().ToDictionary(x => Int32.Parse(x["appid"].ToString()), y => y["name"].ToString());
                saveDataToDB = true;
            } else if (!useDataFromDB && useUrlAlt) {
                dict = parsedData["applist"]["apps"].ToList().ToDictionary(x => Int32.Parse(x["appid"].ToString()), y => y["name"].ToString());
                saveDataToDB = true;
            }

            if (saveDataToDB) {
                insertGamesIdToDB(dict);
            }

            if (dict.Count > 0)
            {
                data = JsonConvert.SerializeObject(dict.ToList(), Formatting.Indented);
            }
            return data;
        }

        [Route("steamGameList/dataFromDB")]
        [HttpGet]
        public Dictionary<int,string> getGamesIdFromDB()
        {
            using (var context = new GPCdbContext(_options, _configuration)) {
                var result = context.SteamGamesIdView.ToList();
                return result.ToDictionary(x => x.Id, y => y.Name);
            }
        }


        [Route("steamGameList/dataToDB")]
        [HttpPost]
        public void insertGamesIdToDB(Dictionary<int,string> dict) {

            var entityTbl = new List<LsteamGamesId>();
            var ind = 0;
            var dictList = new List<Dictionary<int, string>> { new Dictionary<int, string>(), new Dictionary<int, string>() };
            // first one - dictionary with key-pair values to add to DB; second one - dictionary with key-pair values to delete from DB
            dictList = DBManageClass.getDistinctGamesId(dict, getGamesIdFromDB());

            using (var context = new GPCdbContext(_options, _configuration)) {
                try
                {
                    if (dictList[0].Count > 0) {
                        foreach (var rec in dictList[0])
                        {
                            context.AddRange(new LsteamGamesId { Id = rec.Key, Name = rec.Value.Length < 255 ? rec.Value : rec.Value.Substring(0, 255) });
                            ind++;
                            if ((ind % 1000 == 0) || (ind == dictList[0].Count))
                            {
                                context.SaveChanges();
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex);
                }               
            }
            using (var context = new GPCdbContext(_options, _configuration))
            {
                try
                {
                    if (dictList[1].Count > 0)
                    {
                        foreach (var rec in dictList[1])
                        {
                            context.RemoveRange(new LsteamGamesId { Id = rec.Key, Name = rec.Value.Length < 255 ? rec.Value : rec.Value.Substring(0, 255) });
                            ind++;
                            if ((ind % 1000 == 0) || (ind == dictList[1].Count))
                            {
                                context.SaveChanges();
                            }
                        }
                    }
                }
                catch (Exception ex) 
                {
                    Console.WriteLine(ex);
                }
            }
        }

        
    }

    public class DBManageClass {
        public static List<Dictionary<int, string>> getDistinctGamesId(Dictionary<int, string> dictFromAPI, Dictionary<int, string> dictFromDB)
        {
            if (dictFromAPI.Count != dictFromDB.Count)
            {
                var keysToAdd = dictFromAPI.Keys.Except(dictFromDB.Keys);
                var keysToDel = dictFromDB.Keys.Except(dictFromAPI.Keys);
                Dictionary<int, string> dictToInsert = new Dictionary<int, string>();
                Dictionary<int, string> dictToDel = new Dictionary<int, string>();

                foreach (var key in keysToAdd)
                {
                    dictToInsert.Add(key, dictFromAPI.Select((x,y)=>(x.Key,x.Value)).Where(x=>x.Key == key).Select(x=>x.Value).FirstOrDefault());
                }

                foreach (var key in keysToDel)
                {
                    dictToDel.Add(key, dictFromDB.Select((x, y) => (x.Key, x.Value)).Where(x => x.Key == key).Select(x => x.Value).FirstOrDefault());
                }


                return new List<Dictionary<int, string>> { dictToInsert, dictToDel };
            }
            else
            {
                return new List<Dictionary<int, string>> { new Dictionary<int, string>(), new Dictionary<int, string>()};
            }
            
        }

    }
}
