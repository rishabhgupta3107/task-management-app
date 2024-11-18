import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http'; // Import this module
import { TaskListComponent } from './task-list.component';
import { of } from 'rxjs';
import { TaskService } from '../services/task.service';
import { MatIconModule } from '@angular/material/icon';

class MockTaskService {
  getTasks() {
    return of([]);
  }
}

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskListComponent],
      imports: [HttpClientModule, MatIconModule],
      providers: [
        { provide: TaskService, useClass: MockTaskService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
