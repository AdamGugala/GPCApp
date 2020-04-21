import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Game } from '../../game.module';
import { GamesService } from '../../games.service';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-game-item',
    templateUrl: './game-item.component.html',
    styleUrls: ['./game-item.component.css']
})
export class GameItemComponent implements OnInit, OnDestroy {
    @Input() game: Game;
    @Input() set index(myIndex: number) {
        this.myIndex = myIndex;
         if (!this.firstInit) {
            if (myIndex === 0) {
                this.hasLowerPrice = this.gamesService.comparePrices(this.game.gameSource);
            } else {
                this.hasLowerPrice = false;
            }
        } else {
            if (myIndex === 0) {
                this.hasLowerPrice = false;
                this.gamesService.setPricesToCompare((this.game.price === undefined) ? 0 : +this.game.price, this.game.gameSource);
            }
        }
    }

    constructor(
        private gamesService: GamesService,
        private dsService: DataStorageService,
    ) {}

    public hasLowerPrice = false;
    subIndexChangedSteam: Subscription;
    subIndexChangedGog: Subscription;
    private myIndex: number;
    private toCompare = false;

    firstInit = true;


    ngOnInit() {
        if (this.game === undefined) {
            this.game = new Game(0, '', '', '', '');
        }
        this.firstInit = false;

        this.subIndexChangedSteam = this.gamesService.gamesListChangedSteam.subscribe(() => {
            if ((this.myIndex === 0) && (!this.firstInit) && (this.toCompare)) {
                this.hasLowerPrice = this.gamesService.comparePrices(this.game.gameSource);
            } else {
                this.toCompare = false;
            }
        });

        this.subIndexChangedGog = this.gamesService.gamesListChangedGog.subscribe(() => {
            if ((this.myIndex === 0) && (!this.firstInit) && (this.toCompare)) {
                this.hasLowerPrice = this.gamesService.comparePrices(this.game.gameSource);
            } else {
                this.toCompare = false;
            }
        });
    }

    onCompare() {
        this.gamesService.moveToTopOfList(this.game, this.game.gameSource);
        this.toCompare = true;
        window.scroll(0, 0);
    }

    onGoToStorePage() {
        let url: string;
        if (this.game.gameSource === 'steam') {
            url = 'https://store.steampowered.com/app/' + this.game.id.toString();
            this.gamesService.openStorePage(url);
        } else if (this.game.gameSource === 'gog') {
            this.dsService.fetchGameGog(this.game.id, false).subscribe((game) => {
                url = game['links']['product_card'];
                this.gamesService.openStorePage(url);
            });
            // url = 'https://www.gog.com/game/' + game.title.toLowerCase().split(' ').join('_');
        }
    }

    ngOnDestroy() {
        this.subIndexChangedGog.unsubscribe();
        this.subIndexChangedSteam.unsubscribe();
    }

}
