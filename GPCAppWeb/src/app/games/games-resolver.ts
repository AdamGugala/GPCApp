import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DataStorageService } from '../shared/data-storage.service';
import { GamesService } from './games.service';

@Injectable({providedIn: 'root'})
export class GamesResolverService implements Resolve<any> {

    constructor(private dsStorage: DataStorageService, private gamesService: GamesService) {}

    // resolve subscribe itself. No need for unsubscribe
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // Not used.
        // TO DEL
        const response: any = this.dsStorage.fetchGamesListAllSteam();
        return response;
    }
}
