import { Training } from './../../models/training.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css'],
})
export class TrainingComponent implements OnInit {
  isNewItem: boolean = false;
  constructor() {}

  ngOnInit(): void {}
  /**
   *
   * @param training
   */
  editTraining(training: Training) {
    // this.trainingForm.setValue({
    //   id: training.id,
    //   trainingDate: new Date(training.trainingDate),
    //   typeOfTraining: training.typeOfTraining,
    // });
  }
  /**
   * Child (@OUTPUT) - Parent - Child(@INPUT)
   */
  newItemAdded(e: boolean) {
    this.isNewItem = e;
  }
}
