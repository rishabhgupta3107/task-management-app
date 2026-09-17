import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { MetricPoint, PublicDashboard } from '../models/agency';

@Injectable({ providedIn: 'root' })
export class MetricService {
  private readonly base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  query(clientId: number, from?: string, to?: string): Observable<MetricPoint[]> {
    let params = new HttpParams();
    if (from) params = params.set('from', from);
    if (to) params = params.set('to', to);
    return this.http.get<MetricPoint[]>(`${this.base}/api/clients/${clientId}/metrics`, { params });
  }

  ingest(clientId: number, points: MetricPoint[]): Observable<{ ingested: number }> {
    return this.http.post<{ ingested: number }>(`${this.base}/api/clients/${clientId}/metrics`, points);
  }

  /** Public, unauthenticated white-label view. */
  publicDashboard(token: string): Observable<PublicDashboard> {
    return this.http.get<PublicDashboard>(`${this.base}/api/public/dashboards/${token}`);
  }
}
