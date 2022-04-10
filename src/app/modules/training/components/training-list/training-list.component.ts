import { environment } from 'src/environments/environment.prod';
import { ToastService } from './../../../shared/services/toast.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import {
  NgbSortableTableDirective,
  SortEvent,
} from './../../directives/ngb-sortable-table.directive';
import { User } from './../../../shared/models/user.model';
import { trainings } from './../../../shared/services/firestore.service';
import { SpinnerService } from './../../../shared/services/spinner.service';
import { UserService } from './../../../shared/services/user.service';
import { Observable, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { Training, Exercise } from './../../models/training.model';
import { TrainingService } from '../../services/training.service';
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
    public dts: TrainingService, //NOTE: Public because assigning ngModel valu direct to service setters ?!?
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
    this.trainings$ = dts.trainings$;
    this.total$ = dts.total$;
  }

  ngAfterViewInit(): void {
    //  throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    // Local storage user data
    const userObs = this.us.getLoggedUser$.subscribe((user) => {
      this.userID = user.id;
      this.dts.setTrainings$(user.trainings);

      this.onSort({ column: 'trainingDate', direction: 'desc' });

      this.ss.hide();
    });

    // Emited new training
    const newItemEvent = this.dts
      .getNewTrainingEvent()
      .subscribe((isNewEvent) => {
        if (isNewEvent) {
          this.dts.getTrainings(this.userID).subscribe((data: Training[]) => {
            this.dts.setTrainings$(data);

            this.onSort({ column: 'trainingDate', direction: 'desc' });

            this.dts.trainings(data);

            this.ss.hide();
          });
        }
      });
    // GET TRAININGS AFTER DELETING SOME TRAINING
    // this.dts.getTrainings(this.userID).subscribe((data: Training[]) => {
    //   this.dts.setTrainings$(data);

    //   this.onSort({ column: 'trainingDate', direction: 'desc' });

    //   this.dts.trainings(data);

    // });
    // Add observables in subsink array
    this.subs.add(newItemEvent, userObs);
  }
  /**
   * // NOTE:test Observables With SwitchMap
   */
  testObservablesWithSwitchMap() {}
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
      // this.trainingsDataSource = [];
      // TREBA DA KREIRAM TAKAV NIZ DA SE PRIKAZU SVE VEZBE ! ILI DA UBACIM DRUGU TABELU PA SA INNER TABLE
      // Looping Object
      for (const [id, training] of Object.entries(data)) {
        // Destructuring
        // console.log('id:', id); // 0 , 1 ...
        // let tempItem = { ...training }; -- DESTRUCTURING
        // this.trainingsDataSource.push({ ...training });
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
        training.isActive = false;
        this.dts.saveTraining(training);
        this.ts.show('Success', 'Deleted training');
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

    this.dts.sortColumn = column;
    this.dts.sortDirection = direction;
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
