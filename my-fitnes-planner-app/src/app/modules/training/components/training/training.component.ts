import { map } from 'rxjs/operators';
import { TrainingService } from './../../services/training.service';
import { Training } from './../../models/training.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css'],
})
export class TrainingComponent implements OnInit {
  isNewItem: boolean = false;
  constructor(private ts: TrainingService) {}

  ngOnInit(): void {}
  /**
   *  NOTE: SETTER SET VALUE
   * @param training
   */
  editTraining(training: Training) {
    this.ts.editTraining(training);
  }
  /**
   * Child (@OUTPUT) - Parent - Child(@INPUT)
   */
  newItemAdded(e: boolean) {
    this.isNewItem = e;
  }
}
