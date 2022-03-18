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

// TODO: Resolve this!
function sort(
  trainings: Training[],
  column: SortColumn,
  direction: string
): Training[] {
  return trainings;
  // if (direction === '' || column === '') {
  //   return trainings;
  // } else {
  //   return [...trainings].sort((a, b) => {
  //     const res = compare(a[column], b[column]);
  //     return direction === 'asc' ? res : -res;
  //   });
  // }
}
// TODO: Resolve this!
function matches(training: Training, term: string) {
  // console.log('matches=>training=>', training);
  // console.log('term=>', term);
  // const test = 'Barbel inclane benc';
  // const isIncludes = test.includes('Bar');
  // console.log('isIncludes=>', isIncludes);

  // const items = training.exercises?.some((item) => {
  //   return item.exerciseName?.includes(term);
  // });
  //  .includes(
  //   term.toLowerCase()
  // );
  //  ?.map((item) => item.exerciseName)
  // .filter((item) => item ? item.search(term) : '');
  // console.log('items=>', items);
  // console.log('-------------------------------------------------------------');

  return (
    training.exercises?.some((item) => {
      return item.exerciseName?.toLowerCase().includes(term.toLowerCase());
    }) || training.typeOfTraining.toLowerCase().includes(term.toLowerCase())
  );
  // || pipe.transform(training.population).includes(term);
}

@Injectable({
  providedIn: 'root',
})
export class TrainingService {
  // private _newTrainingEvent : Observable<string>; // Emit next userId
  private _newTrainingEvent = new BehaviorSubject<boolean>(false); // Emit next new training value event, false is default value
  private loggedUser: User;
  // Table filter and pagination
  // private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _trainings$ = new BehaviorSubject<Training[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

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
    this.loggedUser = this.us.getLoggedUserData();
  }
  saveUser(user: User) {
    // commonly something like:
    // return this.httpClient.get('https://example.org/rest-api/items/');
    return this.fs.saveItem(user);

    // this.updateTable();
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

    //  TODO: sort
    let trainings = sort(this.loggedUser.trainings, sortColumn, sortDirection);

    // let trainings = sort(trainings, sortColumn, sortDirection);

    // TODO: 2. filter

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
