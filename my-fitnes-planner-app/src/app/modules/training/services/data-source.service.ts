import { Training } from './../models/training.model';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, of, scheduled } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataSourceService {
  trainingsDataSource: Training[] = [];
  dataSource = new MatTableDataSource(this.trainingsDataSource);

  refreshDataTable(training: Training): Observable<Training[]> {
    // commonly something like:
    // return this.httpClient.get('https://example.org/rest-api/items/');
    this.trainingsDataSource.push(training);
    return of(this.trainingsDataSource);
  }
  updateTraining(training: Training) {
    // Find element by ID and pass to form , then push to data source
    //this.dataSource.filter(id)
  }
  constructor() {}
}
