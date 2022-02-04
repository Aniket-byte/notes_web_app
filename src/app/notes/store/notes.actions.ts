import { Action } from "@ngrx/store";
import { NotesModel } from '../notesModel';

export const START_FETCH="START_FETCH";
export const FETCH_SUCCESS="FETCH_SUCCESS";
export const FETCH_FAIL="FETCH_FAIL";
export const ADD_NOTES="ADD_NOTES";
export const EDIT_NOTES="EDTI_NOTES";
export const ADD_SUCCESS="ADD_SUCCESS";
export const ADD_FAIL="ADD_FAIL";
export const CLEAR_NOTES="CLEAR_NOTES";
export const DELETEALL_NOTES="DELETEALL_NOTES";
export const DELETE_SUCCESS="DELETE_SUCCESS";
export const DELETENOTE_SUCCESS="DELETENOTE_SUCCESS";
export const DELETE_NOTE="DELETE_NOTE";
export const DELETE_FAIL="DELETE_FAIL";
export const RESET_ERROR="[notes] RESET_ERROR";
export const UPDATE_START="[notes] UPDATE_START";
export const UPDATE_SUCCESS="[notes] UPDATE_SUCCESS";
export const UPDATE_FAIL="[notes] UPDATE_FAIL";

export class StartFetch implements Action{
    readonly type=START_FETCH;
}
export class FetchSuccess implements Action{
    readonly type=FETCH_SUCCESS;
    constructor(public payload:{notes:NotesModel[]}){}
}

export class FetchFail implements Action{
    readonly type=FETCH_FAIL;
    constructor(public payload:string){}
}

export class AddNotes implements Action{
    readonly type=ADD_NOTES;
    constructor(public paload:NotesModel){}
}

export class AddSuccess implements Action{
    readonly type=ADD_SUCCESS;
    constructor(public payload:NotesModel[]){}
}

export class AddFail implements Action{
    readonly type=ADD_FAIL;
    constructor(public payload:string){}
}
export class ClearNotes implements Action{
    readonly type=CLEAR_NOTES;
}

export class DeleteAllNotes implements Action{
    readonly type=DELETEALL_NOTES;
}

export class DeleteNote implements Action{
    readonly type=DELETE_NOTE;
    constructor(public payload:number){}
}

export class DeleteNoteSuccess implements Action{
    readonly type=DELETENOTE_SUCCESS;
    constructor(public payload:NotesModel[]){}
}

export class DeleteSuccess implements Action{
    readonly type=DELETE_SUCCESS;
}

export class DeleteFail implements Action{
    readonly type=DELETE_FAIL;
    constructor(public payload:string){}
}

export class ErrorReset implements Action{
    readonly type=RESET_ERROR;
}

export class UpdateStart implements Action{
    readonly type=UPDATE_START;
    constructor(public payload:{index:number,notes:NotesModel}){}
}

export class UpdateSuccess implements Action{
    readonly type=UPDATE_SUCCESS;
    constructor(public payload:NotesModel[]){}
}

export class UpdateFail implements Action{
    readonly type=UPDATE_FAIL;
    constructor(public payload:string){}
}

export type NotesActions=StartFetch | 
FetchSuccess | 
FetchFail | 
AddNotes | 
AddSuccess | 
AddFail | 
ClearNotes | 
DeleteAllNotes |
DeleteSuccess |
DeleteNote |
DeleteFail |
DeleteNoteSuccess |
ErrorReset |
UpdateStart |
UpdateSuccess |
UpdateFail;