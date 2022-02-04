import { Component, OnInit, OnDestroy } from '@angular/core';
import { transition,trigger,style,animate, keyframes } from "@angular/animations";
import { AppState } from '../Shared/AppSate';
import { Store } from '@ngrx/store';
import { Subscription, throwError, of } from 'rxjs';
import { Router } from '@angular/router';
import { exhaustMap, map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations:[trigger('imgState',[
    transition("void => *",[style({opacity:0,transform:'translateY(-100px)'}),
    animate(400,keyframes([
    style({opacity:0.3,offset:0.3,transform:'translateY(-80px)'}),
    style({opacity:0.5,offset:0.5,transform:'translateY(-60px)'}),
    style({opacity:0.7,offset:0.7,transform:'translateY(-40px)'}),
    style({opacity:0.9,offset:0.9,transform:'translateY(-20px)'}),
    style({opacity:1,offset:1,transform:'translateY(0px)'}),
  ]))])
  ]),
  trigger('divState',[transition("void => *",[style({opacity:0,transform:'translateY(100px)'}),
  animate(400,keyframes([
    style({opacity:0.3,offset:0.3,transform:'translateY(80px)'}),
    style({opacity:0.5,offset:0.5,transform:'translateY(60px)'}),
    style({opacity:0.7,offset:0.7,transform:'translateY(40px)'}),
    style({opacity:0.9,offset:0.9,transform:'translateY(20px)'}),
    style({opacity:1,offset:1,transform:'translateY(0px)'}),
]))])]),]
})
export class HomeComponent implements OnInit,OnDestroy {
  username:string="SignIn / Login to access all features.";
  storeSubs:Subscription;
  constructor(private http:HttpClient,private router:Router,private store:Store<AppState>) { }

  ngOnInit(): void {
    this.storeSubs=this.store.select('auth').subscribe((data)=>{
      this.username=!!data.user ? data.user.email : "SignIn / Login to access all features.";
    });
  }
  gotoNotes(){
    this.router.navigate(['/notes']);
  }
  ngOnDestroy(){
    this.storeSubs.unsubscribe();
  }
}
