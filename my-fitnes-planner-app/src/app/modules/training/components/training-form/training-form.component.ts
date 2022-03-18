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
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Training } from '../../models/index';
import { map } from 'rxjs/operators';
import {} from './../../../shared/';
import { BehaviorSubject, Subject } from 'rxjs';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-training-form',
  templateUrl: './training-form.component.html',
  styleUrls: ['./training-form.component.css'],
})
export class TrainingFormComponent implements OnInit {
  //eventsSubject: Subject<string> = new Subject<string>(); // There is not default value! so...
  clicked = false;
  userModel: User;

  readonly DELIMITER = '/';
  model1: string;
  // date: { year: number; month: number };
  trainingForm: FormGroup = this.fb.group({
    trainingDate: new FormControl(),
    typeOfTraining: [''],
    exerciseNum: [''],
    serieNum: [''],
    // repsNum: [''],
    exercises: this.fb.array([]),
    // series: new FormArray([]), // ? exercises.series
  });
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
  constructor(
    private fs: AngularFirestore,
    private fb: FormBuilder,
    private dts: TrainingService,
    private fss: FirestoreService,
    private us: UserService,
    private cal: NgbCalendar
  ) {}

  ngOnInit(): void {
    // TODO:  THIS RETRIEVE OBJECT LITERAL TEMPUSERDATA
    this.userModel = this.us.getLoggedUserData();
    // console.log('form');
    // TODO: UNCOMMENT THIS WHEN USER LOGI IS COMPLETE
    // NOTE: UNCOMMENT THIS WHEN USER LOGI IS COMPLETE

    //  this.eventsSubject = new BehaviorSubject<string>(this.userModel.id);

    // this.eventsSubject = new BehaviorSubject<string>('');

    // Hard code
    // this.exercises.push(
    //   this.fb.group({
    //     exerciseName: [''],
    //     series: this.fb.array([
    //       this.fb.group({
    //         repsNum: [1],
    //         weight: [1],
    //       }),
    //     ]),
    //   })
    // );
    //   //  HERE IS CAST VALUE AND HARD CODED VALUE FROM ABOVE
    //   'posle this.exercises.controls:',
    //   <FormArray>(
    //     (<FormGroup>(
    //       (<FormArray>this.trainingForm.controls.exercises).controls[0]
    //     )).controls.series
    //   )
    // );
    // this.exercisesControls.forEach((item) => {
    // }); //as FormArray; // controls[index] is needed!
  }
  selectToday() {
    //this.trainingForm.controls['trainingDate'].setValue(this.cal.getToday());
    // console.log(
    //   `this.trainingForm.controls['trainingDate']=>`,
    //   this.trainingForm.controls['trainingDate'].value
    // );
    this.trainingForm.controls['trainingDate'].setValue(
      this.format(this.trainingForm.controls['trainingDate'].value)
    );
    console.log(
      `this.trainingForm.controls['trainingDate']=>`,
      this.trainingForm.controls['trainingDate'].value
    );
    // console.log('date=>', this.date);
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
    // console.warn(this.trainingForm.value);
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
  /**
   *
   * @param e
   */
  onChangeExercise(e: any) {
    const numberOfExercises = e.target.value || 0;
    if (this.exercisesArray.length < numberOfExercises) {
      for (let i = this.exercisesArray.length; i < numberOfExercises; i++) {
        this.exercisesArray.push(
          this.fb.group({
            exerciseName: [''],
            serieNum: [''],
            series: this.fb.array([]),
          })
        );
      }
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
    const type = String(e.target.value);
    console.log(`type: ${type}`);
    for (const [id, items] of Object.entries(this.exercises)) {
      console.log('id:', id);
      console.log('items:', items);
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
   * @param empIndex
   */
  removeExercise(empIndex: number) {
    this.exercisesArray.removeAt(empIndex);
    this.setFormControlValue('exerciseNum', String(this.exercisesArray.length));
  }

  /**
   *
   * @param training
   */
  saveTraining(training: Training) {
    // format training date From date model: {
    //   "year": 2022,
    //   "month": 3,
    //   "day": 23
    // } to date mode day/month/year
    training.trainingDate = this.format(
      this.trainingForm.controls['trainingDate'].value
    );

    console.log('save => training=>', training);
    this.userModel.trainings.push(training);
    console.log('save=>user data =>', this.userModel);

    // new save event happened
    //this.newItemEvent.emit(true);

    this.dts
      .saveUser(this.userModel)
      .then((res) => {
        alert(`Successfull insert!`);
        this.us.updateLocalStorageUserData(this.userModel);
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
    //  this.eventsSubject.unsubscribe();
    // needed if child gets re-created (eg on some model changes)
    // note that subsequent subscriptions on the same subject will fail
    // so the parent has to re-create parentSubject on changes
    // this.parentSubject.unsubscribe();
  }
}
