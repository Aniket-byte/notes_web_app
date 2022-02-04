import * as fromFeed from "../feedback/store/feedback.reducer";
import * as fromAuth from "../auth/store/auth.reducer";
import * as fromNotes from "../notes/store/notes.reducer";
import { ActionReducerMap } from '@ngrx/store';


export interface AppState{
    'auth':fromAuth.State,
    'feedback':fromFeed.State,
    'notes':fromNotes.State,
}

export const StoreState:ActionReducerMap<AppState>={
    'auth':fromAuth.authReducer,
    'feedback':fromFeed.feedbackReducer,
    'notes':fromNotes.notesReducer,
}