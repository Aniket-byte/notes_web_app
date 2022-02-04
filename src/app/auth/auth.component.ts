import { Component, OnInit, ViewChild, ComponentFactoryResolver, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { style,transition,trigger,keyframes,animate } from "@angular/animations";
import { Store } from '@ngrx/store';
import { AppState } from '../Shared/AppSate';
import { Subscription } from 'rxjs';
import { AlertDirective } from '../Shared/alert-component/alert.directive';
import { AlertComponent } from '../Shared/alert-component/alert.component';
import * as authActions from "./store/auth.actions";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  animations:[
    trigger('inputState',[
      transition("void => *",[style({opacity:0,transform:"translateX(-100px)"}),
    animate(400,keyframes([
      style({opacity:0.3,offset:0.3,transform:"translateX(-80px)"}),
      style({opacity:0.5,offset:0.5,transform:"translateX(-60px)"}),
      style({opacity:0.7,offset:0.7,transform:"translateX(-40px)"}),
      style({opacity:0.9,offset:0.9,transform:"translateX(-20px)"}),
      style({opacity:1,offset:1,transform:"translateX(0px)"}),
    ]))])
    ]),
    trigger('btnState',[
      transition("void => *",[style({opacity:0,transform:'translateX(100px)'}),
      animate(400,keyframes([
      style({opacity:0.3,offset:0.3,transform:"translateX(80px)"}),
      style({opacity:0.5,offset:0.5,transform:"translateX(60px)"}),
      style({opacity:0.7,offset:0.7,transform:"translateX(40px)"}),
      style({opacity:0.9,offset:0.9,transform:"translateX(20px)"}),
      style({opacity:1,offset:1,transform:"translateX(0px)"}),
      ]))])
    ]),
    trigger("messageState",[
      transition("void => *",[style({opacity:0,transform:'translateY(50px)'}),
      animate(250,keyframes([
        style({opacity:0.3,offset:0.3,transform:"translateY(40px)"}),
        style({opacity:0.5,offset:0.5,transform:"translateY(30px)"}),
        style({opacity:0.7,offset:0.7,transform:"translateY(20px)"}),
        style({opacity:0.9,offset:0.9,transform:"translateY(10px)"}),
        style({opacity:1,offset:1,transform:"translateY(0px)"}),
      ]))])
    ]),],
})
export class AuthComponent implements OnInit,OnDestroy {
 
  formGrp:FormGroup;
  signUpForm:FormGroup;
  loading:boolean=false;
  isLoginMode:boolean=true;
  message:string;
  compSubs:Subscription;
  storeSubs:Subscription; 
  @ViewChild(AlertDirective,{static:true}) alertDir:AlertDirective;
  
  constructor(private store:Store<AppState>,private compFac:ComponentFactoryResolver) { }

  ngOnInit(): void {
    this.storeSubs=this.store.select('auth').subscribe((data)=>{
      this.loading=data.loading;
      if(!!data.errors){
        this.message=data.errors;
        this.displayMessage();
      }
    }),
    this.formGrp=new FormGroup({
      'email':new FormControl('',[Validators.required,Validators.email]),
      'password':new FormControl('',[Validators.required]),
    });

    this.signUpForm=new FormGroup({
      "name":new FormControl('',[Validators.required]),
      'email':new FormControl('',[Validators.required,Validators.email]),
      'password':new FormControl('',[Validators.required,Validators.minLength(6)]),
    })
  }
  onLogin(){
    this.store.dispatch(new authActions.LoginStart({email:this.formGrp.get('email').value,password:this.formGrp.get('password').value}));
    this.formGrp.reset();
  }
  onSignup(){
    this.store.dispatch(new authActions.SignUp({name:this.signUpForm.get('name').value,email:this.signUpForm.get('email').value,password:this.signUpForm.get('password').value}));
    this.signUpForm.reset();
  }
  displayMessage(){
    let alert=this.compFac.resolveComponentFactory(AlertComponent);
    let host=this.alertDir.vcRef;
    host.clear();
    let comp=host.createComponent(alert);
    comp.instance.message=this.message;
    this.compSubs=comp.instance.closeEvent.subscribe(()=>{
      host.clear()
      this.compSubs.unsubscribe();
      this.message=null;
      
    });
  }
  ngOnDestroy(){
    this.store.dispatch(new authActions.ResetLogin());
    if(!!this.compSubs){
      this.compSubs.unsubscribe();
    }
    this.storeSubs.unsubscribe();
  }
}
