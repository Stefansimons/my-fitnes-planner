import { Training } from './../../training/models/training.model';
import { SpinnerService } from './spinner.service';
import { FirestoreService, trainings } from './firestore.service';
import { User } from './../models/user.model';
import { Injectable } from '@angular/core';
import { user } from 'rxfire/auth';

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
  loggedUser: User;
  userId: string; // Global user ID for sharing
  constructor(private fs: FirestoreService, private ss: SpinnerService) {}

  // GET USER DATA BY USERNAME AND PASSWORD , SET THIS.USER AND INJECT VALUE TO OTHER COMPONENTS
  getLoggedUserData() {
    // Logged user
    return this.loggedUser;
  }

  saveUser() {
    this.fs
      .saveUser(userTempData)
      .then((data) => {
        this.ss.show();
        return data;
      })
      .then((data) => {
        userTempData.id = data.id;
        this.userId = data.id;
        this.setLocalStorageUserData(userTempData);
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
  setLocalStorageUserData(data: User) {
    const jsonData = JSON.stringify(data);
    localStorage.setItem('userData', jsonData);
  }

  getData() {
    return localStorage.getItem('userData');
  }
  loadUserData() {
    this.ss.show();

    // this.ss.setIsDisplay(true);
    this.loggedUser = JSON.parse(this.getData() || '{}');
    this.userId = this.loggedUser.id;
    this.ss.hide();
    // setTimeout(() => {
    //   this.ss.hide();
    // }, 2000);
  }
  clearUserData() {
    localStorage.removeItem('userData');
  }
  updateLocalStorageUserData(user: User) {
    this.clearUserData();
    this.loggedUser = user;
    this.setLocalStorageUserData(user);
  }
}
