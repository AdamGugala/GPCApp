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

    fetchGamesListAllSteam() {
        if (this.firstPageLoad) {
            let dataExist = false;
            return this.http.get<any>(this.url + 'steamGameList')
            .pipe(
                map(games1 => {
                    dataExist = games1.length > 1;
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
