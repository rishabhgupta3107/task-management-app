import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Task, Subtask } from '../task';
import { TASK_PRIORITIES, TASK_STATUSES } from '../task-constants';
import { ConfirmService } from '../services/confirm.service';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css'],
})
export class TaskDetailComponent implements OnInit {
  readonly statuses = TASK_STATUSES;
  readonly priorities = TASK_PRIORITIES;

  taskForm: FormGroup;
  taskId: number | null = null;

  tags: string[] = [];
  subtasks: Subtask[] = [];
  newTag = '';
  newSubtask = '';
  createdAt?: string;
  updatedAt?: string;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router,
    private confirmService: ConfirmService
  ) {
    this.taskForm = this.fb.group({
      id: [{ value: '', disabled: true }],
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(1000)]],
      status: ['', Validators.required],
      priority: ['', Validators.required],
      dueDate: [null, [Validators.required, futureDateValidator]],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.taskId = +id;
      this.fetch(this.taskId);
    }
  }

  private fetch(id: number): void {
    this.taskService.getTaskById(id).subscribe({
      next: (task) => {
        this.taskForm.patchValue({
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate ? new Date(task.dueDate) : null,
        });
        this.tags = [...(task.tags ?? [])];
        this.subtasks = (task.subtasks ?? []).map((s) => ({ ...s }));
        this.createdAt = task.createdAt;
        this.updatedAt = task.updatedAt;
      },
      error: (error) => console.error('Error fetching task details:', error),
    });
  }

  get dueDate(): AbstractControl | null {
    return this.taskForm.get('dueDate');
  }

  get subtaskProgress(): number {
    if (!this.subtasks.length) return 0;
    return Math.round((this.subtasks.filter((s) => s.done).length / this.subtasks.length) * 100);
  }

  // ----- Tags -----
  addTag(): void {
    const t = this.newTag.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (t && !this.tags.includes(t) && this.tags.length < 8) {
      this.tags.push(t);
    }
    this.newTag = '';
  }
  removeTag(tag: string): void {
    this.tags = this.tags.filter((t) => t !== tag);
  }

  // ----- Subtasks -----
  addSubtask(): void {
    const title = this.newSubtask.trim();
    if (title) {
      this.subtasks.push({ title, done: false });
      this.newSubtask = '';
    }
  }
  toggleSubtask(s: Subtask): void {
    s.done = !s.done;
  }
  removeSubtask(index: number): void {
    this.subtasks.splice(index, 1);
  }

  onSubmit(): void {
    if (this.taskForm.invalid || this.taskId === null) {
      this.taskForm.markAllAsTouched();
      return;
    }
    this.confirmService.confirm('Save changes to this task?').subscribe((ok) => {
      if (ok && this.taskId !== null) {
        this.taskService.updateTask(this.taskId, this.buildTask()).subscribe(() => {
          this.router.navigate(['/app/board']);
        });
      }
    });
  }

  deleteTask(): void {
    this.confirmService.confirm('Delete this task? This cannot be undone.', 'Delete task').subscribe((ok) => {
      if (ok && this.taskId !== null) {
        this.taskService.deleteTask(this.taskId).subscribe(() => this.router.navigate(['/app/board']));
      }
    });
  }

  navigateBack(): void {
    this.router.navigate(['/app/board']);
  }

  private buildTask(): Task {
    const value = this.taskForm.getRawValue();
    return {
      id: value.id,
      title: value.title,
      description: value.description,
      status: value.status,
      priority: value.priority,
      dueDate: toIsoDate(value.dueDate),
      tags: this.tags,
      subtasks: this.subtasks,
    };
  }
}

function futureDateValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const selected = new Date(control.value);
  const today = new Date();
  selected.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return selected > today ? null : { invalidDate: 'Due date must be in the future.' };
}

function toIsoDate(date: Date | string): string {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
