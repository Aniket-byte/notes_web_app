import { Component, OnInit, OnDestroy, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { FormGroup, FormControl,Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { trigger,transition,style,animate,keyframes } from '@angular/animations';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/Shared/AppSate';
import * as notesActions from "../store/notes.actions";
import { Subscription } from 'rxjs';
import { AlertDirective } from 'src/app/Shared/alert-component/alert.directive';
import { AlertComponent } from 'src/app/Shared/alert-component/alert.component';

@Component({
  selector: 'app-create-notes',
  templateUrl: './create-notes.component.html',
  styleUrls: ['./create-notes.component.css'],
  animations:[
    trigger("messageState",[
    transition("void => *",[style({opacity:0,transform:'translateY(50px)'}),
    animate(250,keyframes([
      style({opacity:0.3,offset:0.3,transform:"translateY(40px)"}),
      style({opacity:0.5,offset:0.5,transform:"translateY(30px)"}),
      style({opacity:0.7,offset:0.7,transform:"translateY(20px)"}),
      style({opacity:0.9,offset:0.9,transform:"translateY(10px)"}),
      style({opacity:1,offset:1,transform:"translateY(0px)"}),
    ]))])
  ]),  
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
  ]),]
})
export class CreateNotesComponent implements OnInit,OnDestroy {

  @ViewChild(AlertDirective,{static:true}) aldir:AlertDirective;
  notesForm:FormGroup;
  loading:boolean=false;
  message:string=null;
  storeSubs:Subscription;
  compSubs:Subscription;

  constructor(private cfr:ComponentFactoryResolver,private router:Router,private store:Store<AppState>) { }
 
  ngOnInit(): void {
    this.storeSubs=this.store.select('notes').subscribe((data)=>{
      this.loading=data.loading;
      if(!!data.error){
        console.log(data.error);
        this.message=data.error;
        this.displayMessage();
      }
    })
    this.notesForm=new FormGroup({
      'title':new FormControl('',[Validators.required]),
      'content':new FormControl('',[Validators.required]),
      'links':new FormArray([]),
    })
  }
  getFormControlError(index:number){
    return (<FormArray>this.notesForm.get("links")).controls[index].hasError('required');
  }
  onCancel(){
    this.router.navigate(['/notes']);
  }
  addLink(){
    const formControl=new FormControl('',Validators.required);
    (<FormArray>this.notesForm.get('links')).push(formControl)
  }
  getFormArray(){
    return (<FormArray>this.notesForm.get('links')).controls;
  }
  onRemove(index:number){
    (<FormArray>this.notesForm.get('links')).removeAt(index);
  }
  getFormControltouched(index:number){
    return (<FormArray>this.notesForm.get("links")).controls[index].touched;
  }
  displayMessage(){
    let cf=this.cfr.resolveComponentFactory(AlertComponent);
    let host=this.aldir.vcRef;
    host.clear();
    let component=host.createComponent(cf);
    let inst1=component.instance;
    inst1.message=this.message;
    let inst2=component.instance;
    this.compSubs=inst2.closeEvent.subscribe(()=>{
      host.clear();
      this.compSubs.unsubscribe();
    });
  }
  onSubmit(){
    let linksArray=[];
    for(let item of (<FormArray>this.notesForm.get("links")).controls){
      linksArray.push(item.value);
    }

    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let dateTime = date+' '+time;

    this.store.dispatch(new notesActions.AddNotes({title:this.notesForm.get('title').value,content:this.notesForm.get('content').value,date:dateTime,links:linksArray}));
  }
  ngOnDestroy(){
    this.storeSubs.unsubscribe();
    if(!!this.compSubs){
      this.compSubs.unsubscribe();
    }
    this.store.dispatch(new notesActions.ErrorReset());
  }
}
