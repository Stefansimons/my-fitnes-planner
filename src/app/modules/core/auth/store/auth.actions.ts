import { User } from './../../../shared/models/user.model';
import { Action } from '@ngrx/store';

export const LOGIN_START = '[Auth] Login Start'; // NOTE NGRX DOCS CONVETION FOR NAMING CONST ACTIONS, [FEATURE PIECE] NAME OF ACTIONS
export const AUTHENTICATE_SUCCESS = '[Auth] Login';
export const AUTHENTICATE_FAIL = '[Auth] Login Fail'; //
export const SIGNUP_START = '[Auth] Signup Start';
export const CLEAR_ERROR = '[Auth] Clear Error'; //
export const AUTO_LOGIN = '[Auth] Auto Login';
export const LOGOUT = '[Auth] Logout';

export class AuthenticateSuccess implements Action {
  readonly type = AUTHENTICATE_SUCCESS;

  constructor(
    public payload: {
      userId: string;
      token: string;
      expirationDate: Date;
      refreshToken: string;
    }
  ) {}
  // id: string;
  // firstName: string;
  // lastName: string;
  // username: string;
  // email: string;
  // password: string;
  // code: string;
  // trainings: Training[];
  // token: IToken;
  // updatedAt: Date;
  // role?: ROLE;
  // isActive: boolean;
}

// Actions = class:
export class Logout implements Action {
  readonly type = LOGOUT;
}

export class LoginStart implements Action {
  readonly type = LOGIN_START;

  constructor(public payload: { email: string; password: string }) {}
}

export class AuthenticateFail implements Action {
  readonly type = AUTHENTICATE_FAIL;

  constructor(public payload: string) {}
}

export class SignupStart implements Action {
  readonly type = SIGNUP_START;

  constructor(
    public payload: {
      firstname: string;
      lastname: string;
      username: string;
      email: string;
      password: string;
    }
  ) {}
}

export class ClearError implements Action {
  readonly type = CLEAR_ERROR;
}

export class AutoLogin implements Action {
  readonly type = AUTO_LOGIN;
}

export type AuthActions =
  | AuthenticateSuccess
  | Logout
  | LoginStart
  | AuthenticateFail
  | SignupStart
  | ClearError
  | AutoLogin;
