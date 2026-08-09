import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ConfirmService } from '../services/confirm.service';
import { TeamService } from '../services/team.service';
import { Task } from '../task';
import { TeamMember } from '../models/user-profile';
import { TASK_PRIORITIES, TASK_STATUSES } from '../task-constants';

@Component({
  selector: 'app-task-create-dialog',
  templateUrl: './task-create-dialog.component.html',
  styleUrls: ['./task-create-dialog.component.css'],
})
export class TaskCreateDialogComponent implements OnInit {
  readonly statuses = TASK_STATUSES;
  readonly priorities = TASK_PRIORITIES;

  taskForm: FormGroup;
  reports: TeamMember[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TaskCreateDialogComponent, Task>,
    private confirmService: ConfirmService,
    private teamService: TeamService
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(1000)]],
      status: ['', Validators.required],
      priority: ['', Validators.required],
      dueDate: [null, [Validators.required, futureDateValidator]],
      assigneeUsername: [null],
    });
  }

  ngOnInit(): void {
    // Only managers/leads get reports back; workers get 403 and simply see no assignee picker.
    this.teamService.getReports().subscribe({
      next: (reports) => (this.reports = reports),
      error: () => (this.reports = []),
    });
  }

  submit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }
    this.confirmService.confirm('Create this task?').subscribe((confirmed) => {
      if (confirmed) {
        this.dialogRef.close(toTask(this.taskForm.value));
      }
    });
  }

  cancel(): void {
    this.dialogRef.close();
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

function toTask(value: {
  title: string;
  description: string;
  status: Task['status'];
  priority: Task['priority'];
  dueDate: Date;
  assigneeUsername: string | null;
}): Task {
  return {
    title: value.title,
    description: value.description,
    status: value.status,
    priority: value.priority,
    dueDate: toIsoDate(value.dueDate),
    assigneeUsername: value.assigneeUsername || undefined,
  };
}

function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
