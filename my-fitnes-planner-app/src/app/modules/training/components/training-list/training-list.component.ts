import { Observable, Subscription } from 'rxjs';
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
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';

@Component({
  selector: 'app-training-list',
  templateUrl: './training-list.component.html',
  styleUrls: ['./training-list.component.css'],
})
export class TrainingListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @Input() training: Training;
  @Output() editTrainingEvent = new EventEmitter<Training>();

  // listen to parent event in child
  private eventsSubscription: Subscription;
  @Input() eventsUserId: Observable<string>;

  displayedColumns: string[] = [
    'id',
    'trainingDate',
    'exerciseName',
    'weight',
    'typeOfTraining',
    // 'update',
  ];
  selectedTraining: Training;
  trainingsDataSource: Training[] = [];
  userID: string;
  dataSource = new MatTableDataSource<Training>([]);
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit(): void {
    console.log('list');
    // TODO: Uncomment  this when user login is complete
    // listen to parent event
    // this.eventsSubscription = this.eventsUserId.subscribe((userId) => {
    //   console.log('Emited new value');
    //   this.userID = userId;
    //   this.getTrainingsByUserId(this.userID);
    // });
  }
  /**
   *
   */
  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  constructor(private dts: TrainingService) {}
  /**
   *
   * @param userId
   */
  getTrainingsByUserId(userId: string) {
    this.dts.getTrainings(userId).subscribe((data: Training[]) => {
      // TREBA DA KREIRAM TAKAV NIZ DA SE PRIKAZU SVE VEZBE ! ILI DA UBACIM DRUGU TABELU PA SA INNER TABLE
      // Looping Object
      for (const [id, training] of Object.entries(data)) {
        console.log('training:', training);
        console.log('id:', id); // 0 , 1 ...

        // let tempItem = { ...training }; -- DESTRUCTURING
        this.trainingsDataSource.push({ ...training });
      }
      console.log('this.trainingsDataSource=>', this.trainingsDataSource);
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
}
