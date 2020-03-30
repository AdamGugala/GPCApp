import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GamesListComponent } from './games-list/games-list.component';
import { GamesInfoComponent } from './games-info/games-info.component';
import { GamesResolverService } from './games-resolver';
import { GameItemComponent } from './games-list/game-item/game-item.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

const routes: Routes = [
    {path: '', component: GamesListComponent,
     resolve: [GamesResolverService]
}
];

@NgModule({
    declarations: [
        GamesListComponent,
        GamesInfoComponent,
        GameItemComponent
    ],
    imports: [
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    CommonModule
  ]
})
export class GamesModule {}
