import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../services/client.service';
import { MetricService } from '../services/metric.service';
import { ConfirmService } from '../services/confirm.service';
import { Dashboard, KNOWN_METRIC_KEYS, MetricPoint, Widget, WidgetType } from '../models/agency';

@Component({
  selector: 'app-dashboard-view',
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.css'],
})
export class DashboardViewComponent implements OnInit {
  readonly metricKeys = KNOWN_METRIC_KEYS;
  readonly widgetTypes: WidgetType[] = ['KPI', 'LINE', 'BAR', 'DONUT', 'TABLE'];
  readonly ranges = [
    { label: '7d', days: 7 },
    { label: '30d', days: 30 },
    { label: '90d', days: 90 },
  ];

  dashboardId!: number;
  dashboard: Dashboard | null = null;
  points: MetricPoint[] = [];
  loading = true;
  rangeDays = 30;

  adding = false;
  newWidget: Widget = { type: 'KPI', title: '', metricKey: 'sessions', aggregation: 'SUM' };
  copied = false;

  // scheduling
  showSchedule = false;
  scheduleFreq = 'NONE';
  scheduleRecipient = '';
  scheduleMsg = '';
  readonly frequencies = ['NONE', 'DAILY', 'WEEKLY', 'MONTHLY'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientService: ClientService,
    private metricService: MetricService,
    private confirmService: ConfirmService
  ) {}

  ngOnInit(): void {
    this.dashboardId = +this.route.snapshot.paramMap.get('id')!;
    this.load();
  }

  load(): void {
    this.loading = true;
    this.clientService.getDashboard(this.dashboardId).subscribe({
      next: (d) => {
        this.dashboard = d;
        this.scheduleFreq = d.scheduleFrequency || 'NONE';
        this.scheduleRecipient = d.scheduleRecipient || '';
        this.loadMetrics();
      },
      error: () => (this.loading = false),
    });
  }

  exportPdf(): void {
    window.print();
  }

  saveSchedule(): void {
    this.clientService.setSchedule(this.dashboardId, this.scheduleFreq, this.scheduleRecipient).subscribe((d) => {
      this.dashboard = d;
      this.scheduleMsg = 'Schedule saved.';
    });
  }

  sendNow(): void {
    this.scheduleMsg = 'Sending…';
    this.clientService.sendNow(this.dashboardId).subscribe((r) => (this.scheduleMsg = r.status));
  }

  private loadMetrics(): void {
    if (!this.dashboard) return;
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - this.rangeDays);
    this.metricService
      .query(this.dashboard.clientId, this.iso(from), this.iso(to))
      .subscribe({
        next: (p) => {
          this.points = p;
          this.loading = false;
        },
        error: () => (this.loading = false),
      });
  }

  setRange(days: number): void {
    this.rangeDays = days;
    this.loadMetrics();
  }

  widgetClass(w: Widget): string {
    if (w.type === 'KPI') return 'span-1';
    if (w.type === 'TABLE' || w.type === 'DONUT') return 'span-1 tall';
    return 'span-2 tall';
  }

  addWidget(): void {
    if (!this.newWidget.title.trim() || !this.dashboard) return;
    this.clientService.addWidget(this.dashboardId, { ...this.newWidget }).subscribe(() => {
      this.adding = false;
      this.newWidget = { type: 'KPI', title: '', metricKey: 'sessions', aggregation: 'SUM' };
      this.load();
    });
  }

  removeWidget(w: Widget): void {
    if (w.id === undefined) return;
    this.clientService.deleteWidget(this.dashboardId, w.id).subscribe(() => this.load());
  }

  toggleShare(): void {
    if (!this.dashboard) return;
    const next = !this.dashboard.shareEnabled;
    this.clientService.setShare(this.dashboardId, next).subscribe((d) => (this.dashboard = d));
  }

  get shareUrl(): string {
    return this.dashboard?.shareToken ? `${location.origin}/share/${this.dashboard.shareToken}` : '';
  }

  copyShare(): void {
    if (!this.shareUrl) return;
    navigator.clipboard?.writeText(this.shareUrl);
    this.copied = true;
    setTimeout(() => (this.copied = false), 1500);
  }

  deleteDashboard(): void {
    if (!this.dashboard) return;
    this.confirmService.confirm('Delete this dashboard?', 'Delete dashboard').subscribe((ok) => {
      if (ok && this.dashboard) {
        const clientId = this.dashboard.clientId;
        this.clientService.deleteDashboard(this.dashboardId).subscribe(() =>
          this.router.navigate(['/app/clients', clientId])
        );
      }
    });
  }

  private iso(d: Date): string {
    return d.toISOString().slice(0, 10);
  }
}
