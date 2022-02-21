import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';

export interface Item {
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  private itemDoc: AngularFirestoreDocument<Item>;
  private itemsCollection: AngularFirestoreCollection<Item>;
  item: Observable<Item>;
  items: Observable<Item[]>;
  constructor(private fs: AngularFirestore) {
    this.itemsCollection = fs.collection<Item>('items');
  }
  addItem(item: Item) {
    this.itemsCollection.add(item);
  }
  update(item: Item) {
    // this.itemDoc.update(item);
  }

  // Method for testing firestore
  testFirebase() {
    console.log('fs:', this.fs);

    // const courses = this.fs
    //   .collection('courses')
    //   .then((data) => {
    //     console.log('courses:', courses);
    //     return data;
    //   });
  }
  saveRecord() {
    console.log('fs:', this.fs);
    // const courses = this.fs
    //   .collection('courses')
    //   .add({ name: this.name.value })
    //   .then((data) => {
    //     console.log('courses:', courses);
    //     return data;
    //   });
  }
}
