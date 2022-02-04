import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from "@angular/forms";
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { FeedEffects } from "./feedback/store/feedback.effects";
import { StoreState } from "./Shared/AppSate";
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NotesComponent } from './notes/notes.component';
import { NotesEditComponent } from './notes/notes-edit/notes-edit.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { AppRoutes } from './app.routes';
import { AppSpinner } from "./Shared/spinner-component/spinner.component";
import { AlertComponent } from "./Shared/alert-component/alert.component"
import { AlertDirective } from './Shared/alert-component/alert.directive';
import { AuthComponent } from './auth/auth.component';
import { AuthEffects } from './auth/store/auth.effects';
import { CanActivateGuard } from './notes/canactivate.guard';
import { NotesListComponent } from "./notes/notes-list/notes-list.component";
import { CreateNotesComponent } from "./notes/create-notes/create-notes.component";
import { NotesEffects } from './notes/store/notes.effects';
import { ViewNotesComponent } from './notes/view-notes/view-notes.component';
import { TitlePipe } from './notes/notes-list/title.pipe';
import { SaveService } from './notes/notes-edit/notes-save.service';
import { DeactivateGuard } from './notes/notes-edit/deactivate-guard.service';
import { LinkPipe } from './notes/link.pipe';
import { InterceptorService } from './Shared/interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NotesComponent,
    NotesEditComponent,
    FeedbackComponent,
    AppSpinner,
    AlertComponent,
    AlertDirective,
    AuthComponent,
    CreateNotesComponent,
    NotesListComponent,
    ViewNotesComponent,
    TitlePipe,
    LinkPipe, 
  ],
  imports: [
    BrowserModule,
    AppRoutes,
    ReactiveFormsModule,
    HttpClientModule,
    StoreModule.forRoot(StoreState),
    EffectsModule.forRoot([FeedEffects,AuthEffects,NotesEffects]),
    BrowserAnimationsModule,
  ],
  providers: [{provide:HTTP_INTERCEPTORS,useClass:InterceptorService,multi:true},CanActivateGuard,SaveService,DeactivateGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
