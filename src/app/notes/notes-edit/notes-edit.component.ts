import { Component, OnInit, OnDestroy, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { exhaustMap, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/Shared/AppSate';
import { NotesModel } from '../notesModel';
import { animate,transition,trigger,style,keyframes } from "@angular/animations";
import { Subscription } from 'rxjs';
import * as notesActions from "../store/notes.actions";
import { AlertComponent } from 'src/app/Shared/alert-component/alert.component';
import { AlertDirective } from 'src/app/Shared/alert-component/alert.directive';
import { SaveService } from './notes-save.service';
import { ideact } from "./deactivate-guard.service";

@Component({
  selector: 'app-notes-edit',
  templateUrl: './notes-edit.component.html',
  styleUrls: ['./notes-edit.component.css'],
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
export class NotesEditComponent implements OnInit,OnDestroy,ideact {
  
  @ViewChild(AlertDirective,{static:true}) aldir:AlertDirective;
  message:string;
  compSubs:Subscription;
  paramsSubs:Subscription;
  loading:boolean=true;
  note:NotesModel;
  notesEdit:FormGroup;
  formArray:FormArray;
  index:number;

  constructor(private cfr:ComponentFactoryResolver,
    private router:Router,
    private aroute:ActivatedRoute,
    private saveService:SaveService,
    private store:Store<AppState>) { }
 
  ngOnInit(): void {
    
    this.paramsSubs=this.aroute.params.pipe(exhaustMap((paramData:Params)=>{
      return this.store.select("notes").pipe(map((data)=>{
        this.message=data.error;
        this.loading=data.loading;
        this.index=+paramData['id']
        return data.notes[this.index];
      }));
    })).subscribe(data=>{
      if(!!data){
      if(!!this.message){
        this.displayMessage();
      }

      this.note=data;
      this.formArray=new FormArray([]);
      if(data.hasOwnProperty('links')){
        for(let link of this.note.links){
          this.formArray.push(new FormControl(link));
        }
      }

      this.notesEdit=new FormGroup({
        'title':new FormControl(data.title,[Validators.required]),
        'content':new FormControl(data.content,[Validators.required]),
        'links':this.formArray,
      });

    }
    });
  }
  getFormControlError(index:number){
    return (<FormArray>this.notesEdit.get('links')).controls[index].hasError('required');
  }
  getFormControltouched(index:number){
    return (<FormArray>this.notesEdit.get('links')).controls[index].touched;
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
    let linkArray=[];

    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let dateTime = date+' '+time;

    for(let link of (<FormArray>this.notesEdit.get('links')).controls){
      linkArray.push(link.value);
    }
    if(linkArray.length > 0){
      this.store.dispatch(new notesActions.UpdateStart({notes:{title:this.notesEdit.get('title').value,content:this.notesEdit.get('content').value,date:dateTime,links:linkArray},index:this.index}));
    }
    else{
      this.store.dispatch(new notesActions.UpdateStart({notes:{title:this.notesEdit.get('title').value,content:this.notesEdit.get('content').value,date:dateTime},index:this.index}));
    }
  }
  onRemove(index:number){
    (<FormArray>this.notesEdit.get('links')).removeAt(index);
    this.saveService.saveSatus=false;
  }
  getFormArray(){
    return (<FormArray>this.notesEdit.get('links')).controls;
  }
  addLink(){
    const fc=new FormControl('',Validators.required);
    (<FormArray>this.notesEdit.get('links')).push(fc);
  }
  onCancel(){
    if(!this.saveService.saveSatus){
      this.saveService.saveSatus=false;
    }
    this.router.navigate(["../",'view-notes'],{relativeTo:this.aroute});
  }
  canDeactivate(){
    return confirm("Do you want to exit without saving ?");
  }
  getStatus(){
    return this.saveService.saveSatus;
  }
  changeSaveStatus(){
    this.saveService.saveSatus=false;
  }
  ngOnDestroy(){
    this.paramsSubs.unsubscribe();
    if(!!this.compSubs){
      this.compSubs.unsubscribe();
    }
    this.store.dispatch(new notesActions.ErrorReset());
    this.saveService.saveSatus=true;
  }
}
