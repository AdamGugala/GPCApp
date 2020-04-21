import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, map, finalize } from 'rxjs/operators';
import { GamesService } from '../games/games.service';
import { Game } from '../games/game.module';

@Injectable({providedIn: 'root'})
export class DataStorageService {

    constructor(
        private http: HttpClient,
        private gameService: GamesService,
        @Inject('BASE_URL') baseUrl: string) {
            this.url = baseUrl;
        }

    private url: string;
    private firstPageLoad = true;

/////////////////////////////////////////////////////////////////////////////////////////
// STEAM //

    fetchGamesListAllSteam(useAltSource?: boolean) {
        if (this.firstPageLoad) {
            let dataExist = false;
            if (!useAltSource) {
                return this.http.get<any>(this.url + 'steamGameList/false')
                .pipe(
                    map(games1 => {
                        // console.log('1_1.trying first source of games list from Steam');
                        dataExist = games1.hasOwnProperty('applist') && games1['applist']['apps']['app'].length > 1;
                        if (dataExist) {
                            // console.log('1.1. first source of games list from Steam');
                            games1 = games1.applist.apps;
                        }
                        return games1;
                    }),
                    tap(games1 => {
                        if (dataExist) {
                            this.gameService.clearGamesListAllSteam();
                            this.firstPageLoad = false;
                            this.gameService.setGamesListAllSteam(games1);
                        }
                    })
                );
            } else {
                return this.http.get<any>(this.url + 'steamGameList/true')
                .pipe(
                    map(games2 => {
                        // console.log('2_1.trying second source of games list from Steam');
                        dataExist = games2.hasOwnProperty('app') && games2['app'].length > 1;
                        if (dataExist) {
                            // console.log('2.1.second source of games list from Steam');
                            games2 = games2.applist.apps;
                        }
                        return games2;
                    }),
                    tap(games2 => {
                        if (dataExist) {
                            this.gameService.clearGamesListAllSteam();
                            this.firstPageLoad = false;
                            this.gameService.setGamesListAllSteam(games2);
                        }
                    })
                );
            }
        }
    }

    fetchGameSteam(id: number, isMockGame?: boolean) {
        return this.http.get<any>(this.url + 'steamGame/' + id)
        .pipe(
            map(game => {
                if (isMockGame) {
                    this.gameService.setMockGame(game, 'steam');
                }
                return game;
            })
        );
    }

/////////////////////////////////////////////////////////////////////////////////////////
// GOG //
    fetchGameGog(id: number, isMockGame?: boolean) {
        return this.http.get<Game>(this.url + 'gogGame/' + id)
        .pipe(
            map(game => {
                if (isMockGame) {
                    this.gameService.setMockGame(game, 'gog');
                }
                return game;
            })
        );
    }

    fetchGameGogPrice(id: number) {
        return this.http.get<Game>(this.url + 'gogGame/' + id + '/price')
        .pipe(
            map(game => {
                this.gameService.setMockGamePrice(game);
                return game;
            })
        );
    }

    fetchSearchedGamesGog(searched: string) {
        return this.http.get<any>(this.url + 'gogGames/search/' + searched);
    }
}
/////////////////////////////////////////////////////////////////////////////////////////



// onTestGogBtnClick() {
//     this.http.get(this.url + 'gogTest', {responseType: 'json'}).subscribe(result => {
//       this.gogTestData = result;
//       console.log(this.gogTestData);
//     }, error => console.error(error));
//   }
//   onTestSteamBtnClick() {
//     this.http.get<any>(this.url + 'steamTest').subscribe(result => {
//       this.steamTestData = result;
//       console.log(this.steamTestData);
//     }, error => console.error(error));
//   }
//   onTestSteamListBtnClick() {
//     this.http.get<any>(this.url + 'steamListTest').subscribe(result => {
//       this.steamListData = result;
//       console.log(this.steamListData);
//     }, error => console.error(error));
//   }
