import { Routes } from '@angular/router';
import { TaskListComponent } from './task-list/task-list.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login.component';
import { RegisterComponent } from './auth/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [authGuard] },
  { path: 'tasks', component: TaskListComponent, canActivate: [authGuard] },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  // Add feature routes (dashboard etc.) below
];
