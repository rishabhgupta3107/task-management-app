import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Page, Task } from '../task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly baseUrl = `${environment.apiUrl}/api/tasks`;

  constructor(private http: HttpClient) {}

  /** Server-side pagination. `sort` is a Spring sort expression like "title,asc". */
  getTasks(page = 0, size = 20, sort?: string): Observable<Page<Task>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (sort) {
      params = params.set('sort', sort);
    }
    return this.http.get<Page<Task>>(this.baseUrl, { params });
  }

  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.baseUrl}/${id}`);
  }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.baseUrl, task);
  }

  updateTask(id: number, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/${id}`, task);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  searchTasks(keyword: string): Observable<Task[]> {
    const params = new HttpParams().set('keyword', keyword);
    return this.http.get<Task[]>(`${this.baseUrl}/search`, { params });
  }
}
