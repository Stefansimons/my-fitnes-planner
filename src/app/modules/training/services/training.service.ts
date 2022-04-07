import { SpinnerService } from './../../shared/services/spinner.service';
import { UserService } from './../../shared/services/user.service';
import {
  SortColumn,
  SortDirection,
} from './../directives/ngb-sortable-table.directive';
import { User } from './../../shared/models/user.model';
import {
  FirestoreService,
  trainings,
} from './../../shared/services/firestore.service';
import { Training } from '../models/training.model';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, of, scheduled, Subject, BehaviorSubject } from 'rxjs';
import { Injectable, PipeTransform } from '@angular/core';
import { debounceTime, tap, switchMap, delay } from 'rxjs/operators';
import { DecimalPipe } from '@angular/common';

interface SearchResult {
  trainings: Training[];
  total: number;
}

// Global table state
interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
}

const compare = (v1: string | number, v2: string | number) =>
  v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function sort(
  trainings: Training[],
  column: SortColumn,
  direction: string
): Training[] {
  // ONLY SORT PER TRAINING DATE COLUMN
  if (direction === '' || column === '') {
    return trainings;
  } else {
    return [...trainings].sort((a, b) => {
      let res;
      switch (column) {
        case 'id': {
          res = compare(a.id || 1, b.id || 1);
          return direction === 'asc' ? res : -res;
        }
        case 'trainingDate': {
          res = compare(a.trainingDate, b.trainingDate);
          return direction === 'asc' ? res : -res;
        }
        case 'typeOfTraining': {
          res = compare(a.typeOfTraining, b.typeOfTraining);
          return direction === 'asc' ? res : -res;
        }
        default: {
          res = compare(a.id || 1, b.id || 1);
          return direction === 'asc' ? res : -res;
        }
      }
    });
  }
}
// function sort(countries: Country[], column: SortColumn, direction: string): Country[] {
//   if (direction === '' || column === '') {
//     return countries;
//   } else {
//     return [...countries].sort((a, b) => {
//       const res = compare(a[column], b[column]);
//       return direction === 'asc' ? res : -res;
//     });
//   }
// }

function matches(training: Training, term: string) {
  return (
    training.exercises?.some((item) => {
      return item.exerciseName?.toLowerCase().includes(term.toLowerCase());
    }) || training?.typeOfTraining?.toLowerCase().includes(term.toLowerCase())
  );
}

@Injectable({
  providedIn: 'root',
})
export class TrainingService {
  private _newTrainingEvent = new BehaviorSubject<boolean>(false); // Emit next new training value event, false is default value
  private loggedUser: User;
  // public editTrainingEvent = new Subject<boolean>();
  public _editTrainingSubject$ = new Subject<Training>();
  // Table filter and pagination
  // private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _trainings$ = new BehaviorSubject<Training[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  private _trainings: Training[];
  private _state: State = {
    page: 1,
    pageSize: 4,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
  };

  constructor(
    private fs: FirestoreService,
    private us: UserService,
    private ss: SpinnerService
  ) {
    this._search$
      .pipe(
        tap(() => {
          this.ss.show();
        }),
        debounceTime(200),
        switchMap(() => {
          return this._search();
        }),
        delay(200),
        tap(() => this.ss.hide())
      )
      .subscribe((result) => {
        this._trainings$.next(result.trainings);
        this._total$.next(result.total);
      });
    this._search$.next();
  }
  saveTraining(training: Training) {
    const tempUserData = this.us.getLoggedUserData;
    tempUserData.updatedAt = new Date().getTime();

    if (training.id) {
      // Update training in array
      const updatedArray = tempUserData.trainings.map((item) =>
        item.id === training.id ? training : item
      );

      tempUserData.trainings = [...updatedArray];
    } else {
      // Add training in array
      tempUserData.trainings.push(training);
    }

    // Setting ids of training and exericises per object ids
    tempUserData.trainings.forEach((training, id) => {
      training.id ??= id + 1; // NOTE: Nullish coalesc operator
      training.exercises.forEach((item, id) => {
        item.id = !item.id ? id + 1 : item.id;
      });
    });
    this.us.updateLocalStorageUserData(tempUserData);

    // Update trainings array for filtering table
    this.us.fillSearchArrayTrainings(tempUserData.trainings);

    //...AND FORWARD USER FOR UPDATE...
    return this.fs.updateItem(tempUserData);
  }
  getNewTrainingEvent() {
    return this._newTrainingEvent;
  }
  setNewTrainingEvent(isNewEvent: boolean) {
    this._newTrainingEvent.next(isNewEvent);
  }

  getTrainings(userId: string) {
    return this.fs.getItems(userId);
  }

  /**
   * get training as observable
   */
  get getTraining$() {
    return this._editTrainingSubject$.asObservable();
  }

  setTrainings$(trainings: Training[]) {
    this._trainings$.next(trainings);
  }
  /**
   *
   */
  editTraining(training: Training) {
    this._editTrainingSubject$.next(training);
  }
  /**
   *  get trainings as observable
   */
  // Table
  get trainings$() {
    return this._trainings$.asObservable();
  }
  // seter
  trainings(trainings: Training[]) {
    this._trainings$.next(trainings);
  }
  get total$() {
    return this._total$.asObservable();
  }
  //  total(number:number){
  //   this._total$.next(number);
  // }
  get page() {
    return this._state.page;
  }
  get pageSize() {
    return this._state.pageSize;
  }
  get searchTerm() {
    return this._state.searchTerm;
  }

  // Set methods binded with [(ngModel)]
  set page(page: number) {
    this._set({ page });
  }
  set pageSize(pageSize: number) {
    this._set({ pageSize });
  }
  set searchTerm(searchTerm: string) {
    this._set({ searchTerm });
  }
  set sortColumn(sortColumn: SortColumn) {
    this._set({ sortColumn });
  }
  set sortDirection(sortDirection: SortDirection) {
    this._set({ sortDirection });
  }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }
  /**
   *
   * @returns
   */
  private _search(): Observable<SearchResult> {
    const { sortColumn, sortDirection, pageSize, page, searchTerm } =
      this._state;

    let trainings = sort(
      this.us.arrayTrainings || [],
      sortColumn,
      sortDirection
    );

    // let trainings = sort(trainings, sortColumn, sortDirection);

    trainings = trainings.filter((training) => matches(training, searchTerm)); // matches for every entry
    const total = trainings.length;

    // 3. paginate
    trainings = trainings.slice(
      (page - 1) * pageSize,
      (page - 1) * pageSize + pageSize
    );

    return of({ trainings, total });
  }
}
