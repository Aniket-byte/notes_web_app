import { NotesModel } from '../notesModel';
import * as notesActions from "./notes.actions";
import { act } from '@ngrx/effects';

export interface State{
    notes:NotesModel[],
    error:string,
    loading:boolean,
}

const initialState:State={
    notes:[],
    error:null,
    loading:null,
}

export function notesReducer(state:State=initialState,action:notesActions.NotesActions){
    switch(action.type){
        case notesActions.START_FETCH:
            return {
                ...state,
                notes:[],
                error:null,
                loading:true,
            }
        case notesActions.FETCH_SUCCESS:
            return {
                ...state,
                notes:action.payload.notes,
                error:null,
                loading:false,
            }    
        case notesActions.FETCH_FAIL:
            return {
                ...state,
                notes:[],
                error:action.payload,
                loading:false,
            }

        case notesActions.ADD_SUCCESS:
            return {
                ...state,
                notes:action.payload,
                error:null,
                loading:false,
            }

        case notesActions.ADD_FAIL:
            return {
                ...state,
                error:action.payload,
                loading:false,
            }    
        case notesActions.CLEAR_NOTES:
            return {
                ...state,
                notes:[],
                error:null,
                loading:false,
            }
        case notesActions.DELETEALL_NOTES:
            return {
                ...state,
                loading:true,
            }    
        case notesActions.DELETE_SUCCESS:
            return {
                ...state,
                notes:[],
                error:null,
                loading:false,
            }    
        case notesActions.DELETE_NOTE:
            return {
                ...state,
                loading:true,
            }  
        case notesActions.DELETE_FAIL:
            return {
                ...state,
                error:action.payload,
                loading:false,
            }   
        case notesActions.DELETENOTE_SUCCESS:
            return {
                ...state,
                notes:action.payload,
                error:null,
                loading:false,
            } 
        case notesActions.RESET_ERROR:
            return {
                ...state,
                error:null,
            }
        case notesActions.UPDATE_START:
            return {
                ...state,
                loading:true,
            }            
        case notesActions.UPDATE_SUCCESS:
            return {
                ...state,
                notes:action.payload,
                error:null,
                loading:false,
            }    
        case notesActions.UPDATE_FAIL:
            return {
                ...state,
                error:action.payload,
                loading:false,
            }    
        default:
            return {...state};        
    }
}