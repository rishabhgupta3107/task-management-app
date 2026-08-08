import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { AuthService } from '../auth.service';
import { TaskService } from '../services/task.service';
import { ConfirmService } from '../services/confirm.service';
import { Task } from '../task';
import { TaskCreateDialogComponent } from '../task-create-dialog/task-create-dialog.component';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  displayedColumns: string[] = ['id', 'title', 'status', 'priority', 'action'];

  totalElements = 0;
  pageIndex = 0;
  pageSize = 10;
  readonly pageSizeOptions = [5, 10, 25, 100];

  private sortExpr?: string;
  private searchKeyword = '';
  loading = false;

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private confirmService: ConfirmService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading = true;

    // When a keyword is present we use the server-side search endpoint (unpaginated);
    // otherwise we use the paginated listing.
    if (this.searchKeyword) {
      this.taskService.searchTasks(this.searchKeyword).subscribe({
        next: (tasks) => {
          this.tasks = tasks;
          this.totalElements = tasks.length;
          this.loading = false;
        },
        error: () => (this.loading = false),
      });
      return;
    }

    this.taskService.getTasks(this.pageIndex, this.pageSize, this.sortExpr).subscribe({
      next: (page) => {
        this.tasks = page.content;
        this.totalElements = page.totalElements;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  applyFilter(value: string): void {
    this.searchKeyword = value.trim();
    this.pageIndex = 0;
    this.loadTasks();
  }

  onPage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadTasks();
  }

  onSort(sort: Sort): void {
    this.sortExpr = sort.direction ? `${sort.active},${sort.direction}` : undefined;
    this.pageIndex = 0;
    this.loadTasks();
  }

  viewTaskDetails(task: Task): void {
    this.router.navigate(['/tasks', task.id]);
  }

  confirmDeleteTask(task: Task): void {
    if (task.id === undefined) {
      return;
    }
    this.confirmService.confirm('Are you sure you want to delete this task?').subscribe((confirmed) => {
      if (confirmed && task.id !== undefined) {
        this.taskService.deleteTask(task.id).subscribe(() => this.loadTasks());
      }
    });
  }

  openLogoutDialog(): void {
    this.confirmService.confirm('Do you really want to log out?').subscribe((confirmed) => {
      if (confirmed) {
        this.authService.logout();
      }
    });
  }

  openTaskCreateDialog(): void {
    this.dialog
      .open(TaskCreateDialogComponent, { width: '500px', maxWidth: '90vw' })
      .afterClosed()
      .subscribe((task: Task | undefined) => {
        if (task) {
          this.taskService.createTask(task).subscribe(() => this.loadTasks());
        }
      });
  }
}
