import { SharedModule } from './../shared/shared.module';
import { TrainingRoutingModule } from './training-routing.module';
import { MaterialModule } from './../../material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { TrainingListComponent } from './components/training-list/training-list.component';
import { TrainingFormComponent } from './components/training-form/training-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TrainingComponent } from './components/training/training.component';
import { NgbSortableTableDirective } from './directives/ngb-sortable-table.directive';
import { StatisticsComponent } from './components/statistics/statistics.component';

@NgModule({
  declarations: [
    TrainingListComponent,
    TrainingFormComponent,
    TrainingComponent,
    NgbSortableTableDirective,
    StatisticsComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    TrainingRoutingModule,
    SharedModule,
  ],
  exports: [],
  providers: [DecimalPipe],
})
export class TrainingModule {
  constructor() {}
}
