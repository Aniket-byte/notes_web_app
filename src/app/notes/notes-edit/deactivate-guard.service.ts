import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { SaveService } from './notes-save.service';

export interface ideact{
    canDeactivate():Observable<boolean> | Promise<boolean> | boolean;
}
@Injectable()
export class DeactivateGuard implements CanDeactivate<ideact>{
    constructor(private saveService:SaveService){}
    canDeactivate(component:ideact,route:ActivatedRouteSnapshot,state:RouterStateSnapshot){
        if(this.saveService.saveSatus){
            return true;
        }
        else{
            return component.canDeactivate()
        }
    }
}