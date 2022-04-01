import { Subject } from 'rxjs';
import { Training } from './../../training/models/training.model';
import { SpinnerService } from './spinner.service';
import { FirestoreService, trainings } from './firestore.service';
import { User, IToken } from './../models/user.model';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

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
  constructor(private fs: FirestoreService, private ss: SpinnerService) {}

  // GET USER DATA BY USERNAME AND PASSWORD , SET THIS.USER AND INJECT VALUE TO OTHER COMPONENTS
  // NOTE: $ SIGN FOR GETTING SOURCE AS OBSERVABLE
  get getLoggedUser$() {
    // Logged user
    return this.loggedUser$;
  }
  get getTrainings() {
    return this.trainings$;
  }
  /**
   * // NOTE: DATA FOR GETTING USER DATA, NOT SOURCE!
   */
  getLoggedUserData() {
    return this._loggedUserData;
  }

  /**
   *
   * @param userId
   */
  getFirebaseUser(userId: string) {
    this.fs
      .getUser('9cQyfjp2zLt1pkK5IUtF')
      .pipe(
        tap((data) => {
          this.ss.show();
          return data;
        })
      )
      .subscribe((data) => {
        console.log('sacuvan user fb data=>', data);
        // TODO: Map data to defined user data

        // this.setLocalStorageUserData(data);

        // // load user data
        // this.loadUserData();
      });
  }
  saveUser() {
    userTempData.trainings = [];
    // TODO : IF USER HAS ID THEN UPDATE USER, FOR NOW ONLY SAVE HARD CODED USER AND SAVED IN LOCAL STORAGE FOR LOADING
    this.fs
      .saveItem(userTempData)
      .then((data) => {
        this.ss.show();
        return data;
      })
      .then((data) => {
        userTempData.id = data.id;
        this.userId = data.id;
        this._loggedUserSource.next(userTempData);
        this.setLocalStorageUserData(userTempData);
        this.loadUserData();
      })
      .catch((error) => {
        console.error(`${error.message} 💥`), alert('Something went wrong!');
      })
      .finally(() => {
        this.ss.hide();
        //  this.loaderFlag = true;
      }); // const docSnap = await getDoc(docRef);;
  }
  getLoggedUserId(): string {
    return this.userId;
  }

  /**
   *
   * @param data
   */
  setLocalStorageUserData(data: User) {
    const jsonData = JSON.stringify(data);
    localStorage.setItem('userData', jsonData);
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
  loadUserData() {
    this.ss.show();
    this._loggedUserData = JSON.parse(this.getData() || '{}') as User;

    // Setting id for every training and every exercise in training

    this._loggedUserData.trainings.map((item, id) => {
      item.id = id + 1;
      item.exercises.map((item, id) => {
        item.id = id + 1;
      });
    });
    this.userId = this._loggedUserData.id;

    // Emit new user value
    this._arrayTrainings = this._loggedUserData.trainings;
    this._loggedUserSource.next(this._loggedUserData);

    // emit trainings new value
    this._trainingsSource.next(this._loggedUserData.trainings as Training[]);

    this.ss.hide();
  }
  clearUserData() {
    localStorage.removeItem('userData');
  }

  /**
   *
   * @param user
   */
  updateLocalStorageUserData(user: User) {
    this.clearUserData();
    this.setLocalStorageUserData(user);
    this._loggedUserSource.next(user);
    this._loggedUserData = user;
  }
}
