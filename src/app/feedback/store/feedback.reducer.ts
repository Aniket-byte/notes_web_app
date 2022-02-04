import * as feedbackActions from "./feedback.actions";

export interface State{
    submitted:boolean,
    error:boolean,
    loading:boolean,
}

export const initialState:State={
    submitted:false,
    error:false,
    loading:false,
}

export function feedbackReducer(state=initialState,action:feedbackActions.FeedActions){
    switch(action.type){
        case feedbackActions.START_FEEDBACK:
            return {
                ...state,
                submitted:false,
                error:false,
                loading:true,
                }
        case feedbackActions.SUCCESS_FEEDBACK:
            return {
                ...state,
                submitted:true,
                error:false,
                loading:false,
                }    
        case feedbackActions.FAIL_FEEDBACK:
            return {
                ...state,
                submitted:true,
                error:true,
                loading:false
                }
        case feedbackActions.RESET_FEEDBACK:
            return{
                ...state,
                submitted:false,
                error:false,
                loading:false,
            }        
        default:
            return {...state};        
    }
}