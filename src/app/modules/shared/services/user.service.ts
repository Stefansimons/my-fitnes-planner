import { TrainingService } from './../../training/services/training.service';
import { HttpRequestsService } from './http-requests.service';
import { environment } from './../../../../environments/environment';
import { ToastService } from './toast.service';
import { Subject, Observable, throwError } from 'rxjs';
import { Training } from './../../training/models/training.model';
import { SpinnerService } from './spinner.service';
import { FirestoreService, trainings } from './firestore.service';
import { User, IToken } from './../models/user.model';
import { Injectable } from '@angular/core';
import { tap, map, catchError } from 'rxjs/operators';

export const userTempData = {
  code: 'Code 123',
  firstName: 'Stefan',
  lastName: 'Simonovic',
  password: 'pass123',
  username: 'username',
} as User;
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _loggedUserSource = new Subject<User>();
  public readonly loggedUser$ = this._loggedUserSource.asObservable();
  userId: string; // Global user ID for sharing
  private _arrayTrainings: Training[];
  private _loggedUserData: User;

  constructor(
    private fs: FirestoreService,
    private ss: SpinnerService,
    private ts: ToastService,
    private httpS: HttpRequestsService
  ) {}

  // GET USER DATA BY USERNAME AND PASSWORD , SET THIS.USER AND INJECT VALUE TO OTHER COMPONENTS
  // NOTE: $ SIGN FOR GETTING SOURCE AS OBSERVABLE
  get getLoggedUser$() {
    // Logged user
    return this.loggedUser$;
  }

  /**
   * // NOTE: DATA FOR GETTING USER DATA, NOT SOURCE!
   */
  get getLoggedUserData() {
    return this._loggedUserData;
  }
  /**
   * value
   */
  set emitLoggedUserValue(value: User) {
    this._loggedUserSource.next(value);
  }
  /**
   *
   * @param userId
   *
   */
  getFirebaseUser(userId: string) {
    return this.fs.getUser(userId).pipe(
      map((actions) => {
        const user: User = actions.payload.data();
        user.trainings = user.trainings.filter((item) => item.isActive);
        return user;
      })
    );
  }

  /**
   * It saves fb user
   */
  saveUser(user: User) {
    this.ss.show();
    this.fs
      .saveItem(user)
      .then((res) => {
        this.ss.hide();
        this.ts.show('Success', 'Successfull registration');
      })
      .catch((error) =>
        this.ts.show('Success', `Something went wrong error=>${error}`)
      );
  }
  getLoggedUserId(): string {
    return this.userId;
  }
  /**
   *
   * @param user
   */
  updateUser(user: User) {
    return this.httpS.putUserRequest(user).pipe(
      tap(() => this.ss.show()),
      map((res) => {
        console.log('map=>res=>', res);
        return res;
      }),
      catchError((error) => {
        this.ts.show('Error', `Something went wrong =>${error.message}`);
        return throwError(error);
      })
    );
  }

  /**
   *
   * @param data
   */
  setLocalStorageUserData(data: User) {
    localStorage.setItem('userData', JSON.stringify(data));
  }
  /**
   *
   * @returns
   */
  getData() {
    const user = localStorage.getItem('userData');
    if (user) return JSON.parse(user) as User;

    return undefined;
  }
  /**
   *
   */
  get arrayTrainings() {
    return this._arrayTrainings;
  }
  fillSearchArrayTrainings(trainings: Training[]) {
    this._arrayTrainings = trainings;
  }
  /*********************************Local storage******************************************/
}
