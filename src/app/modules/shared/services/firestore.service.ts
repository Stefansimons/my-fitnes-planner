import { SpinnerService } from './spinner.service';
import {
  Exercise,
  Training,
  Series,
} from './../../training/models/training.model';
import { User } from './../models/user.model';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';

import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { collection, query, getDocs } from 'firebase/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

export const trainings = [
  {
    trainingDate: new Date().toISOString(),
    typeOfTraining: 'Legs',
    exercises: [
      {
        name: 'Cucanj',
        series: [
          { repetitionNumber: 10, weight: 50 },
          { repetitionNumber: 8, weight: 60 },
          { repetitionNumber: 6, weight: 80 },
        ],
      },
      {
        name: 'Guranje',
        series: [
          { repetitionNumber: 10, weight: 50 },
          { repetitionNumber: 8, weight: 60 },
          { repetitionNumber: 6, weight: 80 },
        ],
      },
    ],
  },
  {
    trainingDate: new Date().toISOString(),
    typeOfTraining: 'Push',
    exercises: [
      {
        name: 'Ravni benc',
        series: [
          { repetitionNumber: 10, weight: 50 },
          { repetitionNumber: 8, weight: 60 },
          { repetitionNumber: 6, weight: 80 },
        ],
      },
      {
        name: 'Kosi benc',
        series: [
          { repetitionNumber: 10, weight: 50 },
          { repetitionNumber: 8, weight: 60 },
          { repetitionNumber: 6, weight: 80 },
        ],
      },
    ],
  },
];
@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  private itemDoc: AngularFirestoreDocument<User>; // Document
  private itemDoctr: AngularFirestoreDocument<Training>; // Document
  private itemsCollection: AngularFirestoreCollection<any>; // Collection
  private usersCollection: AngularFirestoreCollection<User>; // Collection
  private trainingsCollection: AngularFirestoreCollection<Training>; // Collection

  private userDocs: AngularFirestoreDocument<User>; // Documents
  item: Observable<Training[]>;
  userItem: Observable<User>;
  userItemsobs: Observable<User[]>;
  items: User;
  userItems: User[];
  constructor(
    public fs: AngularFirestore,
    private ss: SpinnerService,
    private afAuth: AngularFireAuth
  ) {
    //  this.itemsCollection = fs.collection<User>('users/t58eflvZawe59plcNDuh/trainings');
    this.itemsCollection = fs.collection<User>('users/');
    // this.getDocumentstest('users', '1kEotoOypLVO4bHpO5WN');
    // Collection of user documents.
    // this.items = this.itemsCollection.valueChanges();
    // this.items = this.itemsCollection.valueChanges({ idField: 'customID' });
    // .snapshotChanges() returns a DocumentChangeAction[], which contains
    // a lot of information about "what happened" with each change. If you want to
    // get the data and the id use the map operator.
  }
  /**
   *
   * @param user
   * @returns
   */
  saveItem(user: User) {
    // url path  /users/t58eflvZawe59plcNDuh/trainings/FZVTzTVHPJJo4bRd9Wtp/exercises
    // SAVE ITEM
    // Persist a document id'
    return this.itemsCollection.doc(user.id).set(user);
  }
  /**
   *
   * @param user
   * @returns
   */
  updateItem(user: User) {
    return this.fs.doc(`users/${user.id}`).update(user);
  }
  /**
   *
   * @param id
   * @returns Observable
   */
  getItems(userId: string): Observable<Training[]> {
    // if (!userId) {
    //   // .snapshotChanges() returns a DocumentChangeAction[], which contains
    //   // a lot of information about "what happened" with each change. If you want to
    //   // get the data and the id use the map operator.
    //   return this.fs
    //     .collection<User>('users') // TIP KOLEKCIJE <>
    //     .snapshotChanges();
    // } else {

    return this.itemsCollection
      .doc(userId) // ID kolekcije
      .snapshotChanges()
      .pipe(
        // tap(() => this._loading$.next(true)), // NOTE: consider this if is it a good way for spinner loader, tap operator
        map((actions) => {
          const data = actions.payload.data();
          const id = actions.payload.id;
          return { ...data.trainings } as Training[];
        })
      );
  }
  /**
   *
   * @param userId
   * @returns Observable
   */
  getUser(userId: string) {
    return this.itemsCollection
      .doc(userId) // ID kolekcije
      .snapshotChanges();
  }
  /**
   *
   */
  saveUser(user: User) {
    return this.itemsCollection.add({ user });
  }
  logUserIn(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }
  /**
   *
   */
  logout() {
    return this.afAuth.signOut();
  }
  /**
   * Registers user
   * @param email
   * @param password
   * @returns
   */
  register(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }
}
