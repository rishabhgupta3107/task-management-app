import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Client, ClientPayload, Dashboard, DashboardSummary, Widget } from '../models/agency';

@Injectable({ providedIn: 'root' })
export class ClientService {
  private readonly base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ----- clients -----
  listClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.base}/api/clients`);
  }
  getClient(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.base}/api/clients/${id}`);
  }
  createClient(payload: ClientPayload): Observable<Client> {
    return this.http.post<Client>(`${this.base}/api/clients`, payload);
  }
  updateClient(id: number, payload: ClientPayload): Observable<Client> {
    return this.http.put<Client>(`${this.base}/api/clients/${id}`, payload);
  }
  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/api/clients/${id}`);
  }
  rotateIngestToken(id: number): Observable<Client> {
    return this.http.post<Client>(`${this.base}/api/clients/${id}/ingest-token/rotate`, {});
  }

  // ----- dashboards -----
  listDashboards(clientId: number): Observable<DashboardSummary[]> {
    return this.http.get<DashboardSummary[]>(`${this.base}/api/clients/${clientId}/dashboards`);
  }
  createDashboard(clientId: number, name: string, template: string): Observable<Dashboard> {
    return this.http.post<Dashboard>(`${this.base}/api/clients/${clientId}/dashboards`, { name, template });
  }
  getDashboard(id: number): Observable<Dashboard> {
    return this.http.get<Dashboard>(`${this.base}/api/dashboards/${id}`);
  }
  deleteDashboard(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/api/dashboards/${id}`);
  }
  setShare(id: number, enabled: boolean): Observable<Dashboard> {
    return this.http.post<Dashboard>(`${this.base}/api/dashboards/${id}/share?enabled=${enabled}`, {});
  }
  setSchedule(id: number, frequency: string, recipient: string): Observable<Dashboard> {
    return this.http.put<Dashboard>(`${this.base}/api/dashboards/${id}/schedule`, { frequency, recipient });
  }
  sendNow(id: number): Observable<{ status: string }> {
    return this.http.post<{ status: string }>(`${this.base}/api/dashboards/${id}/send-now`, {});
  }

  // ----- widgets -----
  addWidget(dashboardId: number, widget: Widget): Observable<Widget> {
    return this.http.post<Widget>(`${this.base}/api/dashboards/${dashboardId}/widgets`, widget);
  }
  updateWidget(dashboardId: number, widgetId: number, widget: Widget): Observable<Widget> {
    return this.http.put<Widget>(`${this.base}/api/dashboards/${dashboardId}/widgets/${widgetId}`, widget);
  }
  deleteWidget(dashboardId: number, widgetId: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/api/dashboards/${dashboardId}/widgets/${widgetId}`);
  }
}
