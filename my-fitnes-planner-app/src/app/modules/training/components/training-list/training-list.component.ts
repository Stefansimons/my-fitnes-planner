import { trainings } from './../../../shared/services/firestore.service';
import { SpinnerService } from './../../../shared/services/spinner.service';
import { UserService } from './../../../shared/services/user.service';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { Training, Exercise } from './../../models/training.model';
import { TrainingService } from '../../services/training.service';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';
import { SubSink } from 'subsink';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-training-list',
  templateUrl: './training-list.component.html',
  styleUrls: ['./training-list.component.css'],
})
export class TrainingListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @Input() isNew: boolean;
  @Input() training: Training;
  @Output() editTrainingEvent = new EventEmitter<Training>();

  // listen to parent event in child
  @Input() eventsUserId: Observable<string>;

  private subs = new SubSink();

  // Table pagination
  total$: Observable<number>;
  trainings$: Observable<Training[]>;

  // @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  selectedTraining: Training;
  trainingsDataSource: Training[];
  userID: string;
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
  }
  constructor(
    public dts: TrainingService, //NOTE: Public because assigning ngModel valu direct to service setters ?!?
    private us: UserService,
    private ss: SpinnerService
  ) {
    // Table pagination
    this.trainings$ = dts.trainings$;
    this.total$ = dts.total$;
  }

  ngAfterViewInit(): void {
    //  throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    // Local storage user data
    const user = this.us.getLoggedUserData();
    this.userID = user.id;
    this.trainingsDataSource = user.trainings.reverse();

    // Emited new training
    const newItemEvent = this.dts
      .getNewTrainingEvent()
      .subscribe((isNewEvent) => {
        if (isNewEvent) {
          this.ss.show();
          this.dts.getTrainings(this.userID).subscribe((data: Training[]) => {
            // this.trainingsDataSource = Object.values(data).reverse();
            this.dts.trainings(data);
            this.ss.hide();
          });
        }
      });

    // Add observables in subsink array
    this.subs.add(newItemEvent);
  }
  /**
   * // NOTE:test Observables With SwitchMap
   */
  testObservablesWithSwitchMap() {
    console.log('list=>isNew=>', this.isNew);
  }
  /**
   * Unsubscribe when the component dies
   */
  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  /**
   *
   * @param userId
   */
  getTrainingsByUserId(userId: string) {
    this.ss.show();
    this.dts.getTrainings(userId).subscribe((data: Training[]) => {
      this.trainingsDataSource = [];
      // TREBA DA KREIRAM TAKAV NIZ DA SE PRIKAZU SVE VEZBE ! ILI DA UBACIM DRUGU TABELU PA SA INNER TABLE
      // Looping Object
      for (const [id, training] of Object.entries(data)) {
        // Destructuring
        // console.log('training:', training);
        // console.log('id:', id); // 0 , 1 ...

        // let tempItem = { ...training }; -- DESTRUCTURING
        this.trainingsDataSource.push({ ...training });
      }
      this.ss.hide();
    });
  }
  /**
   * Gets trainings by user Id
   */
  getTrainings() {
    this.getTrainingsByUserId(this.userID);
  }
  /**
   *
   * @param value
   */
  editTraining(value: Training) {
    this.editTrainingEvent.emit(value);
  }
  /**
   *
   */
  trackTraining(index: number, training: any) {
    console.log(training);
    return training;
  }
  // Table filter , pagination
  /**
   * // TODO: SORT
   * *
   */
  //  onSort({column, direction}: SortEvent) {
  //   // resetting other headers
  //   this.headers.forEach(header => {
  //     if (header.sortable !== column) {
  //       header.direction = '';
  //     }
  //   });

  //   this.service.sortColumn = column;
  //   this.service.sortDirection = direction;
  // }
}
