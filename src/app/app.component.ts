import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from './Shared/AppSate';
import { Subscription } from 'rxjs';
import * as authActions from "./auth/store/auth.actions";
import { trigger,style,animate,keyframes, transition, state } from "@angular/animations";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations:[trigger("btnState",[
    transition("void => *",[,style({opacity:0}),animate(400,style({opacity:1}))])
  ])]
})
export class AppComponent implements OnInit,OnDestroy{
  name:string;
  title = 'NotesApp';
  loggedin:boolean=false;
  storeSubs:Subscription;
  constructor(private router:Router,private aroute:ActivatedRoute,private store:Store<AppState>){}
  
  ngOnInit(){
    this.storeSubs=this.store.select('auth').subscribe((data)=>{
        this.loggedin= !!data.user ? true : false ;
        this.name= !!data.user ? data.user.email : null; 
    });
    this.store.dispatch(new authActions.AutoLogin());
  }
  onClick(){
    this.router.navigate(['/auth'],{relativeTo:this.aroute});
  }
  onLogout(){
    this.store.dispatch(new authActions.Logout());
  }
  ngOnDestroy(){
    this.storeSubs.unsubscribe();
  }
}
