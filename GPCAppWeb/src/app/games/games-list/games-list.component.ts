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

  subscribtionSteam: Subscription;
  subscribtionGog: Subscription;
  subscribtionLoading: Subscription;

  gamesListSteam: any = [];
  gamesListGog: any = [];

  serachForm: FormGroup;

  isLoadingSteam: boolean;
  isLoadingGog: boolean;

  selectedGameIndexSteam: number;
  selectedGameIndexGog: number;

  // to tests
  mockGogGame: Game;
  mockSteamGame: Game;
  mockGamesVisible = false;

  interval: any;
  //

  ngOnInit(): void {
    this.serachForm = new FormGroup({
      'searchField': new FormControl(null, Validators.required)
    });

    this.subscribtionSteam = this.gamesService.gamesListChangedSteam.subscribe(
      (games: Game[]) => {
        this.gamesListSteam = games;
      }
    );
    this.subscribtionGog = this.gamesService.gamesListChangedGog.subscribe(
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
    clearInterval(this.interval);

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
      this.interval = setInterval(() => {
        index++;
        if (index === maxIndex - 1) {
          this.isLoadingSteam = false;
          clearInterval(this.interval);
          }
        this.dsService.fetchGameSteam(+indexes[index]).subscribe(game => {
          // console.log(+indexes[index], game);
          this.gamesService.setGamesListSteam(game, index === maxIndex - 1);
        });
      }, 650);
    } else {
      this.isLoadingSteam = false;
    }
  }

  ngOnDestroy() {
    this.subscribtionSteam.unsubscribe();
    this.subscribtionGog.unsubscribe();
    clearInterval(this.interval);
  }
}
