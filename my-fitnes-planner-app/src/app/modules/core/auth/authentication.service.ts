import { UserService } from './../../shared/services/user.service';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';

// Firebase user authentification
import { signInWithEmailAndPassword } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private fs: AngularFirestore, private us: UserService) {
    console.log('cons=>firebase=>', firebase);
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(firebase.auth(), email, password); // Return promise
  }
  logout() {
    firebase.auth().signOut();
  }
}
