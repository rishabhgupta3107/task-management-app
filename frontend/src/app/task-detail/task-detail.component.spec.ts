import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { TaskDetailComponent } from './task-detail.component';
import { of } from 'rxjs';
import { TaskService } from '../services/task.service';

// Mock TaskService
class MockTaskService {
  getTaskById(id: number) {
    return of({ id, name: 'Sample Task', description: 'This is a sample task.' });
  }
}

describe('TaskDetailComponent', () => {
  let component: TaskDetailComponent;
  let fixture: ComponentFixture<TaskDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskDetailComponent],
      imports: [HttpClientModule],
      providers: [
        { provide: TaskService, useClass: MockTaskService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
