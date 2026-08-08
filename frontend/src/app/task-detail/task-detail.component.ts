import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from '../task';
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
      this.fetchTaskDetails(this.taskId);
    }
  }

  private fetchTaskDetails(id: number): void {
    this.taskService.getTaskById(id).subscribe({
      next: (task) =>
        this.taskForm.patchValue({
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate ? new Date(task.dueDate) : null,
        }),
      error: (error) => console.error('Error fetching task details:', error),
    });
  }

  get dueDate(): AbstractControl | null {
    return this.taskForm.get('dueDate');
  }

  onSubmit(): void {
    if (this.taskForm.invalid || this.taskId === null) {
      this.taskForm.markAllAsTouched();
      return;
    }

    this.confirmService.confirm('Save changes to this task?').subscribe((confirmed) => {
      if (confirmed && this.taskId !== null) {
        this.taskService.updateTask(this.taskId, this.buildTask()).subscribe(() => {
          this.router.navigate(['/tasks']);
        });
      }
    });
  }

  deleteTask(): void {
    this.confirmService.confirm('Are you sure you want to delete this task?').subscribe((confirmed) => {
      if (confirmed && this.taskId !== null) {
        this.taskService.deleteTask(this.taskId).subscribe(() => {
          this.router.navigate(['/tasks']);
        });
      }
    });
  }

  navigateBack(): void {
    this.router.navigate(['/tasks']);
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
    };
  }
}

function futureDateValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }
  const selected = new Date(control.value);
  const today = new Date();
  selected.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return selected > today ? null : { invalidDate: 'Due date must be in the future.' };
}

function toIsoDate(date: Date | string): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
