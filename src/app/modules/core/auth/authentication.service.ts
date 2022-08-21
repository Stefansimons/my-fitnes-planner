import { Router } from '@angular/router';
import { HttpRequestsService } from './../../shared/services/http-requests.service';
import { HelperService } from './../../shared/services/helper.service';
import { FirestoreService } from './../../shared/services/firestore.service';
import { Observable, Subject, BehaviorSubject, throwError } from 'rxjs';

import { ToastService } from './../../shared/services/toast.service';
import { SpinnerService } from './../../shared/services/spinner.service';
import { IToken, ROLE, User } from './../../shared/models/user.model';
import { UserService } from './../../shared/services/user.service';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';

// Firebase user authentification
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  // private isLoggedIn: boolean = false;
  // private tokenExpirationTimer: any;
  // loggedUser: User;
  // userToken: IToken;
  user = new BehaviorSubject<User | null>(null);
  userData: User;
  authtoken = new BehaviorSubject<IToken | null>(null);
  authtokenData: IToken;
  private tokenExpirationTimer: any;
  private _isLoggedUserSource = new Subject<boolean>();
  public readonly isLoggedUserSource$ = this._isLoggedUserSource.asObservable();
  constructor(
    private fs: AngularFirestore,
    private httpS: HttpRequestsService,
    private us: UserService,
    private ss: SpinnerService,
    private ts: ToastService,
    private fss: FirestoreService,
    private hs: HelperService,
    private router: Router
  ) {}
  /**
   * Logs user in
   * @param email
   * @param password
   * @returns
   */
  login(email: string, password: string) {
    return this.httpS.login(email, password).pipe(
      catchError(this.handleError),
      tap((resData) => {
        this.ss.show();

        const expirationDate = new Date(
          new Date().getTime() + +resData.expiresIn * 1000
        );

        this.authtokenData = {
          accessToken: resData.idToken,
          refreshToken: resData.refreshToken,
          expirationTime: expirationDate,
        };
        this.authtoken.next(this.authtokenData);
      }),
      // map((resData) => {
      //   return resData;
      // }),
      switchMap((resData) => {
        console.log('switchMap=>AuthResponseData=>', resData);

        // console.log('authUserData=>user id', authUserData.uid);
        return this.httpS.fetchUsersRequest().pipe(
          map((response) => {
            // const { ...user } = response;
            for (const [key, childvalue] of Object.entries(response)) {
              console.log(`${key}: ${childvalue}`);
              for (const [key, value] of Object.entries(childvalue)) {
                console.log(`${key}: ${value}`);
                this.userData = { ...this.userData, [key]: value };
              }
            }
            this.userData.token = this.authtokenData;
            this.user.next(this.userData);

            this.handleAuthentication(this.userData);

            this.setIsLoggedUser = true;
            return this.userData;
          })
        );
      })
    );
  }
  /**
   *
   */
  logout() {
    this.user.next(null);
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
  /**
   *
   * @param user
   *
   */
  private handleAuthentication(user: User) {
    this.us.emitLoggedUserValue = user;
    this.autoLogout(user.token.expirationTime.getTime() * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }
  /**
   *
   * @param errorRes
   * @returns
   */
  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
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
    console.log('next boolean value');

    this._isLoggedUserSource.next(isLoggedUser);
  }
  /**
   *
   */
  logUserOut() {
    this.fss.logout().then(() => this.ts.show('Success', `GOODBYE 👋`));
  }

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
  setLogoutTimer(expirationDuration: number) {
    // this.tokenExpirationTimer = setTimeout(() => {
    //   this.store.dispatch(new AuthActions.Logout());
    // }, expirationDuration);
  }

  clearLogoutTimer() {
    // if (this.tokenExpirationTimer) {
    //   clearTimeout(this.tokenExpirationTimer);
    //   this.tokenExpirationTimer = null;
    // }
  }
}
