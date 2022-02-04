import { Action } from '@ngrx/store';

export const START_FEEDBACK="START_FEEDBACK";
export const SUCCESS_FEEDBACK="SUCCESS_FEEDBACK";
export const FAIL_FEEDBACK="FAIL_FEEDBACK";
export const RESET_FEEDBACK="RESET_FEEDBACK";

export class StartSubmit implements Action{
    readonly type=START_FEEDBACK;
    constructor(public payload:{name:string,email:string,feedback:string}){}
}

export class SuccessFeedback implements Action{
    readonly type=SUCCESS_FEEDBACK;
}

export class FailFeedback implements Action{
    readonly type=FAIL_FEEDBACK;
}

export class ResetProgress implements Action{
    readonly type=RESET_FEEDBACK;
}

export type FeedActions = StartSubmit | SuccessFeedback | FailFeedback | ResetProgress;