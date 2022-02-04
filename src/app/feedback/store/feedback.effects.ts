import { Actions, Effect, ofType } from "@ngrx/effects";
import { switchMap, map, catchError } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { of } from "rxjs";

import * as feedbackActions from "./feedback.actions"; 
import { Injectable } from '@angular/core';

@Injectable()
export class FeedEffects{
    constructor(private actions$:Actions,private http:HttpClient){}
    @Effect()
    startSubmit=this.actions$.pipe(
        ofType(feedbackActions.START_FEEDBACK),
        switchMap((action:feedbackActions.StartSubmit)=>{
            return this.http.post("https://notesproject-5a684.firebaseio.com/feedbacks.json",{name:action.payload.name,email:action.payload.email,feedback:action.payload.feedback}).
            pipe(
                map(data=>{
                    return new feedbackActions.SuccessFeedback();
                }),
                catchError(err=>{
                    return of(new feedbackActions.FailFeedback());
                })
            )
        }),
    );
    @Effect()
    feedback_success=this.actions$.pipe(ofType(feedbackActions.SUCCESS_FEEDBACK),
    map(()=>{
        return new feedbackActions.ResetProgress();
    }))
}