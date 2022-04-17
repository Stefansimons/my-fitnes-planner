import { User } from './../../../shared/models/user.model';
import { Action } from '@ngrx/store';

export const LOGIN = '[Auth] Login'; // NOTE NGRX DOCS CONVETION FOR NAMING CONST ACTIONS, [FEATURE PIECE] NAME OF ACTIONS
export const LOGOUT = '[Auth] Logout';

export class Login implements Action {
  readonly type = LOGIN;

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

export class Logout implements Action {
  readonly type = LOGOUT;
}

export type AuthActions = Login | Logout;
