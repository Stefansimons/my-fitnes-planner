import { user } from 'rxfire/auth';
import {
  Exercise,
  Training,
  Series,
} from './../../training/models/training.model';
import { User } from './../models/user.model';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { collection, query, getDocs } from 'firebase/firestore';

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
  constructor(private fs: AngularFirestore) {
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

  saveItem(user: User) {
    // url path  /users/t58eflvZawe59plcNDuh/trainings/FZVTzTVHPJJo4bRd9Wtp/exercises
    // Radim save pa kad dobije id onda radim update objekta. Nizovi su opcionalni parametri.
    if (!user.id) {
      // SAVE ITEM
      console.log('temp user data=>', user);

      // Persist a document id
      user.trainings.forEach((training) => {
        training.id = this.fs.createId();
      });
      this.itemsCollection
        .add({ user })
        .then((data) => {
          console.log('then => data=>', data);
        })
        .catch((error) => {
          console.error(`${error.message} 💥`), alert('Something went wrong!');
        }); // const docSnap = await getDoc(docRef);
    } else {
      // EDIT ITEM
      this.fs
        .doc(`users/${user.id}`)
        .update(user)
        .then((data) => {
          console.log('update data=>', data);
          alert('successfully');
        })
        .catch((error) => {
          console.error(`${error.message} 💥`), alert('Something went wrong!');
        });
    }
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
    console.log('userId=>', userId);

    return this.itemsCollection
      .doc(userId) // ID kolekcije
      .snapshotChanges()
      .pipe(
        map((actions) => {
          const data = actions.payload.data();
          const id = actions.payload.id;
          return { ...data.user.trainings } as Training[];
        })
      );
    // }
  }
  // GET DOCUMENTS,NOT COLLECTIONS!!
  // WORKS
  getDocuments(collection: string, id: string): Observable<User | undefined> {
    this.itemDoc = this.fs.doc<User>(`${collection}/${id}`);
    return this.itemDoc.valueChanges();
  }
  /**
   *
   */
  saveUser(user: User) {
    return this.itemsCollection.add({ user });
  }
}
