import { Training } from './../../../training/models/training.model';
import { IToken, ROLE } from './../../../shared/models/user.model';
import { Action } from '@ngrx/store';
export const ADD_USER = '[User] Add user';

export class AddUser implements Action {
  readonly type = ADD_USER;

  constructor(
    public payload: {
      id: string;
      firstName: string;
      lastName: string;
      username: string;
      email: string;
      password: string;
      code: string;
      trainings: Training[];
      updatedAt: Date;
      role?: ROLE;
      isActive: boolean;
    }
  ) {}
}

export type UserActions = AddUser;
