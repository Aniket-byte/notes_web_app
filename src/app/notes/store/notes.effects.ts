import { Actions, Effect, ofType, act } from "@ngrx/effects";
import * as notesActions from "./notes.actions";
import { switchMap,withLatestFrom, map, tap,catchError } from 'rxjs/operators';
import { AppState } from 'src/app/Shared/AppSate';
import { Store } from '@ngrx/store';
import * as fromAuth from 'src/app/auth/store/auth.reducer';
import * as fromNotes from '../store/notes.reducer';  
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NotesModel } from '../notesModel';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { SaveService } from '../notes-edit/notes-save.service';

export interface inotes{
    title:string,
    content:string,
    notes:NotesModel[],
}

@Injectable()
export class NotesEffects{

    constructor(private saveService:SaveService,private router:Router,private http:HttpClient,private actions$:Actions,private store:Store<AppState>){}
    
    @Effect()
    fetchStart=this.actions$.pipe(ofType(notesActions.START_FETCH),
    withLatestFrom(this.store.select('auth')),
    switchMap(([actions,user]:[notesActions.StartFetch,fromAuth.State])=>{
        let email=user.user.email.slice(0,user.user.email.indexOf('.'));
        return this.http.get<inotes>("https://notesproject-5a684.firebaseio.com/notes/"+ email+".json").pipe(
            map(respData=>{
                let notesArray:NotesModel[]=[];
                if(!!respData){
                    for(let key in respData){
                        if(respData.hasOwnProperty(key)){
                            notesArray.push({...respData[key]});
                        }
                    } 
                }
                else{
                    notesArray=[];
                }
                return new  notesActions.FetchSuccess({notes:notesArray});
            }),
            catchError((err)=>{
                return of(new notesActions.FetchFail("Fetching notes failed !"));
            }));
    }));

    @Effect()
    addNotes=this.actions$.pipe(ofType(notesActions.ADD_NOTES),
    withLatestFrom(this.store.select("notes"),this.store.select('auth')),
    switchMap(([action,notes,auth]:[notesActions.AddNotes,fromNotes.State,fromAuth.State])=>{

        let email=auth.user.email.slice(0,auth.user.email.indexOf('.'));
        let notesArray=[...notes.notes];

        if(action.paload.links.length > 0){
        notesArray.push({title:action.paload.title,content:action.paload.content,date:action.paload.date,links:action.paload.links});
        }
        else{
            notesArray.push({title:action.paload.title,content:action.paload.content,date:action.paload.date});
        }
        return this.http.put("https://notesproject-5a684.firebaseio.com/notes/"+ email+'.json', notesArray).pipe(map(()=>{
            return new notesActions.AddSuccess(notesArray);
        }),catchError(err=>{
            return of(new notesActions.AddFail("Notes addition failed !"));
        }));
    }));

    @Effect({dispatch:false})
    addSuccess=this.actions$.pipe(ofType(notesActions.ADD_SUCCESS),tap(()=>{
        this.router.navigate(["/notes"]);
    }));

    @Effect()
    deleteAll=this.actions$.pipe(ofType(notesActions.DELETEALL_NOTES),
    withLatestFrom(this.store.select('auth')),
    switchMap(([actions,auth])=>{
        let email=auth.user.email.slice(0,auth.user.email.indexOf('.'));
        return this.http.delete("https://notesproject-5a684.firebaseio.com/notes/"+ email+".json").pipe(
            map(()=>{
                return new notesActions.DeleteSuccess();
            }),
            catchError((err)=>{
                return of(new notesActions.DeleteFail("Deletion of notes failed !"));
            })
        );
    }));
    
    @Effect()
    deleteNote=this.actions$.pipe(ofType(notesActions.DELETE_NOTE),
    withLatestFrom(this.store.select('notes'),this.store.select('auth')),
    switchMap(([action,notes,auth]:[notesActions.DeleteNote,fromNotes.State,fromAuth.State])=>{
        let email=auth.user.email.slice(0,auth.user.email.indexOf("."));
        let index=action.payload;
        let notesArray=[...notes.notes]
        notesArray.splice(index,1);
        return this.http.put("https://notesproject-5a684.firebaseio.com/notes/"+ email+'.json', notesArray).pipe(
            map(()=>{
                return new notesActions.DeleteNoteSuccess(notesArray);
            }),
            catchError((err)=>{
                return of(new notesActions.DeleteFail("Deletion of notes failed !"));
            })
        );
    }));

    @Effect()
    updateStart=this.actions$.pipe(ofType(notesActions.UPDATE_START),
    withLatestFrom(this.store.select('notes'),this.store.select('auth')),
    switchMap(([action,notes,auth]:[notesActions.UpdateStart,fromNotes.State,fromAuth.State])=>{
        let email=auth.user.email.slice(0,auth.user.email.indexOf("."));
        let notesArray=[...notes.notes];
        notesArray[action.payload.index]=action.payload.notes;
        return this.http.put("https://notesproject-5a684.firebaseio.com/notes/"+ email+'.json', notesArray).pipe(
            map(()=>{
                this.saveService.saveSatus=true;
                return new notesActions.UpdateSuccess(notesArray);
            }),
            catchError((err)=>{
                this.saveService.saveSatus=false;
                return of(new notesActions.UpdateFail("Notes Updation failed !"));
            })
        );
    }));
}