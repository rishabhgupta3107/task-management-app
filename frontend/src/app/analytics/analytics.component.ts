import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, effect } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { TaskService } from '../services/task.service';
import { ThemeService } from '../services/theme.service';
import { Task } from '../task';
import { daysUntilDue } from '../services/urgency';

Chart.register(...registerables);

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css'],
})
export class AnalyticsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('statusCanvas') statusCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('priorityCanvas') priorityCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('throughputCanvas') throughputCanvas!: ElementRef<HTMLCanvasElement>;

  loading = true;
  tasks: Task[] = [];

  kpis = { total: 0, completion: 0, overdue: 0, active: 0 };

  private charts: Chart[] = [];
  private viewReady = false;

  constructor(private taskService: TaskService, private theme: ThemeService) {
    // Re-render charts whenever the theme changes so colors stay in sync.
    effect(() => {
      this.theme.theme();
      if (this.viewReady && !this.loading) {
        this.render();
      }
    });
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.taskService.getTasks(0, 500).subscribe({
      next: (page) => {
        this.tasks = page.content;
        this.computeKpis();
        this.loading = false;
        setTimeout(() => this.render());
      },
      error: () => (this.loading = false),
    });
  }

  ngOnDestroy(): void {
    this.destroyCharts();
  }

  private computeKpis(): void {
    const total = this.tasks.length;
    const done = this.tasks.filter((t) => t.status === 'DONE').length;
    const overdue = this.tasks.filter(
      (t) => t.status !== 'DONE' && (daysUntilDue(t) ?? 1) < 0
    ).length;
    this.kpis = {
      total,
      completion: total ? Math.round((done / total) * 100) : 0,
      overdue,
      active: total - done,
    };
  }

  private css(name: string): string {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  private render(): void {
    this.destroyCharts();
    const text = this.css('--text-muted');
    const grid = this.css('--border');
    Chart.defaults.color = text;
    Chart.defaults.font.family = "'JetBrains Mono', monospace";

    const count = (s: string) => this.tasks.filter((t) => t.status === s).length;
    const prio = (p: string) => this.tasks.filter((t) => t.priority === p).length;

    // Status donut
    this.charts.push(
      new Chart(this.statusCanvas.nativeElement, {
        type: 'doughnut',
        data: {
          labels: ['To do', 'In progress', 'Done'],
          datasets: [
            {
              data: [count('TO_DO'), count('IN_PROGRESS'), count('DONE')],
              backgroundColor: [
                this.css('--status-todo'),
                this.css('--status-progress'),
                this.css('--status-done'),
              ],
              borderWidth: 0,
              hoverOffset: 6,
            },
          ],
        },
        options: {
          cutout: '68%',
          plugins: { legend: { position: 'bottom', labels: { padding: 14, boxWidth: 10 } } },
        },
      })
    );

    // Priority bar
    this.charts.push(
      new Chart(this.priorityCanvas.nativeElement, {
        type: 'bar',
        data: {
          labels: ['Low', 'Medium', 'High'],
          datasets: [
            {
              data: [prio('LOW'), prio('MEDIUM'), prio('HIGH')],
              backgroundColor: [this.css('--prio-low'), this.css('--prio-medium'), this.css('--prio-high')],
              borderRadius: 6,
              barThickness: 44,
            },
          ],
        },
        options: {
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false } },
            y: { grid: { color: grid }, ticks: { precision: 0 }, beginAtZero: true },
          },
        },
      })
    );

    // Throughput: created vs completed over the last 14 days
    const { labels, created, completed } = this.throughputSeries();
    this.charts.push(
      new Chart(this.throughputCanvas.nativeElement, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Created',
              data: created,
              borderColor: this.css('--accent'),
              backgroundColor: 'transparent',
              tension: 0.35,
              pointRadius: 0,
              borderWidth: 2,
            },
            {
              label: 'Completed',
              data: completed,
              borderColor: this.css('--status-done'),
              backgroundColor: 'transparent',
              tension: 0.35,
              pointRadius: 0,
              borderWidth: 2,
            },
          ],
        },
        options: {
          plugins: { legend: { position: 'bottom', labels: { padding: 14, boxWidth: 10 } } },
          scales: {
            x: { grid: { display: false } },
            y: { grid: { color: grid }, ticks: { precision: 0 }, beginAtZero: true },
          },
        },
      })
    );
  }

  private throughputSeries(): { labels: string[]; created: number[]; completed: number[] } {
    const days = 14;
    const labels: string[] = [];
    const created = new Array(days).fill(0);
    const completed = new Array(days).fill(0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const idx = (dateStr?: string): number => {
      if (!dateStr) return -1;
      const d = new Date(dateStr);
      d.setHours(0, 0, 0, 0);
      const diff = Math.round((today.getTime() - d.getTime()) / 86_400_000);
      return diff >= 0 && diff < days ? days - 1 - diff : -1;
    };

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      labels.push(d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }));
    }
    for (const t of this.tasks) {
      const ci = idx(t.createdAt);
      if (ci >= 0) created[ci]++;
      if (t.status === 'DONE') {
        const di = idx(t.updatedAt);
        if (di >= 0) completed[di]++;
      }
    }
    return { labels, created, completed };
  }

  private destroyCharts(): void {
    this.charts.forEach((c) => c.destroy());
    this.charts = [];
  }
}
