import { RoleGuard } from './modules/core/auth/role.guard';
import { AuthGuard } from './modules/core/auth/auth.guard';
import { LoginComponent } from './modules/shared/components/login/login.component';
import { RegisterComponent } from './modules/shared/components/register/register.component';
import { HomeComponent } from './modules/core/components/home/home.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'training',
    loadChildren: () =>
      import('./modules/training/training.module').then(
        (m) => m.TrainingModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'nutrition',
    loadChildren: () =>
      import('./modules/nutrition/nutrition.module').then(
        (m) => m.NutritionModule
      ),
    canActivate: [RoleGuard],
  },
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
