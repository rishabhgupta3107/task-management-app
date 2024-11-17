import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TaskService } from './task.service';
import { Task } from '../task';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService]
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve tasks from the API via GET', () => {
    const dummyTasks: Task[] = [
      { id: 1, title: 'Task 1', description: 'Description 1', status: 'To Do' },
      { id: 2, title: 'Task 2', description: 'Description 2', status: 'In Progress' }
    ];

    service.getAllTasks().subscribe(tasks => {
      expect(tasks.length).toBe(2);
      expect(tasks).toEqual(dummyTasks);
    });

    const request = httpMock.expectOne(`${service.baseUrl}`);
    expect(request.request.method).toBe('GET');
    request.flush(dummyTasks);
  });

  it('should create a new task via POST', () => {
    const newTask: Task = { id: 3, title: 'Task 3', description: 'Description 3', status: 'Done' };

    service.createTask(newTask).subscribe(task => {
      expect(task).toEqual(newTask);
    });

    const request = httpMock.expectOne(`${service.baseUrl}`);
    expect(request.request.method).toBe('POST');
    request.flush(newTask);
  });

  it('should update an existing task via PUT', () => {
    const updatedTask: Task = { id: 1, title: 'Updated Task', description: 'Updated Description', status: 'In Progress' };

    service.updateTask(1, updatedTask).subscribe(task => {
      expect(task).toEqual(updatedTask);
    });

    const request = httpMock.expectOne(`${service.baseUrl}/${updatedTask.id}`);
    expect(request.request.method).toBe('PUT');
    request.flush(updatedTask);
  });

  it('should delete a task via DELETE', () => {
    service.deleteTask(1).subscribe(response => {
      expect(response).toBeNull();
    });

    const request = httpMock.expectOne(`${service.baseUrl}/1`);
    expect(request.request.method).toBe('DELETE');
    request.flush(null);
  });
});