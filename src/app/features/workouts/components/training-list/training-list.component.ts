import { ToastService } from './../../../../shared/services/toast.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import {
  NgbSortableTableDirective,
  SortEvent,
} from './../../directives/ngb-sortable-table.directive';
import { User } from './../../../../shared/models/user.model';
import { SpinnerService } from './../../../../shared/services/spinner.service';
import { UserService } from './../../../../shared/services/user.service';
import { Observable } from 'rxjs';

import { Training } from './../../models/training.model';
import { WorkoutFacade } from '../../workout.facade';
import { trainingToWorkout } from '../../adapters/training.adapter';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { SubSink } from 'subsink';

@Component({
    selector: 'app-training-list',
    templateUrl: './training-list.component.html',
    styleUrls: ['./training-list.component.css'],
    standalone: false
})
export class TrainingListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @Input() isNew: boolean;
  @Input() training: Training;
  @Output() editTrainingEvent = new EventEmitter<Training>();
  @ViewChild('modalcontent') moralref: TemplateRef<any>;

  // Directive for sorting table
  @ViewChildren(NgbSortableTableDirective)
  headers: QueryList<NgbSortableTableDirective>;

  // listen to parent event in child
  @Input() eventsUserId: Observable<string>;

  private subs = new SubSink();

  // Table pagination
  total$: Observable<number>;
  trainings$: Observable<Training[]>;

  selectedTraining: Training;
  //  trainingsDataSource: Training[];
  userID: string;

  modalOptions: NgbModalOptions; // NGB POPUP MODAL OPTIONS

  /**
   *
   * @param event
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
  }
  constructor(
    public workoutFacade: WorkoutFacade,
    private us: UserService,
    private ss: SpinnerService,
    private modals: NgbModal,
    private ts: ToastService
  ) {
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
    };
    // Table pagination
    this.trainings$ = workoutFacade.workouts$;
    this.total$ = workoutFacade.total$;
  }

  ngAfterViewInit(): void {
    //  throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    // Local storage user data
    const userObs = this.us.getLoggedUser$.subscribe((user) => {
      this.userID = user.id;
      this.workoutFacade.loadWorkouts(user.id).subscribe({
        next: (workouts) => {
          this.onSort({ column: 'trainingDate', direction: 'desc' });
          this.ss.hide();
        },
        error: () => this.ss.hide(),
      });
    });

    this.subs.add(userObs);
  }
  /**
   * Unsubscribe when the component dies
   */
  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  /**
   *
   * @param value
   */
  editTraining(value: Training) {
    value.updatedAt = new Date(); // TODO delete when convert updatedAt from number to date
    this.editTrainingEvent.emit(value);
  }
  /**
   *
   * @param modal
   * @param training
   */
  deleteTraining(modal: any, training: Training) {
    // TODO :CALL MODAL...
    this.modals.open(modal, this.modalOptions).result.then(
      (result) => {
        const workout = trainingToWorkout(training);
        if (workout.id === undefined) {
          this.ts.show('Error', 'Unable to delete training without an ID');
          return;
        }

        this.workoutFacade.finishWorkout(this.userID, workout.id).subscribe({
          next: () => this.ts.show('Success', 'Deleted training'),
          error: (error) => this.ts.show('Error', error.message),
        });
        //   this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  // Directives event
  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    const stateColumn = column === 'id'
      ? 'id'
      : column === 'trainingDate'
        ? 'date'
        : column === 'typeOfTraining'
          ? 'type'
          : '';
    this.workoutFacade.setSort(stateColumn, direction);
  }

  /**
   *
   * @param content
   */
  open(content: any, isEdit: boolean) {
    // this.title = isEdit
    //   ? `Training: ${this.training.typeOfTraining}`
    //   : 'Novi training';

    this.modals.open(content, this.modalOptions).result.then(
      (result) => {
        this.ts.show('success', 'You deleted training');

        // this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }
}
