import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
import { Routes, PreloadAllModules, RouterModule } from '@angular/router';
import { AboutComponent } from 'src/about/about.component';

const appRoutes: Routes = [
  {path: '', redirectTo: '/gamesList', pathMatch: 'full'},
  {path: 'gamesList', loadChildren: () => import('./games/games.module').then(m => m.GamesModule)},
  {path: 'about', component: AboutComponent}
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
