import { IAuthUserData } from './../../../shared/models/user.model';
import * as AuthActions from './auth.actions';

export interface State {
  user: IAuthUserData;
}

const initialState: State = {
  user: null,
};

export function authReducer(
  state = initialState,
  action: AuthActions.AuthActions
) {
  switch (action.type) {
    case AuthActions.LOGIN:
      // id: action.payload.id,
      // firstName:action.payload.firstName,
      // lastName:action.payload.lastName,
      // username:action.payload.username,
      // email:action.payload.email,
      // password:action.payload.password,
      // code:action.payload.code,
      // trainings: action.payload.trainings,
      // token: action.payload.token,
      // updatedAt: action.payload.updatedAt,
      // role: action.payload.role,
      // isActive: action.payload.isActive,

      const authUser = {
        id: action.payload.userId,
        token: {
          accessToken: action.payload.token,
          tokenExpirationDate: action.payload.expirationDate,
          refreshToken: action.payload.refreshToken,
        },
      };
      return {
        ...state,
        user: authUser,
      };
    case AuthActions.LOGOUT:
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
}
