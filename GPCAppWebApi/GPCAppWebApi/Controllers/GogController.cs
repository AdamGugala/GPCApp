using System.Threading.Tasks;
using System.Net.Http;
using Microsoft.AspNetCore.Mvc;

namespace testApp.NETCore.Controllers
{
    [ApiController]
    
    public class GogController : ControllerBase
    {

        // http://api.gog.com/products/1207658691?expand=price
        // https://embed.gog.com/games/ajax/filtered?mediaType=game&search=1207658930

        [Route("gogGameTest/Price")]
        [HttpGet]
        public async Task<string> GetGogGamePriceTestData()
        {
            var httpClient = HttpClientFactory.Create();
            var url = "https://api.gog.com/products/1207658930/prices?countryCode=PL";
            var data = await httpClient.GetStringAsync(url);
            return data;
        }

        [Route("gogGameTest")]
        [HttpGet]
        public async Task<string> GetGogGameTestData()
        {
            var httpClient = HttpClientFactory.Create();
            var url = "https://api.gog.com/products/1207658930";
            var data = await httpClient.GetStringAsync(url);
            return data;
        }

        [Route("gogGame/{id}/price")]
        [HttpGet]
        public async Task<string> GetGogGamePrice(int id)
        {
            var httpClient = HttpClientFactory.Create();
            var url = "https://api.gog.com/products/{0}/prices?countryCode=PL";
            url = string.Format(url, id);
            
            var data = await httpClient.GetStringAsync(url);
            return data;
        }

        [Route("gogGame/{id}")]
        [HttpGet]
        public async Task<string> GetGogGame(int id)
        {
            var httpClient = HttpClientFactory.Create();
            var url = "https://api.gog.com/products/{0}";
            url = string.Format(url, id);
            var data = await httpClient.GetStringAsync(url);
            // http://api.gog.com/products/1207658691?expand=price
            // https://embed.gog.com/games/ajax/filtered?mediaType=game&search=1207658930
            return data;
        }
        [Route("gogGames/search/{searched}")]
        [HttpGet]
        public async Task<string> GetGogGame(string searched)
        {
            var httpClient = HttpClientFactory.Create();
            var url = "https://embed.gog.com/games/ajax/filtered?mediaType=game&search={0}";
            url = string.Format(url, searched);
            var data = await httpClient.GetStringAsync(url);
            return data;
        }

    }
}
