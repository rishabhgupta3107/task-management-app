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
import { TeamComponent } from './team/team.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  { path: '', redirectTo: '/welcome', pathMatch: 'full' },
  {
    path: 'welcome',
    component: WelcomeComponent,
    title: 'Welcome',
    data: {
      description:
        'HELM — keyboard-first mission control for live, time-sensitive work. The speed of Linear, the density of a trading terminal.',
    },
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Sign In',
    data: { description: 'Sign in to your HELM account.' },
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Create Account',
    data: { description: 'Create a HELM account and take command of your work.' },
  },
  { path: 'logout', component: LogoutComponent, canActivate: [authGuard], title: 'Signing out' },
  {
    path: 'app',
    component: ShellComponent,
    canActivate: [authGuard],
    title: 'Command Deck',
    children: [
      { path: '', redirectTo: 'focus', pathMatch: 'full' },
      { path: 'focus', component: FocusComponent, title: 'Focus' },
      { path: 'board', component: TaskListComponent, title: 'Board' },
      { path: 'analytics', component: AnalyticsComponent, title: 'Analytics' },
      { path: 'team', component: TeamComponent, title: 'Team' },
      { path: 'profile', component: ProfileComponent, title: 'Profile' },
      { path: 'tasks/:id', component: TaskDetailComponent, title: 'Task' },
    ],
  },
  // Legacy deep links → new nested routes.
  { path: 'tasks', redirectTo: '/app/board', pathMatch: 'full' },
  { path: 'tasks/:id', redirectTo: '/app/tasks/:id' },
  { path: '**', component: NotFoundComponent, title: 'Not Found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
