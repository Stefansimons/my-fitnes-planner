import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ROLE } from '@shared/models/user.model';

import * as fromApp from '@store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private tokenExpirationTimer: any;

  constructor(private store: Store<fromApp.AppState>) {}

  setLogoutTimer(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.store.dispatch(new AuthActions.Logout());
    }, expirationDuration);
  }

  clearLogoutTimer() {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
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
}
