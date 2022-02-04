import { Action } from "@ngrx/store";
import { UserModel } from '../user.model';

export const LOGIN_START="LOGIN_START";
export const AUTHENTICATE="AUTHENTICATE";
export const LOGIN_FAIL="LOGIN_FAIL";
export const LOGOUT="LOGOUT";
export const LOGIN_RESET="LOGIN_RESET";
export const AUTO_LOGIN="AUTO_LOGIN";
export const SIGNUP="SIGNUP";

export class LoginStart implements Action{
    readonly type=LOGIN_START;
    constructor(public payload:{email:string,password:string}){}
}

export class Authenticate implements Action{
    readonly type=AUTHENTICATE;
    constructor(public payload:{user:UserModel,redirect:boolean}){}
}

export class LoginFail implements Action{
    readonly type=LOGIN_FAIL;
    constructor(public payload:string){}
}

export class Logout implements Action{
    readonly type=LOGOUT;
}

export class ResetLogin implements Action{
    readonly type=LOGIN_RESET;
}

export class AutoLogin implements Action{
    readonly type=AUTO_LOGIN;
}

export class SignUp implements Action{
    readonly type=SIGNUP;
    constructor(public payload:{name:string,email:string,password:string}){}
}

export type AuthActions = LoginStart | Authenticate | LoginFail | Logout | ResetLogin | AutoLogin | SignUp;


