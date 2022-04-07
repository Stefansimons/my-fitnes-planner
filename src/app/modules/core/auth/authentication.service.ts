import { HelperService } from './../../shared/services/helper.service';
import { FirestoreService } from './../../shared/services/firestore.service';
import { Observable, Subject, from } from 'rxjs';
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
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private isLoggedIn: boolean = false;
  loggedUser: User;
  userToken: IToken;
  private _isLoggedUserSource = new Subject<boolean>();
  public readonly isLoggedUserSource$ = this._isLoggedUserSource.asObservable();
  constructor(
    private fs: AngularFirestore,
    private us: UserService,
    private ss: SpinnerService,
    private ts: ToastService,
    private fss: FirestoreService,
    private hs: HelperService
  ) {}
  /**
   * Logs user in
   * @param email
   * @param password
   * @returns
   */
  login(email: string, password: string) {
    return from(this.fss.logUserIn(email, password)) // NOTE: With rxjs form operator i gives observable instead promise
      .pipe(
        map((res) => {
          return res.user?.toJSON();
        }),
        switchMap((authUserData: any) => {
          const userToken = authUserData.stsTokenManager;

          return this.us.getFirebaseUser(authUserData.uid).pipe(
            map((res) => {
              return (this.loggedUser = {
                token: userToken,
                ...res,
                role: ROLE.Bodybuilder,
              });
            }),
            catchError((error) => {
              this.ts.show('error', `something went wrong ${error}`);
              return error;
            })
          );
        }),
        catchError((error) => {
          this.ts.show('error', `something went wrong ${error}`);
          return error;
        })
      );
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
    this._isLoggedUserSource.next(isLoggedUser);
  }
  /**
   *
   */
  logUserOut() {
    this.fss
      .logout()
      .then(() =>
        this.ts.show('Success', `GOODBYE ${this.loggedUser.firstName} 👋`)
      );
  }
  /**
   * Registers user
   * @param email
   * @param password
   * @returns Observable
   */
  register(
    email: string,
    password: string
  ): Observable<firebase.auth.UserCredential> {
    return from(this.fss.register(email, password));
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
}
