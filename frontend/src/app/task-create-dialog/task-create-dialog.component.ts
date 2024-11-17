import { Component } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogueComponent } from '../confirmation-dialogue/confirmation-dialogue.component';
import { Task } from '../task';

@Component({
  selector: 'app-task-create-dialog',
  templateUrl: './task-create-dialog.component.html',
  styleUrls: ['./task-create-dialog.component.css'],
})
export class TaskCreateDialogComponent {
  task: Task = {
    id: 0,
    title: '',
    description: '',
    status: '',
    dueDate: new Date(),
  };

  statuses = ['TO_DO', 'IN_PROGRESS', 'DONE'];

  constructor(
    private dialogRef: MatDialogRef<TaskCreateDialogComponent>,
    private dialog: MatDialog
  ) {}

  validateForm(): boolean {
    return (
      !!this.task.title?.trim() &&
      !!this.task.description?.trim() &&
      !!this.task.status?.trim() &&
      this.task.dueDate !== undefined &&
      new Date(this.task.dueDate) > new Date()
    );
  }

  submit() {
    const confirmationRef = this.dialog.open(ConfirmationDialogueComponent, {
      width: '300px',
      data: { message: 'Are you sure you want to create this task?' },
    });

    confirmationRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dialogRef.close(this.task);
      }
    });
  }

  cancel() {
    this.dialogRef.close();
  }
}
