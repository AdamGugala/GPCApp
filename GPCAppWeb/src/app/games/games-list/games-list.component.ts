import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { GamesService } from '../games.service';
import { Subscription, Subject } from 'rxjs';
import { Game } from '../game.module';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-games-list',
  templateUrl: './games-list.component.html',
  styleUrls: ['./games-list.component.css']
})
export class GamesListComponent implements OnInit, OnDestroy {

  constructor(private dsService: DataStorageService, private gamesService: GamesService) { }

  // subs to detect changes in gamesListSteam and gamesListGog in gameService and update lists in this component.
  subGamesListSteam: Subscription;
  subGamesListGog: Subscription;
  // subs to get list of all games id from steam to use for search games prices
  subGamesListAllSteam: Subscription;

  // displayed lists of games.
  gamesListSteam: Game[] = [];
  gamesListGog: Game[] = [];

  // FormGroup from search bar.
  serachForm: FormGroup;

  // if true then loading spinners are visible.
  isLoadingSteam: boolean;
  isLoadingGog: boolean;

  // true by default. Set to false if list of games id from is not empty.
  gamesListSteamNoData = true;
  // Set to to true after specified time if list of games id from is empty.
  showErrorSteamNoData = false;


  // interval between http requests of subsequent games from the Steam list. Necessary due to Steam API limitations.
  intervalSteamGetHttp: any;
  // timeout between http requests
  timeoutHttpReqSteam = 650; // in miliseconds

  // interval to count time to show error message if list of games id from steam is empty
  intervalSteamListNoData: any;
  timeToShowErrorMsgSteam = 10; // in seconds;

  // to tests
  mockGogGame: Game;
  mockSteamGame: Game;
  mockGamesVisible = false;
  //

  ngOnInit(): void {
    // sub to get id list of all games id from steam.
    // There are to sources. If first does not set the games list then the second is tried out.
    this.isLoadingSteam = true;
    this.subGamesListAllSteam = this.dsService.fetchGamesListAllSteam().subscribe(() => {
      if (this.gamesService.getGamesListAllSteam().size > 1) {

        this.gamesListSteamNoData = false;
        this.isLoadingSteam = false;
      }
    });

    // show error message if games list from steam is still empty after specified time
    let time = 0;
    this.intervalSteamListNoData = setInterval(() => {
      time++;
      if (time > this.timeToShowErrorMsgSteam) {
        clearInterval(this.intervalSteamListNoData);
        if (this.gamesListSteamNoData) {
          this.showErrorSteamNoData = true;
          this.isLoadingSteam = false;
        }
      }
    }, 1000);

    this.serachForm = new FormGroup({
      'searchField': new FormControl(null, Validators.required)
    });

    this.subGamesListSteam = this.gamesService.gamesListChangedSteam.subscribe(
      (games: Game[]) => {
        this.gamesListSteam = games;
      }
    );
    this.subGamesListGog = this.gamesService.gamesListChangedGog.subscribe(
      (games: Game[]) => {
        this.gamesListGog = games;
      }
    );

    this.gamesListSteam = this.gamesService.getGamesListSteam();
    this.gamesListGog = this.gamesService.getGamesListGog();

    // tests
    if (this.mockGamesVisible) {
      this.onGogTest();
      this.onSteamTest();
    }
  }

  onGogTest() {
    // const id = 1405735336;
    // const id = 1751163083;
    const id = 1609408156;
    this.dsService.fetchGameGog(id, true)
      .subscribe(game => {
        this.mockGogGame = this.gamesService.getMockGame('gog');
      });
    this.dsService.fetchGameGogPrice(id)
      .subscribe();
  }

  onSteamListTest() {
    this.dsService.fetchGamesListAllSteam().subscribe(gamesList => {
      console.log('steamGameList: ', gamesList);
    });
  }
  onSteamTest() {
    const id = 378648;
    this.dsService.fetchGameSteam(id, true)
      .subscribe(game => {
        this.mockSteamGame = this.gamesService.getMockGame('steam');
      });
  }

  onSort() {
    this.gamesService.sortGamesListSteam();
  }

  onGameSelect(game: Game, gameListType: string) {
    this.gamesService.moveToTopOfList(game, gameListType);
  }

  searchGame() {
    this.isLoadingSteam = true;
    this.isLoadingGog = true;
    clearInterval(this.intervalSteamGetHttp);

    // GOG //
    this.dsService.fetchSearchedGamesGog(this.serachForm.controls['searchField'].value).subscribe((gamesList) => {
      this.gamesService.setGamesListGog(gamesList);
      this.isLoadingGog = false;
      });
    // STEAM //
    this.gamesService.clearGamesListSteam();
    const indexes = this.gamesService.getIndexesOfSearchedGamesSteam(this.serachForm.controls['searchField'].value);
    if (indexes.length !== 0) {
      let index = -1;
      const maxIndex = (indexes.length <= 40) ? indexes.length : 40;
      this.intervalSteamGetHttp = setInterval(() => {
        index++;
        if (index === maxIndex - 1) {
          this.isLoadingSteam = false;
          clearInterval(this.intervalSteamGetHttp);
          }
        this.dsService.fetchGameSteam(+indexes[index]).subscribe(game => {
          // console.log(+indexes[index], game);
          this.gamesService.setGamesListSteam(game, index === maxIndex - 1);
        });
      }, this.timeoutHttpReqSteam);
    } else {
      this.isLoadingSteam = false;
    }
  }

  ngOnDestroy() {
    this.subGamesListSteam.unsubscribe();
    this.subGamesListGog.unsubscribe();
    clearInterval(this.intervalSteamGetHttp);
    clearInterval(this.intervalSteamListNoData);

    // TODO
    // To consider cyclic update of games list if first load was unsuccessful
    if (this.subGamesListAllSteam !== undefined) {
      this.subGamesListAllSteam.unsubscribe();
    }
  }


}
