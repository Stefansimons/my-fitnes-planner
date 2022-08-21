import { StatisticsComponent } from './components/statistics/statistics.component';
import { TrainingComponent } from './components/training/training.component';
import { TrainingListComponent } from './components/training-list/training-list.component';
import { TrainingFormComponent } from './components/training-form/training-form.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: TrainingComponent,
  },
  {
    path: 'list',
    component: TrainingListComponent,
  },
  {
    path: 'statistics',
    component: StatisticsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrainingRoutingModule {}
