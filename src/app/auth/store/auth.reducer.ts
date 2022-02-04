import { UserModel } from '../user.model';
import * as authActions from "./auth.actions";

export interface State{
    user:UserModel,
    errors:string,
    loading:boolean,
}

export const initialState:State={
    user:null,
    errors:null,
    loading:false,
}

export function authReducer(state:State=initialState,action:authActions.AuthActions){
    switch(action.type){
        case authActions.LOGIN_START:
            return {
                ...state,
                user:null,
                errors:null,
                loading:true,
            }
        case authActions.AUTHENTICATE:
            return {
                ...state,
                user:action.payload.user,
                errors:null,
                loading:false,
            }
        case authActions.LOGIN_FAIL:
            return {
                ...state,
                user:null,
                errors:action.payload,
                loading:false,
            }    
        case authActions.LOGOUT:
            return {
                ...state,
                user:null,
                errors:null,
                loading:false,
            }  
        case authActions.LOGIN_RESET:
            return {
                ...state,
                errors:null,
            }    
        case authActions.SIGNUP:
            return {
                ...state,
                user:null,
                errors:null,
                loading:true,
            }    
        default:
            return {...state};      
    }
}