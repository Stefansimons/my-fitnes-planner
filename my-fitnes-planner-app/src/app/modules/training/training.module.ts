import { TrainingRoutingModule } from './training-routing.module';
import { MaterialModule } from './../../material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainingListComponent } from './components/training-list/training-list.component';
import { TrainingFormComponent } from './components/training-form/training-form.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [TrainingListComponent, TrainingFormComponent],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    TrainingRoutingModule,
  ],
  exports: [TrainingListComponent, TrainingFormComponent],
})
export class TrainingModule {}
