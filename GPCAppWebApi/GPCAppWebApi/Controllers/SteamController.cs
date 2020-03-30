using System.Threading.Tasks;
using System.Net.Http;
using Microsoft.AspNetCore.Mvc;
using System;


namespace testApp.NETCore.Controllers
{
    [ApiController]
    
    public class SteamController : ControllerBase
    {
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

        [Route("steamGameList/{useUrlAlt?}")]
        [HttpGet]
        public async Task<string> GetSteamGameList(bool ?useUrlAlt)
        {
            var httpClient = HttpClientFactory.Create();
            var url = "https://api.steampowered.com/ISteamApps/GetAppList/v0001";
            var urlAlt = "https://api.steampowered.com/ISteamApps/GetAppList/v0002";
            Console.WriteLine("TESTY: " + useUrlAlt);
            if (useUrlAlt == true) {
                url = urlAlt;
            }
            var data = await httpClient.GetStringAsync(url);
            return data;
        }

    }
}
