import { environment } from './../../../../../environments/environment.prod';
import { Store } from '@ngrx/store';
import { ToastService } from './../../../shared/services/toast.service';
import { SpinnerService } from './../../../shared/services/spinner.service';
import { Exercise, Series } from './../../models/training.model';
import {
  userTempData,
  UserService,
} from './../../../shared/services/user.service';
import { User } from './../../../shared/models/user.model';
import { FirestoreService } from './../../../shared/services/firestore.service';
import { TrainingService } from '../../services/training.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  AfterViewInit,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { Validators } from '@angular/forms';
import { Training } from '../../models/index';
import {} from './../../../shared/';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { SubSink } from 'subsink';
import { typesOfTraining, exercises } from 'src/app/store/dummyData/trainings';

import * as fromAppState from 'src/app/store/app.reducer';

@Component({
  selector: 'app-training-form',
  templateUrl: './training-form.component.html',
  styleUrls: ['./training-form.component.css'],
})
export class TrainingFormComponent implements OnInit, AfterViewInit {
  @Output() save = new EventEmitter<boolean>();
  //eventsSubject: Subject<string> = new Subject<string>(); // There is not default value! so...
  clicked = false;
  userModel: User;
  editTraining: Training | undefined;
  emptyTypeOfTraining: boolean = false;
  readonly DELIMITER = '/';
  model1: string;
  // date: { year: number; month: number };
  trainingForm: FormGroup;
  selectedExercises: any[] = [];

  typesOfTraining = typesOfTraining;
  exercises = exercises;

  minValue: number = 1;
  maxValue: number = 10;
  private subsink: SubSink = new SubSink();
  constructor(
    private fb: FormBuilder,
    private store: Store<fromAppState.AppState>
  ) {}
  ngAfterViewInit(): void {}

  ngOnInit(): void {
    // Initialization of training form for preventing error getting value of getters
    this.trainingForm = this.fb.group({
      id: [null],
      trainingDate: new FormControl({
        day: new Date().getDate(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      }),
      updatedAt: new Date(),
      isActive: [],
      typeOfTraining: ['', Validators.required],
      exerciseNum: [
        0,
        [
          Validators.required,
          Validators.min(this.minValue),
          Validators.max(this.maxValue),
          this.numberCustomValidator(),
        ],
      ],
      exercises: this.fb.array([]),
      // series: new FormArray([]), // ? exercises.series
    });

    // const editTrainingData = this.dts.getTraining$.subscribe((training) => {
    //   this.editTraining = training;
    //   if (this.editTraining) this.setFormValue(this.editTraining);
    // });

    // this.subsink.add(editTrainingData);
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
    // End *************************************
    this.form.setValue(tempTraining);
    //let tempExercises: Exercise[] = [];
    // NOTE: IF I COULD SET VALUE FOR FORM I NEED TO SET INTERFACES OR TEMP OBJECTS WITH THE EXACT PROPS AS FORM CONTROL!!
    // tempTraining.exercises?.forEach((item, i) => {
    //   let tempItem: Exercise = { serieNum: item.series?.length, ...item };
    //   tempExercises.push({
    //     exerciseName: item.exerciseName,
    //     serieNum: item.serieNum,
    //     series: [],
    //   });
    // });
    //    this.form.patchValue(tempTraining);
  }
  /**
   *
   *
   * @returns
   */
  numberCustomValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const controlValue = control.value;
      return controlValue < this.minValue || controlValue > this.maxValue
        ? { missedValue: true }
        : null;
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
  onSubmit() {
    console.log(this.trainingForm);
  }
  /**
   *  convenience getters for easy access to form fields , Angular 8
   */
  get form() {
    return this.trainingForm;
  }
  get exercisesArray(): FormArray {
    return this.form.get('exercises') as FormArray;
  }

  get exercisesControls() {
    return this.exercisesArray.controls as FormGroup[];
    //   <div *ngFor="let exercise of exercisesControls; let i = index">
    // <div [formGroupName]="i" class="row">
  }
  /**
   *
   * @returns FormArray object
   */
  exerciseSeriesArray(exerciseIndex: number): FormArray {
    return this.exercisesArray.at(exerciseIndex).get('series') as FormArray;
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
  /**
   *
   * @param e
   */
  onChangeExercise(e: any) {
    if (!this.getFormControl('typeOfTraining')?.value)
      this.emptyTypeOfTraining = true;

    const numberOfExercises = e.target.value || 0;
    if (this.exercisesArray.length < numberOfExercises) {
      this.createExercisesFormControls(
        this.exercisesArray.length,
        numberOfExercises
      );
    } else {
      for (let i = this.exercisesArray.length; i >= numberOfExercises; i--) {
        this.exercisesArray.removeAt(i);

        // this.getFormControl('exerciseNum').setValue(this.exercisesArray.length);
      }
    }
  }
  /**
   * It sets appropriate exercises
   *
   * @returns
   */
  onChangeTypeOfTraining(e: any) {
    this.emptyTypeOfTraining = false;
    const type = String(e.target.value);
    this.setCertainExercises(type);
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
  newExerciseSerie(): FormGroup {
    return this.fb.group({
      repsNum: [''],
      weight: [''],
    });
  }
  /**
   *
   * @returns formGroup
   */
  newExercise(): FormGroup {
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
    return <FormArray>this.form.get(controlPath);
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

    training.updatedAt = new Date();
    training.isActive = true;
    this.dts.saveTraining(training);

    this.save.emit(true);
    // this.form.reset();
  }

  /**
   * Test Everything new features
   */
  testNewAll() {
    // this.testEmiter = !this.testEmiter;
    // this.dts.setNewTrainingEvent(true);
  }
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
