import { Component, OnInit, OnDestroy, ViewChild, ComponentFactoryResolver, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import { Store } from "@ngrx/store";
import { AppState } from '../Shared/AppSate';
import * as fromActions from "./store/feedback.actions";
import { transition,trigger,animate,style,keyframes } from "@angular/animations"
import { Subscription } from 'rxjs';
import { AlertDirective } from '../Shared/alert-component/alert.directive';
import { AlertComponent } from '../Shared/alert-component/alert.component';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css'],
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
export class FeedbackComponent implements OnInit,OnDestroy {

  compSubs:Subscription;
  storeSubs:Subscription;
  loading:boolean=false;
  submitted:boolean=false;
  message:string;
  formGrp:FormGroup;
  @ViewChild(AlertDirective,{static:true}) alertDir:AlertDirective;

  constructor(private store:Store<AppState>,private compFac:ComponentFactoryResolver) { }
  
  ngOnInit(): void {
     this.formGrp=new FormGroup({
       'name':new FormControl('',[Validators.required]),
       'email':new FormControl('',[Validators.required,Validators.email]),
       'feedback':new FormControl('',[Validators.required]),
     });

     this.storeSubs=this.store.select("feedback").subscribe((data)=>{
       if(data.submitted){
       this.message = data.error ? "An error occurred !" : "Thank you for your feedback !";
       this.displayMessage();
       }
       this.loading=data.loading;
       this.submitted=data.submitted;
     })
  }
  onSubmit(){
    this.store.dispatch(new fromActions.StartSubmit({name:this.formGrp.get("name").value,email:this.formGrp.get('email').value,feedback:this.formGrp.get('feedback').value}));
    this.formGrp.reset(); 
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
    });
  }
  ngOnDestroy(){
    this.storeSubs.unsubscribe();
    if(!!this.compSubs){
      this.compSubs.unsubscribe();
    }
  }
}
