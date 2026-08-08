import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../auth.service';
import { TaskService } from '../services/task.service';
import { ConfirmService } from '../services/confirm.service';
import { Task, TaskStatus } from '../task';
import { TaskCreateDialogComponent } from '../task-create-dialog/task-create-dialog.component';

type SortDir = 'asc' | 'desc' | '';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];

  totalElements = 0;
  totalPages = 0;
  pageIndex = 0;
  pageSize = 10;

  sortActive = '';
  sortDir: SortDir = '';

  searchKeyword = '';
  loading = false;

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private confirmService: ConfirmService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTasks();
    if (this.route.snapshot.queryParamMap.get('new') === '1') {
      // Opened from the command palette.
      setTimeout(() => this.openTaskCreateDialog(), 0);
    }
  }

  // ----- derived stats -----
  get counts(): Record<TaskStatus | 'ALL', number> {
    const base: Record<TaskStatus | 'ALL', number> = {
      ALL: this.totalElements,
      TO_DO: 0,
      IN_PROGRESS: 0,
      DONE: 0,
    };
    for (const t of this.tasks) {
      base[t.status] = (base[t.status] ?? 0) + 1;
    }
    return base;
  }

  loadTasks(): void {
    this.loading = true;

    if (this.searchKeyword) {
      this.taskService.searchTasks(this.searchKeyword).subscribe({
        next: (tasks) => {
          this.tasks = tasks;
          this.totalElements = tasks.length;
          this.totalPages = 1;
          this.loading = false;
        },
        error: () => (this.loading = false),
      });
      return;
    }

    const sort = this.sortDir ? `${this.sortActive},${this.sortDir}` : undefined;
    this.taskService.getTasks(this.pageIndex, this.pageSize, sort).subscribe({
      next: (page) => {
        this.tasks = page.content;
        this.totalElements = page.totalElements;
        this.totalPages = page.totalPages;
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

  toggleSort(column: string): void {
    if (this.sortActive !== column) {
      this.sortActive = column;
      this.sortDir = 'asc';
    } else {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : this.sortDir === 'desc' ? '' : 'asc';
      if (!this.sortDir) {
        this.sortActive = '';
      }
    }
    this.pageIndex = 0;
    this.loadTasks();
  }

  prevPage(): void {
    if (this.pageIndex > 0) {
      this.pageIndex--;
      this.loadTasks();
    }
  }

  nextPage(): void {
    if (this.pageIndex < this.totalPages - 1) {
      this.pageIndex++;
      this.loadTasks();
    }
  }

  viewTaskDetails(task: Task): void {
    this.router.navigate(['/tasks', task.id]);
  }

  confirmDeleteTask(task: Task, event: MouseEvent): void {
    event.stopPropagation();
    if (task.id === undefined) {
      return;
    }
    this.confirmService.confirm('Delete this task? This cannot be undone.', 'Delete task').subscribe((ok) => {
      if (ok && task.id !== undefined) {
        this.taskService.deleteTask(task.id).subscribe(() => this.loadTasks());
      }
    });
  }

  logout(): void {
    this.confirmService.confirm('Sign out of HELM?', 'Sign out').subscribe((ok) => {
      if (ok) {
        this.authService.logout();
      }
    });
  }

  openTaskCreateDialog(): void {
    this.dialog
      .open(TaskCreateDialogComponent, { width: '520px', maxWidth: '92vw', panelClass: 'helm-dialog' })
      .afterClosed()
      .subscribe((task: Task | undefined) => {
        if (task) {
          this.taskService.createTask(task).subscribe(() => this.loadTasks());
        }
      });
  }
}
