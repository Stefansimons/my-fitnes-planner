import { ToastService } from './../../../shared/services/toast.service';
import { SpinnerService } from './../../../shared/services/spinner.service';
import { UserActions } from './user.actions';
import { IAuthUserData, User } from './../../../shared/models/user.model';
import { environment } from './../../../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { of } from 'rxjs';
import { AuthenticationService } from '../authentication.service';
//import { HttpRequestsService } from 'src/app/modules/shared/services/http-requests.service';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}
/**
 *
 * @param userId
 * @param token
 * @param refreshToken
 * @param expiresIn
 * @returns
 */
const handleAuthentication = (
  userId: string,
  token: string,
  refreshToken: string,
  expiresIn: number
) => {
  // Expiration Date
  const day = new Date().getDate();
  const month = new Date().getMonth();
  const year = new Date().getFullYear();
  const hours = new Date().getHours() + 2; // TIMEZONE OFFSET
  const minutes = new Date().getMinutes();
  const seconds = new Date().getSeconds();

  const expirationDate = new Date(
    new Date(year, month, day, hours, minutes, seconds).getTime() + 120 * 1000
  );

  const tokentest: IAuthUserData = {
    id: userId,
    token: {
      accessToken: token,
      tokenExpirationDate: expirationDate,
      refreshToken: refreshToken,
    },
  };
  localStorage.setItem('token', JSON.stringify(tokentest));
  return new AuthActions.AuthenticateSuccess({
    userId: userId,
    token: token,
    expirationDate: expirationDate,
    refreshToken: refreshToken,
  });
};
/**
 *
 * @param errorRes
 * @returns
 */
const handleError = (errorRes: any) => {
  let errorMessage = 'An unknown error occurred!';
  if (!errorRes.error || !errorRes.error.error) {
    return of(new AuthActions.AuthenticateFail(errorMessage));
  }
  switch (errorRes.error.error.message) {
    case 'EMAIL_EXISTS':
      errorMessage = 'This email exists already';
      break;
    case 'EMAIL_NOT_FOUND':
      errorMessage = 'This email does not exist.';
      break;
    case 'INVALID_PASSWORD':
      errorMessage = 'This password is not correct.';
      break;
  }
  return of(new AuthActions.AuthenticateFail(errorMessage));
};

// /**
//    *
//    * @param expirationDuration
//    */
// const setLogoutTimer = (expirationDuration: number) => {
//   this.tokenExpirationTimer = setTimeout(() => {
//     this.store.dispatch(new AuthActions.Logout());
//   }, expirationDuration);
// }

// /**
//  *
//  */
// clearLogoutTimer() {
//   if (this.tokenExpirationTimer) {
//     clearTimeout(this.tokenExpirationTimer);
//     this.tokenExpirationTimer = null;
//   }
// }
/**
 *
 * @param user
 */
// const handleUser = (user: User) => {
//   return this.store.dispatch(new UserActions.AddUser(user));
//   this._loggedUserSource.next(user);
//   localStorage.setItem('user', JSON.stringify(user));
//   return new AuthActions.AuthenticateSuccess({
//     userId: userId,
//     token: token,
//     expirationDate: expirationDate,
//     refreshToken: refreshToken,
//   });
// };

@Injectable()
export class AuthEffects {
  // Effects: Subscribe doing angular and ngrx

  /**
   * Sign Up user
   */
  authSignup = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.SIGNUP_START),
      switchMap((signupAction: AuthActions.SignupStart) => {
        return this.httpS
          .post<AuthResponseData>(
            `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebase.apiKey}`,
            {
              email: signupAction.payload.email,
              password: signupAction.payload.password,
              returnSecureToken: true,
            }
          )
          .pipe(
            tap((resData) => {
              this.authService.setLogoutTimer(+resData.expiresIn * 1000);
            }),
            map((resData) => {
              return handleAuthentication(
                resData.localId,
                resData.idToken,
                resData.refreshToken,
                +resData.expiresIn
              );
            }),
            catchError((errorRes) => {
              return handleError(errorRes);
            })
          );
      })
    );
  });

  // TODO zavrsiti ovaj effect, pozivanje apija ya uzimanje user data kad se loguje
  // @Effect() NOTE: Deprecated
  authLogin$ = createEffect(() => {
    // Returns Observable<Action>
    return this.actions$.pipe(
      ofType(AuthActions.LOGIN_START), // Operator from ngrx
      switchMap((authData: AuthActions.LoginStart) => {
        return this.httpS
          .post<AuthResponseData>(
            `https:identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebase.apiKey}`,
            {
              email: authData.payload.email,
              password: authData.payload.password,
              returnSecureToken: true,
            }
          )
          .pipe(
            tap((resData) => {
              this.authService.setLogoutTimer(+resData.expiresIn);
            }),
            map((resData) => {
              return handleAuthentication(
                resData.localId,
                resData.idToken,
                resData.refreshToken,
                +resData.expiresIn
              );
            }),

            catchError((errorRes) => handleError(errorRes))
          );
      })
    );
  });

  //  loginFailedSub$ =

  //  loginSuccessSub$ =

  constructor(
    private actions$: Actions,
    private httpS: HttpClient,
    private authService: AuthenticationService,
    //  private hS: HttpRequestsService,
    private sS: SpinnerService,
    private ts: ToastService
  ) {
    // private hS: HttpRequestsService,
    // private appConfS: AppConfigService,
    // private authS: AuthenticationService
    // NOTE : Services are injected before app initialize!! so config for HttpRequestsService and AuthenticationService are undefined
  }
}
