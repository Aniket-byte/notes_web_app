import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { AppState } from 'src/app/Shared/AppSate';
import { Store } from '@ngrx/store';
import { ActivatedRoute,Params, Router } from '@angular/router';
import { exhaustMap,map } from 'rxjs/operators';
import { NotesModel } from '../notesModel';
import { trigger,transition,style,keyframes,animate } from "@angular/animations";
import { Subscription } from 'rxjs';
import { DOCUMENT } from "@angular/common";

@Component({
  selector: 'app-view-notes',
  templateUrl: './view-notes.component.html',
  styleUrls: ['./view-notes.component.css'],
  animations:[trigger('contentState',[transition("void => *",[
    style({opacity:0,transform:'translateY(-100px)'}),
    animate(300,keyframes([
      style({opacity:0.3,offset:0.3,transform:"translateY(-80px)"}),
      style({opacity:0.5,offset:0.5,transform:"translateY(-60px)"}),
      style({opacity:0.7,offset:0.7,transform:"translateY(-40px)"}),
      style({opacity:0.9,offset:0.9,transform:"translateY(-20px)"}),
      style({opacity:1,offset:1,transform:"translateY(0px)"}),
    ]))
  ])]), trigger('btnState',[transition('void => *',[style({opacity:0,transform:"translateY(100px)"}),
    animate(300,keyframes([
      style({opacity:0.3,offset:0.3,transform:"translateY(80px)"}),
      style({opacity:0.5,offset:0.5,transform:"translateY(60px)"}),
      style({opacity:0.7,offset:0.7,transform:"translateY(40px)"}),
      style({opacity:0.9,offset:0.9,transform:"translateY(20px)"}),
      style({opacity:1,offset:1,transform:"translateY(0px)"}),
    ]))])])]
})
export class ViewNotesComponent implements OnInit,OnDestroy {
  note:NotesModel;
  loading:boolean=true;
  paramsSubs:Subscription;
  index:number=-1;
  constructor(@Inject(DOCUMENT) private  document:Document,private store:Store<AppState>,
    private aroute:ActivatedRoute,
    private router:Router) { }

  ngOnInit(): void {
    this.paramsSubs=this.aroute.params.pipe(
     exhaustMap((paramsData:Params)=>{
       return this.store.select('notes').pipe(
         map(data=>{
           this.index=+paramsData['id'];
           return data.notes[+paramsData['id']];
         }));
     })
    ).subscribe(data=>{
      if(!!data){
        this.note=data;
        this.loading=false;
      }
    });
  }
  onEdit(){
    this.router.navigate(["../","edit"],{relativeTo:this.aroute});
  }
  goToLink(link:string){
    this.document.location.href=link;
  }
  ngOnDestroy(){
    this.paramsSubs.unsubscribe();
  }
}
