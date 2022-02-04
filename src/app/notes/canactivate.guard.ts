import { Injectable } from "@angular/core";
import { CanActivate, UrlTree, Router } from "@angular/router";
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../Shared/AppSate';
import { map,take } from 'rxjs/operators';

@Injectable()
export class CanActivateGuard implements CanActivate{
    constructor(private router:Router,private store:Store<AppState>){}
    canActivate():Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree{
        return this.store.select('auth').pipe(take(1),map(data=>{
            return !!data.user ? true : this.router.createUrlTree(['/auth']);
        }));
    }
}