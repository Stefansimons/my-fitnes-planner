import { IAuthUserData, User } from './../../../shared/models/user.model';
import * as UserActions from './user.actions';

export interface State {
  user: User;
}

const initialState: State = {
  user: null,
};

export function userReducer(
  state = initialState,
  action: UserActions.UserActions
) {
  switch (action.type) {
    case UserActions.ADD_USER:
      const user = {
        id: action.payload.id,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        username: action.payload.username,
        email: action.payload.email,
        password: action.payload.password,
        code: action.payload.code,
        trainings: action.payload.trainings,
        updatedAt: action.payload.updatedAt,
        role: action.payload.role,
        isActive: action.payload.isActive,
      };
      return {
        ...state,
        user: user,
      };
    default:
      return state;
  }
}
