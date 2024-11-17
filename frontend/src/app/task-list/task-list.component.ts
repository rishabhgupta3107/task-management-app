import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { TaskService } from '../services/task.service';
import { Task } from '../task';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogueComponent } from '../confirmation-dialogue/confirmation-dialogue.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { TaskCreateDialogComponent } from '../task-create-dialog/task-create-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

  tasks: Task[] = [];
  filteredTasks = new MatTableDataSource<Task>();
  displayedColumns: string[] = ['id', 'title', 'status', 'action'];


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  applyFilter(filterValue: any): void {
    this.filteredTasks.filter = filterValue.value.trim().toLowerCase();
  }

  loadTasks() {
    this.taskService.getAllTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.filteredTasks.data = tasks;
      if (this.paginator) {
        this.filteredTasks.paginator = this.paginator;
      }
    });
  }

  confirmDeleteTask(id: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogueComponent, {
      width: '300px',
      data: { message: 'Are you sure you want to delete this task?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.deleteTask(id).subscribe(() => {
          this.loadTasks();
        });
      }
    });
  }

  openLogoutDialog() {
    const dialogRef = this.dialog.open(ConfirmationDialogueComponent, {
      width: '300px',
      data: { message: 'Do you really want to log out?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authService.logout();
      }
    });
  }

  
  viewTaskDetails(id: any) {
    this.router.navigate([`/tasks/${id.id}`]);
  }

  openTaskCreateDialog() {
    const dialogRef = this.dialog.open(TaskCreateDialogComponent, {
      width: '500px'
    });
  
    dialogRef.afterClosed().subscribe(task => {
      if (task) {
        this.taskService.createTask(task).subscribe(() => {
          this.loadTasks();
        });
      }
    });
  }
}
