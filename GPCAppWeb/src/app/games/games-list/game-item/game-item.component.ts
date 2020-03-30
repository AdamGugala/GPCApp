import { Component, Input, OnInit } from '@angular/core';
import { Game } from '../../game.module';
import { GamesService } from '../../games.service';

@Component({
    selector: 'app-game-item',
    templateUrl: './game-item.component.html',
    styleUrls: ['./game-item.component.css']
})
export class GameItemComponent implements OnInit {
    @Input() game: Game;
    @Input() index: number; // TODO

    constructor(public gameService: GamesService) {}

    ngOnInit() {
        if (this.game === undefined) {
            this.game = new Game(0, '', '', '', '');
        }
    }

    onCompare() {
        this.gameService.moveToTopOfList(this.game, this.game.gameSource);
    }

    onGoToStorePage() {
        this.gameService.openStorePage(this.game);
    }

}
