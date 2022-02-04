import { Injectable } from '@angular/core';
import { Actions, Effect, ofType, act } from "@ngrx/effects";
import * as authActions from "./auth.actions";
import { switchMap, map, catchError, tap, exhaustMap } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UserModel } from '../user.model';
import { environment } from 'src/environments/environment';
import { of, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/Shared/AppSate';
import * as notesActions from "../../notes/store/notes.actions";


export interface iuser{
        idToken:string,
        email:string,
        refreshToken:string,
        expiresIn:string,
        localId:string,
        registered:boolean
}

var timeRef:any;

const SetTimer=(store:Store<AppState>,time)=>{
    timeRef=setTimeout(()=>{
        store.dispatch(new authActions.Logout());
        localStorage.clear();
        resetTimer();
    },time);
}

const resetTimer=()=>{
    if(!!timeRef){
        clearTimeout(timeRef);
    }
}

const handleError=(err:HttpErrorResponse)=>{
    let message:string;
    if(!err.error || !err.error.error){
        message="An unknown error occurred !";
    }
    else{
        switch(<string>err.error.error.message){
            case "EMAIL_NOT_FOUND":
                message="The user has not been registered yet !";
                break;
            case "INVALID_PASSWORD":
                message="The password is invalid !";
                break;
            case "USER_DISABLED":
                message="The user account has been disabled by an administrator !";
                break;
            case "EMAIL_EXISTS":
                message="The email address is already in use by another account !";
                break;
            case "OPERATION_NOT_ALLOWED":
                message=" Password sign-in is disabled for this project !";
                break;
            case "TOO_MANY_ATTEMPTS_TRY_LATER":
                message="We have blocked all requests from this device due to unusual activity. Try again later !";
                break;
            case "INVALID_EMAIL":
                message="The email entered is invalid. Please check again !";    
                break;
            default:
                message="An unknown error occurred !"    
    }
    }
    return of(new authActions.LoginFail(message));
}
@Injectable()
export class AuthEffects{
    constructor(private store:Store<AppState>,private actions$:Actions,private http:HttpClient,private router:Router){}
    @Effect()
    loginStart=this.actions$.pipe(ofType(authActions.LOGIN_START),
    switchMap((action:authActions.LoginStart)=>{
        return this.http.post<iuser>("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" + environment.api_key,
        {email:action.payload.email,password:action.payload.password,returnSecureToken:true}).pipe(
            map((data)=>{
                let expireTime=new Date().getTime() + +data.expiresIn*1000;
                let user=new UserModel(data.idToken,
                    data.email,
                    data.refreshToken,
                    expireTime,
                    data.localId,
                    data.registered);
                SetTimer(this.store,+data.expiresIn*1000);   
                localStorage.setItem('userData',JSON.stringify(user)); 
                return new authActions.Authenticate({user:user,redirect:true});    
            }),
            catchError((handleError)),
        );
    }));

    @Effect({dispatch:false})
    authenticate=this.actions$.pipe(ofType(authActions.AUTHENTICATE),
    tap((action:authActions.Authenticate)=>{
        if(action.payload.redirect){
            this.router.navigate(['/notes']);
        }
    }));

    @Effect()
    logout=this.actions$.pipe(ofType(authActions.LOGOUT),tap(()=>{ 
        this.router.navigate(['/auth']); 
        localStorage.clear(); 
        if(!!timeRef){
            clearTimeout(timeRef);
        }
    }),map(()=>{ return new notesActions.ClearNotes() }));
    
    @Effect()
    autoLogin=this.actions$.pipe(ofType(authActions.AUTO_LOGIN),
    map(()=>{
        let userData=<iuser>JSON.parse(localStorage.getItem('userData'));
        if(!!userData){
            let user=new UserModel( userData.idToken,
                userData.email,
                userData.refreshToken,
                +userData.expiresIn,
                userData.localId,
                userData.registered)
            if(user.token){
                let remaining_time=+userData.expiresIn - new Date().getTime();
                SetTimer(this.store,remaining_time);
                return new authActions.Authenticate({user:user,redirect:false});
            }    
            else{
                return { type:"user token expired" };
            }
        }
        else{
            return { type:"no user data" }
        }
    }));
    @Effect()
    signup=this.actions$.pipe(ofType(authActions.SIGNUP),
    switchMap((action:authActions.SignUp)=>{
        return this.http.post<iuser>("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" + environment.api_key,{email:action.payload.email,password:action.payload.password,returnSecureToken:true})
        .pipe(exhaustMap((data)=>{
            return this.http.post("https://notesproject-5a684.firebaseio.com/users.json",{name:action.payload.name,email:action.payload.email})
            .pipe(map(()=>{
                let expireTime=new Date().getTime() + +data.expiresIn*1000;
                let user=new UserModel( data.idToken,
                    data.email,
                    data.refreshToken,
                    expireTime,
                    data.localId,
                    data.registered);
                localStorage.setItem('userData',JSON.stringify(user));    
                return new authActions.Authenticate({user:user,redirect:true});
            }),catchError((handleError)))
        }),catchError((handleError)))
    }));
}