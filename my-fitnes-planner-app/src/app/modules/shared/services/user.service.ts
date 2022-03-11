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
  trainings: trainings,
} as User;
@Injectable({
  providedIn: 'root',
})
export class UserService {
  loggedUser: User;
  constructor(private fs: FirestoreService) {}

  // GET USER DATA BY USERNAME AND PASSWORD , SET THIS.USER AND INJECT VALUE TO OTHER COMPONENTS
  getLoggedUserData() {
    // Logged user
    return (this.loggedUser = userTempData);
  }

  saveUser() {
    this.fs
      .saveUser(userTempData)
      .then((data) => {
        userTempData.id = data.id;
        console.log('then => user userTempData=>', userTempData);
      })
      .catch((error) => {
        console.error(`${error.message} 💥`), alert('Something went wrong!');
      }); // const docSnap = await getDoc(docRef);;
  }
}
