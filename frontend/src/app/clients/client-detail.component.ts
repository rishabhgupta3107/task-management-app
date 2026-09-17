import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../services/client.service';
import { MetricService } from '../services/metric.service';
import { Client, DASHBOARD_TEMPLATES, DashboardSummary, KNOWN_METRIC_KEYS, MetricPoint } from '../models/agency';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-client-detail',
  templateUrl: './client-detail.component.html',
  styleUrls: ['./client-detail.component.css'],
})
export class ClientDetailComponent implements OnInit {
  readonly templates = DASHBOARD_TEMPLATES;
  readonly metricKeys = KNOWN_METRIC_KEYS;
  readonly apiBase = environment.apiUrl || '(your API origin)';

  clientId!: number;
  client: Client | null = null;
  dashboards: DashboardSummary[] = [];
  tab: 'dashboards' | 'data' = 'dashboards';
  loading = true;

  creating = false;
  newDash = { name: '', template: 'PAID_ADS' };

  // manual metric entry
  entry = { metricKey: 'sessions', channel: '', date: this.today(), value: null as number | null };
  ingestMsg = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientService: ClientService,
    private metricService: MetricService
  ) {}

  get apiExample(): string {
    const token = this.client?.ingestToken || '<ingest-token>';
    return (
      `POST ${this.apiBase}/api/ingest/${token}\n` +
      `[{ "metricKey": "sessions", "date": "2026-09-15", "value": 512 }]`
    );
  }

  rotateToken(): void {
    this.clientService.rotateIngestToken(this.clientId).subscribe((c) => {
      this.client = c;
      this.ingestMsg = 'Ingest token rotated — update any scripts using the old one.';
    });
  }

  ngOnInit(): void {
    this.clientId = +this.route.snapshot.paramMap.get('id')!;
    this.clientService.getClient(this.clientId).subscribe((c) => (this.client = c));
    this.loadDashboards();
  }

  loadDashboards(): void {
    this.loading = true;
    this.clientService.listDashboards(this.clientId).subscribe({
      next: (d) => {
        this.dashboards = d;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  createDashboard(): void {
    const name = this.newDash.name.trim();
    if (!name) return;
    this.clientService.createDashboard(this.clientId, name, this.newDash.template).subscribe((dash) => {
      this.router.navigate(['/app/dashboards', dash.id]);
    });
  }

  openDashboard(d: DashboardSummary): void {
    this.router.navigate(['/app/dashboards', d.id]);
  }

  // ----- data ingestion -----
  addPoint(): void {
    if (!this.entry.metricKey || this.entry.value === null || !this.entry.date) return;
    const point: MetricPoint = {
      metricKey: this.entry.metricKey,
      channel: this.entry.channel || undefined,
      date: this.entry.date,
      value: this.entry.value,
    };
    this.metricService.ingest(this.clientId, [point]).subscribe((r) => {
      this.ingestMsg = `Added ${r.ingested} point.`;
      this.entry.value = null;
    });
  }

  onCsv(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const points = this.parseCsv(String(reader.result));
      if (!points.length) {
        this.ingestMsg = 'No valid rows found. Expected columns: date, metricKey, channel, value.';
        return;
      }
      this.metricService.ingest(this.clientId, points).subscribe((r) => {
        this.ingestMsg = `Imported ${r.ingested} points from ${file.name}.`;
      });
    };
    reader.readAsText(file);
    input.value = '';
  }

  private parseCsv(text: string): MetricPoint[] {
    const lines = text.split(/\r?\n/).filter((l) => l.trim());
    if (lines.length < 2) return [];
    const header = lines[0].split(',').map((h) => h.trim().toLowerCase());
    const idx = (names: string[]) => header.findIndex((h) => names.includes(h));
    const di = idx(['date']);
    const mi = idx(['metrickey', 'metric_key', 'metric']);
    const ci = idx(['channel', 'source']);
    const vi = idx(['value', 'val']);
    if (di < 0 || mi < 0 || vi < 0) return [];
    const points: MetricPoint[] = [];
    for (const line of lines.slice(1)) {
      const cols = line.split(',');
      const date = (cols[di] || '').trim();
      const metricKey = (cols[mi] || '').trim();
      const value = parseFloat((cols[vi] || '').trim());
      if (!date || !metricKey || isNaN(value)) continue;
      points.push({ date, metricKey, value, channel: ci >= 0 ? (cols[ci] || '').trim() || undefined : undefined });
    }
    return points;
  }

  private today(): string {
    return new Date().toISOString().slice(0, 10);
  }
}
