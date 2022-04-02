import { HomeComponent } from './modules/core/components/home/home.component';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'training',
    loadChildren: () =>
      import('./modules/training/training.module').then(
        (m) => m.TrainingModule
      ),
  },
  {
    path: 'nutrition',
    loadChildren: () =>
      import('./modules/nutrition/nutrition.module').then(
        (m) => m.NutritionModule
      ),
  },
  { path: 'home', component: HomeComponent },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
