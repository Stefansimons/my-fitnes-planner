import { SpinnerService } from './../../../shared/services/spinner.service';
import { Exercise, Series } from './../../models/training.model';
import {
  userTempData,
  UserService,
} from './../../../shared/services/user.service';
import { User } from './../../../shared/models/user.model';
import { FirestoreService } from './../../../shared/services/firestore.service';
import { TrainingService } from '../../services/training.service';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
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
import { map, skip, tap } from 'rxjs/operators';
import {} from './../../../shared/';
import { BehaviorSubject, Subject } from 'rxjs';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { SubSink } from 'subsink';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

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
    private fs: AngularFirestore,
    private fb: FormBuilder,
    private dts: TrainingService,
    private fss: FirestoreService,
    private us: UserService,
    private cal: NgbCalendar,
    private ss: SpinnerService
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
      typeOfTraining: ['', Validators.required],
      exerciseNum: [0, [Validators.required, this.numberZeroToNullValidator()]],
      // repsNum: [''],
      exercises: this.fb.array([]),
      // series: new FormArray([]), // ? exercises.series
    });

    const editTrainingData = this.dts.getTraining$.subscribe((training) => {
      this.editTraining = training;
      if (this.editTraining) this.setFormValue(this.editTraining);
    });

    this.subsink.add(editTrainingData);
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
   * @param date
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
      typeOfTraining: training.typeOfTraining,
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
  onSubmit() {
    // this.trainingForm.get('exercises').controls[1].controls.series;
    // TODO: Use EventEmitter with form value
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
    // TODO: REDUDANT CODE
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
    console.log('form=>', this.form);

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
   * @param training // TODO:Imlement this.
   */
  //  fillInnerArray(exeIndex){

  //  }
  /**
   *
   * @param training
   */
  saveTraining(training: Training) {
    if (!this.form.valid) return;

    training.trainingDate = this.format(
      this.trainingForm.controls['trainingDate'].value
    );
    this.dts
      .saveTraining(training)
      .then((res) => {
        this.form.reset();
        this.save.emit(true);
        alert(`Successfully insert!`);
      })
      .catch((error) => alert(`Something went wrong => ${error.message}`));
    // // Emit next value to child component
    //   this.eventsSubject.next(this.userModel.id);
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

  // login() {
  //   this.us.saveUser();
  //   this.eventsSubject.next(this.userModel.id); // TODO: COMMENT THIS
  // }
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
