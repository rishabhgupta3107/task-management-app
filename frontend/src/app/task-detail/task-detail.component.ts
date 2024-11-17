import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationDialogueComponent } from '../confirmation-dialogue/confirmation-dialogue.component';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent implements OnInit {

  taskForm: FormGroup;
  taskId: number | null = null;
  statuses = ['TO_DO', 'IN_PROGRESS', 'DONE'];
  priorities = ['LOW', 'MEDIUM', 'HIGH'];

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.taskForm = this.fb.group({
      id: [{ value: '', disabled: true }],
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(1000)]],
      status: ['', Validators.required],
      priority: ['', Validators.required],
      dueDate: [null, [Validators.required, this.dateValidator]]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.taskId = Number(params.get('id'));
      if (this.taskId) {
        this.taskService.getTaskById(this.taskId).subscribe(task => {
          this.taskForm.patchValue(task);
        });
      }
    });
  }

  dateValidator(control: AbstractControl): { [key: string]: any } | null {
    const selectedDate = new Date(control.value);
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate <= today) {
      return { invalidDate: 'Due date cannot be today or in the past' };
    }
    return null;
  }

  get dueDate() {
    return this.taskForm.get('dueDate');
  }

  getDueDateErrorMessage() {
    if (this.dueDate?.hasError('invalidDate')) {
      return this.dueDate?.getError('invalidDate');
    }
    return '';
  }

  onSubmit() {
    if (this.taskForm.valid) {
      const dialogRef = this.dialog.open(ConfirmationDialogueComponent, {
        width: '300px',
        data: { message: 'Sab sach bhara hai na? Mummy kasam khao' }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const task = this.taskForm.value;
          if (this.taskId) {
            this.taskService.updateTask(this.taskId, task).subscribe(() => {
              this.router.navigate(['/tasks']);
            });
          }
        }
      });
    }
  }

  deleteTask() {
    const dialogRef = this.dialog.open(ConfirmationDialogueComponent, {
      width: '300px',
      data: { message: 'Are you sure you want to delete this task?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.taskId) {
        this.taskService.deleteTask(this.taskId).subscribe(() => {
          this.router.navigate(['/tasks']);
        });
      }
    });
  }

  navigateBack() {
    this.router.navigate(['/tasks']);
  }
}
