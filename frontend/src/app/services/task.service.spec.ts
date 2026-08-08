import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TaskService } from './task.service';
import { Page, Task } from '../task';
import { environment } from '../../environments/environment';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/api/tasks`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService],
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve a page of tasks via GET', () => {
    const page: Page<Task> = {
      content: [
        { id: 1, title: 'Task 1', description: 'Description 1', status: 'TO_DO', priority: 'HIGH' },
        { id: 2, title: 'Task 2', description: 'Description 2', status: 'IN_PROGRESS', priority: 'LOW' },
      ],
      totalElements: 2,
      totalPages: 1,
      number: 0,
      size: 20,
    };

    service.getTasks(0, 20).subscribe((result) => {
      expect(result.content.length).toBe(2);
      expect(result).toEqual(page);
    });

    const request = httpMock.expectOne((r) => r.url === baseUrl);
    expect(request.request.method).toBe('GET');
    request.flush(page);
  });

  it('should create a new task via POST', () => {
    const newTask: Task = {
      id: 3,
      title: 'Task 3',
      description: 'Description 3',
      status: 'DONE',
      priority: 'MEDIUM',
    };

    service.createTask(newTask).subscribe((task) => expect(task).toEqual(newTask));

    const request = httpMock.expectOne(baseUrl);
    expect(request.request.method).toBe('POST');
    request.flush(newTask);
  });

  it('should update an existing task via PUT', () => {
    const updatedTask: Task = {
      id: 1,
      title: 'Updated Task',
      description: 'Updated Description',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
    };

    service.updateTask(1, updatedTask).subscribe((task) => expect(task).toEqual(updatedTask));

    const request = httpMock.expectOne(`${baseUrl}/${updatedTask.id}`);
    expect(request.request.method).toBe('PUT');
    request.flush(updatedTask);
  });

  it('should delete a task via DELETE', () => {
    service.deleteTask(1).subscribe((response) => expect(response).toBeNull());

    const request = httpMock.expectOne(`${baseUrl}/1`);
    expect(request.request.method).toBe('DELETE');
    request.flush(null);
  });
});
