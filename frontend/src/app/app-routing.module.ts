import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
import { TaskListComponent } from "./components/task-list/task-list.component";
import { TaskDetailComponent } from "./components/task-detail/task-detail.component";
import { AuthGuard } from "./guards/auth.guard";

const routes: Routes = [
    { path: '', redirectTo: '/tasks', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'tasks', component: TaskListComponent, canActivate: [AuthGuard] },
    { path: 'tasks/:id', component: TaskDetailComponent, canActivate: [AuthGuard] },
    { path: 'create-task', component: TaskDetailComponent, canActivate: [AuthGuard] }
  ];
  
  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
  