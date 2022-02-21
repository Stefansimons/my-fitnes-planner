import { TrainingListComponent } from './components/training-list/training-list.component';
import { TrainingFormComponent } from './components/training-form/training-form.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'form', component: TrainingFormComponent },
  {
    path: 'list',
    component: TrainingListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrainingRoutingModule {}