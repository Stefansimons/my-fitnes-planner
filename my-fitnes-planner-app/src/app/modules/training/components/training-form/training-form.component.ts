import { DataSource } from '@angular/cdk/collections';
import { DataSourceService } from './../../services/data-source.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Training } from '../../models/index';

@Component({
  selector: 'app-training-form',
  templateUrl: './training-form.component.html',
  styleUrls: ['./training-form.component.css'],
})
export class TrainingFormComponent implements OnInit {
  name = new FormControl('');
  clicked = false;
  constructor(
    private fs: AngularFirestore,
    private fb: FormBuilder,
    private dts: DataSourceService
  ) {}

  ngOnInit(): void {}

  trainingForm = this.fb.group({
    index: ['', Validators.required],
    trainingDate: [''],
    exerciseName: [''],
    weight: [''],
    typeOfTraining: [''],
  });
  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.warn(this.trainingForm.value);
  }
  addTraining(training: Training) {
    this.dts.refreshDataTable(training).subscribe((data: Training[]) => {
      this.dts.dataSource.data = data;
    });
  }
}
