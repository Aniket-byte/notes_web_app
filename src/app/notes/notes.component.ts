import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../Shared/AppSate';
import * as notesActions from "./store/notes.actions";
import { NotesModel } from './notesModel';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {
  constructor(private store:Store<AppState>,private router:Router,private aroute:ActivatedRoute) { }

  ngOnInit(): void {
    this.store.dispatch(new notesActions.StartFetch());
  }
}
