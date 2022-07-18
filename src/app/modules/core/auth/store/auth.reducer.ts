import { IAuthUserData } from './../../../shared/models/user.model';
import * as AuthActions from './auth.actions';

export interface State {
  user: IAuthUserData;
  authError: string;
  loading: boolean;
}

const initialState: State = {
  user: null,
  authError: null,
  loading: false,
};

export function authReducer(
  state = initialState,
  action: AuthActions.AuthActions
) {
  switch (action.type) {
    case AuthActions.AUTHENTICATE_SUCCESS:
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
        authError: null,
        user: authUser,
        loading: false,
      };
    case AuthActions.LOGOUT:
      return {
        ...state,
        user: null,
      };
    case AuthActions.LOGIN_START:
    case AuthActions.SIGNUP_START:
      return {
        ...state,
        authError: null,
        loading: true,
      };
    case AuthActions.AUTHENTICATE_FAIL:
      return {
        ...state,
        user: null,
        authError: action.payload,
        loading: false,
      };
    case AuthActions.CLEAR_ERROR:
      return {
        ...state,
        authError: null,
      };
    default:
      return state;
  }
}
