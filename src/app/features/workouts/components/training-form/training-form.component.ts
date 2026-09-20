import { ToastService } from './../../../../shared/services/toast.service';
import { Series } from './../../models/training.model';
import { UserService } from './../../../../shared/services/user.service';
import { WorkoutFacade } from '../../workout.facade';
import {
  trainingToWorkout,
  workoutToTraining,
} from '../../adapters/training.adapter';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  AfterViewInit,
} from '@angular/core';
import {
  AbstractControl,
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Training } from '../../models/index';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { SubSink } from 'subsink';
import { toObservable } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-training-form',
    templateUrl: './training-form.component.html',
    styleUrls: ['./training-form.component.css'],
    standalone: false
})
export class TrainingFormComponent implements OnInit, AfterViewInit {
  @Output() save = new EventEmitter<boolean>();
  editTraining: Training | undefined;
  emptyTypeOfTraining: boolean = false;
  readonly DELIMITER = '/';
  trainingForm: UntypedFormGroup;
  typesOfTraining = ['Trening A', 'Trening B', 'Push', 'Pull', 'Legs', 'Drugo'];
  selectedExercises: any[] = [];
  exercises = {
    'Trening A': [
      'Barbell Inclane Bench Press',
      'Bent over barbell row',
      'Lat Pulldown',
      'Leg press',
      'Barbell Squat',
      'Machine Push',
      'Cabl rope pushdown',
      'Bicep curls dumbell',
      'Cabl rope pushdown',
      'Dumbell flies',
    ],

    'Trening B': [
      'Barbell Bench Press',
      'Bent over barbell row',
      'Lat Pulldown',
      'Leg press',
      'Dumbbell lunges',
      'Machine Push',
      'Cabl rope pushdown',
      'Bicep curls dumbell',
      'Cabl rope pushdown',
      'Over head press',
    ],

    Push: [
      'Dumbbell Bench Press',
      'Dumbbell Inclane Bench Press',
      'Incline Flye',
      'Push machine',
      'Cabl rope pushdown',
      'Dumbbell Inclane Bench Press',
      'Dumbbell Flies',
      'Cabl rope pushdown',
      'Inclane Dumbell Triceps Extension Bench',
      'Overhead press machine',
      'Flies',
    ],

    Pull: [
      'Bent over barbell row',
      'T-bar row',
      'Wide grip Lat pull-down',
      'Wide grip Lat pull-down behind the head',
      'Trapezius',
      'Single Arm Dumbell Curl',
      'Dumbel Alternate Biceps Curl',
    ],

    Legs: [
      'Barbell squat',
      'Machine Leg press',
      'Dumbell lunges',
      'Leg extension',
      'Lying leg Curl',
      'Calf raise',
    ],
    Drugo: [''],
  };

  private subsink: SubSink = new SubSink();
  constructor(
    private fb: UntypedFormBuilder,
    private workoutFacade: WorkoutFacade,
    private us: UserService,
    private ts: ToastService
  ) {}
  ngAfterViewInit(): void {}

  ngOnInit(): void {
    // Initialization of training form for preventing error getting value of getters
    this.trainingForm = this.fb.group({
      id: [null],
      trainingDate: new UntypedFormControl({
        day: new Date().getDate(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      }),
      updatedAt: new Date(),
      isActive: [],
      typeOfTraining: ['', Validators.required],
      exerciseNum: [0, [Validators.required, this.numberZeroToNullValidator()]],
      exercises: this.fb.array([]),
      // series: new FormArray([]), // ? exercises.series
    });

    const editWorkoutData = toObservable(this.workoutFacade.currentWorkout)
      .pipe(map((workout) => (workout ? workoutToTraining(workout) : null)))
      .subscribe((training) => {
        this.editTraining = training ?? undefined;
        if (this.editTraining) this.setFormValue(this.editTraining);
      });

    this.subsink.add(editWorkoutData);
  }
  /**
   *
   */
  selectToday() {
    this.trainingForm.controls['trainingDate'].setValue(
      this.format(this.trainingForm.controls['trainingDate'].value)
    );
  }
  /**
   *
   * @param training
   * @returns
   */
  setFormValue(training: Training) {
    const dateSplited = training.trainingDate.split('/');
    const tempTraining = {
      id: training.id,
      exerciseNum: training.exercises?.length,
      exercises: training.exercises,
      trainingDate: {
        day: +dateSplited[0],
        month: +dateSplited[1],
        year: +dateSplited[2],
      },
      isActive: training.isActive,
      typeOfTraining: training.typeOfTraining,
      updatedAt: training.updatedAt,
    };
    //const tempExercisesFormArray = this.getFormControlArrayValue('exercises');

    // Create form controls, arrays controls.  start ********************************

    this.createExercisesFormControls(0, tempTraining?.exercises?.length);
    // NOTE:Gets or sets the length of the array.
    // NOTE: This is a number one higher than the highest index in the array.Object is po
    //NOTE : non null assertion operator'
    for (let index = 0; index < tempTraining?.exercises?.length!; index++) {
      const element = tempTraining.exercises[index];

      this.exerciseSeriesArray(index).push(this.newExerciseSerie());
      if (element.series?.length! > 0)
        this.createSeriesFormControls(element.series!, index);
    }

    this.setCertainExercises(tempTraining.typeOfTraining);
    this.form.setValue(tempTraining);
  }
  /**
   *
   *
   * @returns
   */
  numberZeroToNullValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const controlValue = control.value;
      return controlValue == 0 ? { nullValue: null } : null;
    };
  }
  /**
   *
   * @param date
   * @returns
   */
  format(date: NgbDateStruct | null): string {
    return date
      ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year
      : '';
  }
  /**
   *  convenience getters for easy access to form fields , Angular 8
   */
  get form() {
    return this.trainingForm;
  }
  get exercisesArray(): UntypedFormArray {
    return this.form.get('exercises') as UntypedFormArray;
  }

  get exercisesControls() {
    return this.exercisesArray.controls as UntypedFormGroup[];
    //   <div *ngFor="let exercise of exercisesControls; let i = index">
    // <div [formGroupName]="i" class="row">
  }
  /**
   *
   * @returns FormArray object
   */
  exerciseSeriesArray(exerciseIndex: number): UntypedFormArray {
    return this.exercisesArray.at(exerciseIndex).get('series') as UntypedFormArray;
  }

  // Get for form controls
  /**
   *
   * @param control
   * @returns formControl value
   */
  getFormControl(control: string) {
    return this.form.get(control);
  }

  onChangeExercise(event: Event): void {
    if (!this.getFormControl('typeOfTraining')?.value) {
      this.emptyTypeOfTraining = true;
    }

    const numberOfExercises = Number((event.target as HTMLInputElement).value) || 0;
    if (this.exercisesArray.length < numberOfExercises) {
      this.createExercisesFormControls(this.exercisesArray.length, numberOfExercises);
      return;
    }

    while (this.exercisesArray.length > numberOfExercises) {
      this.exercisesArray.removeAt(this.exercisesArray.length - 1);
    }
  }

  onChangeTypeOfTraining(event: Event): void {
    this.emptyTypeOfTraining = false;
    this.setCertainExercises((event.target as HTMLSelectElement).value);
  }

  /**
   *
   * @param typeOfTraining
   */
  setCertainExercises(type: string) {
    for (const [id, items] of Object.entries(this.exercises)) {
      if (id === type) {
        this.selectedExercises = items;
        return;
      }
    }
  }
  /**
   *
   * @returns formGroup
   */
  newExerciseSerie(): UntypedFormGroup {
    return this.fb.group({
      repsNum: [''],
      weight: [''],
    });
  }
  /**
   *
   * @returns formGroup
   */
  newExercise(): UntypedFormGroup {
    return this.fb.group({
      id: [null],
      exerciseName: [''],
      serieNum: [''],
      series: this.fb.array([]),
    });
  }
  /**
   *
   * @param e
   * @param exeIndex
   */
  onChangeSeries(e: any, exeIndex: number) {
    const numberOfSeries = e.target.value || 0;
    if (this.exerciseSeriesArray(exeIndex).controls.length < numberOfSeries) {
      for (
        let i = this.exerciseSeriesArray(exeIndex).controls.length;
        i < numberOfSeries;
        i++
      ) {
        this.exerciseSeriesArray(exeIndex).push(this.newExerciseSerie());
      }
    } else {
      for (
        let i = this.exerciseSeriesArray(exeIndex).controls.length;
        i >= numberOfSeries;
        i--
      ) {
        this.exerciseSeriesArray(exeIndex).removeAt(i);
      }
    }
  }
  /**
   *
   * @param controlPath
   */
  setFormControlValue(controlPath: string, value: string) {
    this.form.get(controlPath)?.setValue(value);
  }
  /**
   *
   * @param controlPath
   */
  getFormControlArrayValue(controlPath: string) {
    return <UntypedFormArray>this.form.get(controlPath);
  }
  /**
   *
   * @param empIndex
   */
  removeExercise(empIndex: number) {
    this.exercisesArray.removeAt(empIndex);
    this.setFormControlValue('exerciseNum', String(this.exercisesArray.length));
  }
  /**
   * Create form controls for editing training
   * @param exercises: any ,end
   */
  createExercisesFormControls(start: number = 0, end: number = 0) {
    // Exercises form controls..
    for (let i = start; i < end; i++) {
      this.exercisesArray.push(this.newExercise());
    }

    // Reverse form controls
    this.exercisesArray.controls.reverse();
  }
  /**
   *
   * @param exercises
   */
  createSeriesFormControls(series: Series[], exeIndex: number) {
    // series form controls..
    for (
      let i = this.exerciseSeriesArray(exeIndex).controls.length;
      i < series.length;
      i++
    ) {
      this.exerciseSeriesArray(exeIndex).push(this.newExerciseSerie());
    }
  }

  /**
   *
   * @param training
   */
  saveTraining(training: Training) {
    if (!this.form.valid) return;

    training.trainingDate = this.format(
      this.trainingForm.controls['trainingDate'].value
    );

    training.isActive = true;

    training.updatedAt = new Date();

    const workout = trainingToWorkout(training);
    const userId = this.us.getLoggedUserId();
    const saveRequest = workout.id === undefined
      ? this.workoutFacade.createWorkout(userId, workout)
      : this.workoutFacade.updateWorkout(userId, workout);

    saveRequest.subscribe({
      next: () => {
        this.form.reset();
        this.save.emit(true);
        this.ts.show('Success', 'Successful insert');
      },
      error: (error) => this.ts.show('Error', `${error.message}`),
    });
  }

  /**
   * Test Everything new features
   */
  /**
   * -----------------------------------------------Login Component --------------------------------------------
   *
   */

  /**
   * -----------------------------------------------Login end
   */
  // testSave() {
  //   this.eventsSubject.next();
  // }
  /**
   *
   */
  ngOnDestroy() {
    this.subsink.unsubscribe();
    //  this.eventsSubject.unsubscribe();
    // needed if child gets re-created (eg on some model changes)
    // note that subsequent subscriptions on the same subject will fail
    // so the parent has to re-create parentSubject on changes
    // this.parentSubject.unsubscribe();
  }
}
