import { Component, Input, OnInit, HostBinding } from '@angular/core';
import { Game } from '../../game.module';
import { GamesService } from '../../games.service';
import { DataStorageService } from 'src/app/shared/data-storage.service';

@Component({
    selector: 'app-game-item',
    templateUrl: './game-item.component.html',
    styleUrls: ['./game-item.component.css']
})
export class GameItemComponent implements OnInit {
    @Input() game: Game;
    @Input() index: number;

    @HostBinding('class.lowerPrice') hasLowerPrice = false;
    constructor(private gamesService: GamesService, private dsService: DataStorageService) {}

    // hasLowerPrice = false;

    ngOnInit() {
        if (this.game === undefined) {
            this.game = new Game(0, '', '', '', '');
        }
        if (this.index === 0) {
            this.gamesService.setPricesToCompare(+this.game.price, this.game.gameSource);
        }
    }

    onCompare() {
        this.gamesService.moveToTopOfList(this.game, this.game.gameSource);
        this.hasLowerPrice = this.gamesService.comparePrices(this.game.gameSource);
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

}
