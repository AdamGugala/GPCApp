import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { GameListComponent } from './game-list/game-list/game-list.component';
import { GameInfoComponent } from './game-info/game-info/game-info.component';

const routes: Routes = [
    {path: '', component: GameListComponent}
];

@NgModule({
    declarations: [
        GameListComponent,
        GameInfoComponent
    ],
    imports: [
    RouterModule.forChild(routes)
  ]
})
export class GameModule {}
