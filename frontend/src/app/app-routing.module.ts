import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { LogoutComponent } from './logout/logout.component';
import { authGuard } from './guards/auth.guard';
import { ShellComponent } from './shell/shell.component';
import { TaskDetailComponent } from './task-detail/task-detail.component';
import { TaskListComponent } from './task-list/task-list.component';
import { FocusComponent } from './focus/focus.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  { path: '', redirectTo: '/welcome', pathMatch: 'full' },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'logout', component: LogoutComponent, canActivate: [authGuard] },
  {
    path: 'app',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'focus', pathMatch: 'full' },
      { path: 'focus', component: FocusComponent },
      { path: 'board', component: TaskListComponent },
      { path: 'analytics', component: AnalyticsComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'tasks/:id', component: TaskDetailComponent },
    ],
  },
  // Legacy deep links → new nested routes.
  { path: 'tasks', redirectTo: '/app/board', pathMatch: 'full' },
  { path: 'tasks/:id', redirectTo: '/app/tasks/:id' },
  { path: '**', redirectTo: '/welcome' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
