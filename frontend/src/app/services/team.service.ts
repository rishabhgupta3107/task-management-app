import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ManagerOption, TeamMember, UpdateMemberPayload } from '../models/user-profile';
import { Page, Task } from '../task';

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  private readonly base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /** Public — used by the registration "reports to" picker. */
  managers(): Observable<ManagerOption[]> {
    return this.http.get<ManagerOption[]>(`${this.base}/api/auth/managers`);
  }

  getReports(): Observable<TeamMember[]> {
    return this.http.get<TeamMember[]>(`${this.base}/api/team`);
  }

  addMember(username: string): Observable<TeamMember> {
    return this.http.post<TeamMember>(`${this.base}/api/team/members`, { username });
  }

  updateMember(username: string, payload: UpdateMemberPayload): Observable<TeamMember> {
    return this.http.put<TeamMember>(`${this.base}/api/team/members/${username}`, payload);
  }

  memberTasks(username: string, page = 0, size = 50): Observable<Page<Task>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<Page<Task>>(`${this.base}/api/tasks/member/${username}`, { params });
  }
}
