import { environment } from './../../../../environments/environment';
import { ToastService } from './toast.service';
import { Subject, Observable } from 'rxjs';
import { Training } from './../../training/models/training.model';
import { SpinnerService } from './spinner.service';
import { FirestoreService, trainings } from './firestore.service';
import { User, IToken } from './../models/user.model';
import { Injectable } from '@angular/core';
import { tap, map } from 'rxjs/operators';

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
  private _trainingsSource = new Subject<Training[]>();
  public readonly loggedUser$ = this._loggedUserSource.asObservable();
  public readonly trainings$ = this._trainingsSource.asObservable();
  userId: string; // Global user ID for sharing
  private _arrayTrainings: Training[];
  private _loggedUserData: User;

  constructor(
    private fs: FirestoreService,
    private ss: SpinnerService,
    private ts: ToastService
  ) {}

  // GET USER DATA BY USERNAME AND PASSWORD , SET THIS.USER AND INJECT VALUE TO OTHER COMPONENTS
  // NOTE: $ SIGN FOR GETTING SOURCE AS OBSERVABLE
  get getLoggedUser$() {
    // Logged user
    return this.loggedUser$;
  }

  /**
   *
   */
  get getTrainings() {
    return this.trainings$;
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
    return localStorage.getItem('userData');
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
  /**
   *
   */
  loadLocalStorageUserData() {
    this._loggedUserData = JSON.parse(this.getData() || '{}') as User;

    // Setting id for every training and every exercise in training

    const filtered = this._loggedUserData.trainings
      .map((item, id) => {
        item.id = id + 1;
        item.exercises.map((item, id) => {
          item.id = id + 1;
        });
        return item;
      })
      .filter((item) => item.isActive);

    this.userId = this._loggedUserData.id;
    this._loggedUserData.trainings = filtered;

    // Emit new user value
    this._arrayTrainings = filtered;
    this._loggedUserSource.next(this._loggedUserData);

    // emit trainings new value
    this._trainingsSource.next(this._loggedUserData.trainings as Training[]);
  }
  /**
   *
   */
  clearUserData() {
    localStorage.removeItem('userData');
  }

  /**
   *
   * @param user
   */
  updateLocalStorageUserData(user: User) {
    this.clearUserData();
    this._loggedUserData = user;
    this.setLocalStorageUserData(user);
  }
}
