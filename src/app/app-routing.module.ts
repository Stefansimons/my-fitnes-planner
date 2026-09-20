import { RoleGuard } from './core/auth/role.guard';
import { AuthGuard } from './core/auth/auth.guard';
import { LoginComponent } from './shared/components/login/login.component';
import { RegisterComponent } from './shared/components/register/register.component';
import { HomeComponent } from './core/components/home/home.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'training',
    loadChildren: () =>
      import('./features/workouts/training.module').then(
        (m) => m.TrainingModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'nutrition',
    loadChildren: () =>
      import('./features/nutrition/nutrition.module').then(
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
