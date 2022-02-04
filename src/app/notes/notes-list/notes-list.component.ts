import { Component, OnInit, OnDestroy, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { AppState } from 'src/app/Shared/AppSate';
import { Store } from '@ngrx/store';
import { NotesModel } from '../notesModel';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import * as notesActions from "../store/notes.actions";
import { trigger,transition,style,keyframes,animate } from "@angular/animations";
import { AlertDirective } from 'src/app/Shared/alert-component/alert.directive';
import { AlertComponent } from 'src/app/Shared/alert-component/alert.component';

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.css'],
  animations:[trigger("cardState",[transition("void => *",[style({opacity:0,transform:'scale(0.5,0.5)'}),
  animate(300,keyframes([
    style({opacity:0.3,offset:0.3,transform:'scale(0.6,0.6)'}),
    style({opacity:0.5,offset:0.5,transform:'scale(0.7,0.7)'}),
    style({opacity:0.7,offset:0.7,transform:'scale(0.8,0.8)'}),
    style({opacity:0.9,offset:0.9,transform:'scale(0.9,0.9)'}),
    style({opacity:1,offset:1,transform:'scale(1,1)'}),
  ]))])])]
})
export class NotesListComponent implements OnInit,OnDestroy {

  @ViewChild(AlertDirective,{static:true}) aldir:AlertDirective;
  compSubs:Subscription;
  notesArray:NotesModel[]=[];
  message:string=null;
  loading:boolean=false;
  storeSubs:Subscription;

  constructor(private router:Router,
    private aroute:ActivatedRoute,
    private store:Store<AppState>,
    private cfr:ComponentFactoryResolver) { }

  ngOnInit(): void {
    this.storeSubs=this.store.select('notes').subscribe((data)=>{
      this.notesArray=data.notes;
      this.loading=data.loading;
      if(!!data.error){
        console.log(data.error);
        this.message=data.error;
        this.displayMessage();
      }
    });
  }
  onCreate(){
    this.router.navigate(['create'],{relativeTo:this.aroute});
  }
  deleteAll(){
    this.store.dispatch(new notesActions.DeleteAllNotes());
  }
  deleteNote(index:number){
    let ans=confirm("Do you want to delete this note ?")
    if(ans){
    this.store.dispatch(new notesActions.DeleteNote(index));
    }
    else{}
  }
  viewNote(index:number){
    this.router.navigate([index,"view-notes"],{relativeTo:this.aroute});
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
  ngOnDestroy(){
    this.storeSubs.unsubscribe();
    if(!!this.compSubs){
      this.compSubs.unsubscribe();
    }
    this.store.dispatch(new notesActions.ErrorReset());
  }
}
