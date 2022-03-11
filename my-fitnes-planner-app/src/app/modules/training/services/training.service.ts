import { User } from './../../shared/models/user.model';
import { FirestoreService } from './../../shared/services/firestore.service';
import { Training } from '../models/training.model';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, of, scheduled } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TrainingService {
  constructor(private fs: FirestoreService) {}
  saveTraining(user: User) {
    // commonly something like:
    // return this.httpClient.get('https://example.org/rest-api/items/');
    this.fs.saveItem(user);

    // this.updateTable();
  }
  // getTrainings() {
  //   //queryData =  querySnapshot = ...
  //   return this.fs.getItems('').subscribe((userActionArray) => {
  //     this.dataSource.data = userActionArray.map((user) => {
  //       return {
  //         ...user.payload.doc.data(),
  //         id: user.payload.doc.id,
  //       } as Training;
  //     });
  //   });
  // }

  getTrainings(userId: string) {
    console.log('getTrainings=>', userId);

    return this.fs.getItems(userId);
  }
}
