import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
import { Routes, PreloadAllModules, RouterModule } from '@angular/router';

const appRoutes: Routes = [
  {path: '', redirectTo: '/gamesList', pathMatch: 'full'},
  {path: 'gamesList', loadChildren: () => import('./games/game.module').then(m => m.GameModule)}
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
