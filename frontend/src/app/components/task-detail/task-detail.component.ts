import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent implements OnInit {
  taskForm: FormGroup;
  taskId: number | null = null;

  statuses = ['TO_DO', 'IN_PROGRESS', 'DONE'];

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(1000)]],
      status: ['', Validators.required],
      dueDate: [null]
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

  onSubmit() {
    if (this.taskForm.valid) {
      const task = this.taskForm.value;
      if (this.taskId) {
        this.taskService.updateTask(this.taskId, task).subscribe(() => {
          this.router.navigate(['/tasks']);
        });
      } else {
        this.taskService.createTask(task).subscribe(() => {
          this.router.navigate(['/tasks']);
        });
      }
    }
  }
}
