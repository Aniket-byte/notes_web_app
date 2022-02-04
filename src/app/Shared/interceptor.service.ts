import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { AppState } from './AppSate';
import { exhaustMap, take } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable()
export class InterceptorService implements HttpInterceptor{
    constructor(private store:Store<AppState>){}
    intercept(req:HttpRequest<any>,next:HttpHandler){
        return this.store.select('auth').pipe(
            take(1),
            exhaustMap(data=>{
                if(!!data.user){
                    let custReq=req.clone({params:req.params.append('auth',data.user.token)});
                    return next.handle(custReq);
                }
                else{
                    return next.handle(req);
                }
            })
        )
    }
}