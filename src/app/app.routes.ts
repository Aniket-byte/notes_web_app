import { NgModule } from '@angular/core';
import { Routes,RouterModule } from "@angular/router";

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NotesComponent } from './notes/notes.component';
import { NotesEditComponent } from './notes/notes-edit/notes-edit.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { AuthComponent } from './auth/auth.component';
import { CanActivateGuard } from './notes/canactivate.guard';
import { NotesListComponent } from './notes/notes-list/notes-list.component';
import { CreateNotesComponent } from './notes/create-notes/create-notes.component';
import { ViewNotesComponent } from './notes/view-notes/view-notes.component';
import { DeactivateGuard } from './notes/notes-edit/deactivate-guard.service';

const routes:Routes=[
    {path:'',component:HomeComponent},
    {path:'notes',component:NotesComponent,canActivate:[CanActivateGuard],children:[
        {path:'',component:NotesListComponent},
        {path:'create',component:CreateNotesComponent},
        {path:':id/edit',component:NotesEditComponent,canDeactivate:[DeactivateGuard]},
        {path:":id/view-notes",component:ViewNotesComponent},
    ]},
    {path:'feedback',component:FeedbackComponent},
    {path:'auth',component:AuthComponent}
]
@NgModule({
    imports:[RouterModule.forRoot(routes,{useHash:true})],
    exports:[RouterModule]
})
export class AppRoutes{}