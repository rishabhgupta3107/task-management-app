import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TaskService } from '../services/task.service';
import { ConfirmService } from '../services/confirm.service';
import { Task, TaskStatus } from '../task';
import { dueLabel, urgencyScore } from '../services/urgency';
import { TaskCreateDialogComponent } from '../task-create-dialog/task-create-dialog.component';

type View = 'board' | 'list';
type SortDir = 'asc' | 'desc' | '';

interface Column {
  key: TaskStatus;
  label: string;
  id: string;
  tasks: Task[];
}

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent implements OnInit {
  view: View = 'board';
  loading = true;

  private all: Task[] = [];
  searchKeyword = '';

  columns: Column[] = [
    { key: 'TO_DO', label: 'To do', id: 'col-todo', tasks: [] },
    { key: 'IN_PROGRESS', label: 'In progress', id: 'col-progress', tasks: [] },
    { key: 'DONE', label: 'Done', id: 'col-done', tasks: [] },
  ];
  connectedIds = this.columns.map((c) => c.id);

  // List view state
  sortActive = '';
  sortDir: SortDir = '';

  due = dueLabel;

  constructor(
    private taskService: TaskService,
    private confirmService: ConfirmService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.load();
    if (this.route.snapshot.queryParamMap.get('new') === '1') {
      setTimeout(() => this.openTaskCreateDialog(), 0);
    }
  }

  load(): void {
    this.loading = true;
    this.taskService.getTasks(0, 200).subscribe({
      next: (page) => {
        this.all = page.content;
        this.rebuild();
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  private filtered(): Task[] {
    const q = this.searchKeyword.trim().toLowerCase();
    if (!q) {
      return this.all;
    }
    return this.all.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        (t.tags ?? []).some((tag) => tag.toLowerCase().includes(q))
    );
  }

  private rebuild(): void {
    const items = this.filtered();
    for (const col of this.columns) {
      col.tasks = items
        .filter((t) => t.status === col.key)
        .sort((a, b) => urgencyScore(b) - urgencyScore(a));
    }
  }

  get listTasks(): Task[] {
    let items = [...this.filtered()];
    if (this.sortActive && this.sortDir) {
      const dir = this.sortDir === 'asc' ? 1 : -1;
      items.sort((a, b) => {
        const av = (a as any)[this.sortActive] ?? '';
        const bv = (b as any)[this.sortActive] ?? '';
        return av > bv ? dir : av < bv ? -dir : 0;
      });
    }
    return items;
  }

  get counts(): Record<TaskStatus | 'ALL', number> {
    return {
      ALL: this.all.length,
      TO_DO: this.all.filter((t) => t.status === 'TO_DO').length,
      IN_PROGRESS: this.all.filter((t) => t.status === 'IN_PROGRESS').length,
      DONE: this.all.filter((t) => t.status === 'DONE').length,
    };
  }

  setView(view: View): void {
    this.view = view;
  }

  applyFilter(value: string): void {
    this.searchKeyword = value;
    this.rebuild();
  }

  toggleSort(column: string): void {
    if (this.sortActive !== column) {
      this.sortActive = column;
      this.sortDir = 'asc';
    } else {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : this.sortDir === 'desc' ? '' : 'asc';
      if (!this.sortDir) this.sortActive = '';
    }
  }

  drop(event: CdkDragDrop<Task[]>, target: Column): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      return;
    }
    const task = event.previousContainer.data[event.previousIndex];
    transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    if (task.id === undefined || task.status === target.key) {
      return;
    }
    const updated = { ...task, status: target.key };
    task.status = target.key;
    this.all = this.all.map((t) => (t.id === task.id ? updated : t));
    this.taskService.updateTask(task.id, updated).subscribe({ error: () => this.load() });
  }

  countDone(task: Task): number {
    return (task.subtasks ?? []).filter((s) => s.done).length;
  }

  viewTaskDetails(task: Task): void {
    this.router.navigate(['/app/tasks', task.id]);
  }

  confirmDeleteTask(task: Task, event: MouseEvent): void {
    event.stopPropagation();
    if (task.id === undefined) return;
    this.confirmService.confirm('Delete this task? This cannot be undone.', 'Delete task').subscribe((ok) => {
      if (ok && task.id !== undefined) {
        this.taskService.deleteTask(task.id).subscribe(() => this.load());
      }
    });
  }

  openTaskCreateDialog(): void {
    this.dialog
      .open(TaskCreateDialogComponent, { width: '540px', maxWidth: '92vw', panelClass: 'helm-dialog' })
      .afterClosed()
      .subscribe((task: Task | undefined) => {
        if (task) {
          this.taskService.createTask(task).subscribe(() => this.load());
        }
      });
  }
}
