import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DataStorageService } from '../shared/data-storage.service';

@Injectable({providedIn: 'root'})
export class GamesResolverService implements Resolve<any> {

    constructor(private dsStorage: DataStorageService) {}

    // resolve subscribe itself. No need for unsubscribe
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // TODO
        // Manage data here.
        return this.dsStorage.fetchGamesListAllSteam();
    }
}
