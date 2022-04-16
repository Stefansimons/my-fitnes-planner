import { SpinnerService } from './../../shared/services/spinner.service';
import { Store } from '@ngrx/store';
import { environment } from './../../../../environments/environment.prod';
import { HttpRequestsService } from './../../shared/services/http-requests.service';
import { Router } from '@angular/router';
import { AppConfigService } from './../../../core/app-config.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FirestoreService } from './../../shared/services/firestore.service';
import { Observable, Subject, from, throwError } from 'rxjs';
import { ToastService } from './../../shared/services/toast.service';
import {
  ROLE,
  User,
  AuthResponseData,
  IAuthUserData,
} from './../../shared/models/user.model';
import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';

import { catchError, map, switchMap, tap } from 'rxjs/operators';
import * as fromApp from '../../../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private apiKey: string = this.conf.config.firebase.apiKey;
  private loggedUserData: User;
  private _loggedUserSource = new Subject<User | null>();
  public readonly loggedUserSource$ = this._loggedUserSource.asObservable();

  private _isLoggedUserSource = new Subject<boolean>();
  public readonly isLoggedUserSource$ = this._isLoggedUserSource.asObservable();
  private tokenExpirationTimer: any;

  private _userTokenSource = new Subject<IAuthUserData>();
  public readonly userTokenSource$ = this._userTokenSource.asObservable();
  constructor(
    private ts: ToastService,
    private sS: SpinnerService,
    private http: HttpClient,
    private conf: AppConfigService,
    private router: Router,
    private httpS: HttpRequestsService,
    private store: Store<fromApp.AppState>
  ) {}

  /**
   *
   * @param email
   * @param password
   * @returns
   */
  signup(
    firstName: string,
    lastName: string,
    username: string = '',
    email: string,
    password: string
  ) {
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apiKey}`,
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((resAuthData) => {
          console.log(`tap`);

          this.handleAuthentication(
            resAuthData.localId,
            resAuthData.idToken,
            resAuthData.refreshToken,
            +resAuthData.expiresIn
          );
        }),
        switchMap((resAuthData) => {
          console.log(`switchmap=>postavljena next value za token`);
          const userAuthData = {
            id: resAuthData.localId,
            token: {
              accessToken: resAuthData.idToken,
              tokenExpirationDate: new Date(
                new Date().getTime() + +resAuthData.expiresIn * 1000
              ),
              refreshToken: resAuthData.refreshToken,
            },
          };

          // this._userTokenSource.next(userAuthData);

          this.loggedUserData = {
            id: resAuthData.localId,
            firstName: firstName,
            lastName: lastName,
            username: username,
            email: resAuthData.email,
            password: password,
            code: '',
            token: userAuthData.token,
            updatedAt: new Date(),
            role: ROLE.Bodybuilder,
            isActive: true,
            trainings: [],
          };
          return this.httpS.postUserRequest(this.loggedUserData).pipe(
            catchError(this.handleError),
            tap((userName) => {
              this.sS.show();
              this.ts.show('Success', `Successful registration , please login`);
              // this.handleAuthentication(+resAuthData.expiresIn);
            })
          );
        })
      );
  }
  /**
   *
   * @param email
   * @param password
   * @returns
   */
  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`,
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((resAuthData) => {
          console.log(`tap za auth data`);

          this.handleAuthentication(
            resAuthData.localId,
            resAuthData.idToken,
            resAuthData.refreshToken,
            +resAuthData.expiresIn
          );
        }),
        switchMap((authUserData) => {
          console.log(`switchmap`);
          const userAuthData = {
            id: authUserData.localId,
            token: {
              accessToken: authUserData.idToken,
              tokenExpirationDate: new Date(
                new Date().getTime() + +authUserData.expiresIn * 1000
              ),
              refreshToken: authUserData.refreshToken,
            },
          };

          // Prepare token for setting to user...
          const token = userAuthData.token;
          console.log(`postavljen token useru..`);

          // this._userTokenSource.next(userAuthData);
          const userId = authUserData.localId;
          //TODO: Find better solution for this nested switch map
          let fbGeneratedId: string = '';
          // Call api for all users in order to retrieve generated key...
          return this.httpS.fetchUsersRequest().pipe(
            switchMap((responseUsersData) => {
              for (const [id, obj] of Object.entries(responseUsersData)) {
                if (obj.id === userId) {
                  fbGeneratedId = id;
                  break;
                }
              }
              // Call user by generated id..
              return this.httpS.fetchUserRequest(fbGeneratedId).pipe(
                catchError(this.handleError),
                tap((responseUserData) => {
                  console.log('tap za usera =>', responseUserData);

                  this.sS.show();
                  this.ts.show(
                    'Success',
                    `WELLCOME ${responseUserData.firstName} 🏋️‍♂️💪`
                  );
                  this.handleAuthentication(
                    responseUserData.id,
                    responseUserData.token.accessToken,
                    responseUserData.token.refreshToken,
                    +authUserData.expiresIn
                  );
                }),
                map((responseUserData) => {
                  console.log('map =>', responseUserData);
                  // ... then set the rest params to user
                  this.loggedUserData = { token: token, ...responseUserData };
                  console.log(
                    `postavljen ostatak  usera=>`,
                    this.loggedUserData
                  );
                })
              );
            }),
            catchError(this.handleError)
          );
        })
      );
  }

  /**
   * Logs user in
   * @param email
   * @param password
   * @returns
   */
  // login(email: string, password: string) {
  //   return from(this.fss.logUserIn(email, password)) // NOTE: With rxjs form operator i gives observable instead promise
  //     .pipe(
  //         tap(resData => {
  //         this.handleAuthentication(
  //           resData.email,
  //           resData.localId,
  //           resData.idToken,
  //           +resData.expiresIn
  //         );
  //       }),

  //       map((res) => {
  //         return res.user?.toJSON();
  //       }),
  //       switchMap((authUserData: any) => {
  //         const userToken = authUserData.stsTokenManager;

  //         return this.us.getFirebaseUser(authUserData.uid).pipe(
  //           tap((res) => {
  //             this.handleAuthentication(
  //               res.email,
  //               res.localId,
  //               res.idToken,
  //               +res.expiresIn
  //             );
  //             return (this.loggedUser = {
  //               token: userToken,
  //               ...res,
  //               role: ROLE.Bodybuilder,
  //             });
  //           }),
  //           catchError((error) => {
  //             this.ts.show('error', `something went wrong ${error}`);
  //             return throwError(error);
  //           })
  //         );
  //       }),
  //       catchError((error) => {
  //         this.ts.show('error', `something went wrong ${error}`);
  //         return throwError(error);
  //       })
  //     );
  // }

  /**
   *
   */
  get isLoggedUser() {
    return this.isLoggedUserSource$;
  }
  /**
   *
   */
  set setIsLoggedUser(isLoggedUser: boolean) {
    this._isLoggedUserSource.next(isLoggedUser);
  }
  /**
   *
   */
  // logUserOut() {
  //   this.fss.logout().then(() => this.ts.show('Success', `GOODBYE 👋`));
  // }
  /**
   * Registers user
   * @param email
   * @param password
   * @returns Observable
   */
  // register(
  //   email: string,
  //   password: string
  // ): Observable<firebase.auth.UserCredential> {
  //   return from(this.fss.register(email, password)).pipe(
  //     catchError((error) => {
  //       this.ts.show('error', `something went wrong ${error}`);
  //       return throwError(error);
  //     })
  //   );
  // }
  /**
   *
   * @returns
   */
  getLocalStorageUser() {
    const localStorageUser = localStorage.getItem('userData');
    if (localStorageUser) {
      return JSON.parse(localStorageUser);
    }

    return undefined;
  }
  /**
   *
   * @returns
   */
  isUserLoggedIn() {
    const localStorageUser = this.getLocalStorageUser();
    if (localStorageUser) {
      if (localStorageUser.token) return true;
    }
    return false;
  }
  /**
   *
   * @returns
   */
  isCorrectUserRole() {
    const localStorageUser = this.getLocalStorageUser();
    if (localStorageUser) {
      if (localStorageUser.role === ROLE.Bodybuilder) return true;
    }

    return false;
  }
  /**
   *
   * @param expiresIn
   */
  private handleAuthentication(
    userId: string,
    token: string,
    refreshToken: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);

    // TODO : SET FIRSTNAME OR USERNAME IN ORDER TO SHOW IN HEADER
    this.store.dispatch(
      new AuthActions.Login({
        userId: userId,
        token: token,
        expirationDate: expirationDate,
        refreshToken: refreshToken,
      })
    );

    const tokentest = {
      id: userId,
      token: {
        token: token,
        expirationDate: expirationDate,
        refreshToken: refreshToken,
      },
    };
    // this.loggedUserData={

    // token:tokentest.token
    // }
    // this.loggedUserData.tokenExpirationDate = expirationDate;
    // this._loggedUserSource.next(this.loggedUserData);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userAuthData', JSON.stringify(tokentest));
  }
  /**
   *
   */
  logout() {
    this.ts.show('Warning', 'Your session is expired =>Please login');
    this._loggedUserSource.next(null);
    this.router.navigate(['/login']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  /**
   *
   * @param expirationDuration
   */
  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleError(errorRes: HttpErrorResponse) {
    console.log(`errorRes=>`, errorRes);

    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }

    if (!errorRes.error.error.message) {
      errorMessage = errorRes.error.error;
      return throwError(errorMessage);
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
    return throwError(errorMessage);
  }
}
