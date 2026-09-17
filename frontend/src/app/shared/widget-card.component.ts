import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { MetricPoint, Widget, formatMetric, metricLabel } from '../models/agency';
import { byChannel, prettyChannel, seriesFor, widgetValue } from '../services/metric-util';

Chart.register(...registerables);

@Component({
  selector: 'app-widget-card',
  templateUrl: './widget-card.component.html',
  styleUrls: ['./widget-card.component.css'],
})
export class WidgetCardComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() widget!: Widget;
  @Input() points: MetricPoint[] = [];
  @Input() accent = '';
  @Input() readonly = false;
  @Output() remove = new EventEmitter<void>();

  @ViewChild('canvas') canvas?: ElementRef<HTMLCanvasElement>;

  metricLabel = metricLabel;
  formatted = '';
  delta = 0;
  hasDelta = false;
  tableRows: { date: string; value: number }[] = [];

  private chart?: Chart;
  private viewReady = false;

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.compute();
  }

  ngOnChanges(): void {
    if (this.viewReady) {
      this.compute();
    }
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  fmt(value: number): string {
    return formatMetric(this.widget?.metricKey, value);
  }

  private accentColor(): string {
    if (this.accent) return this.accent;
    return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#6e8bff';
  }

  private compute(): void {
    if (!this.widget) return;
    const series = seriesFor(this.points, this.widget.metricKey);

    if (this.widget.type === 'KPI') {
      this.formatted = this.fmt(widgetValue(this.widget, this.points));
      // trend: second half vs first half of the window
      if (series.length >= 4) {
        const mid = Math.floor(series.length / 2);
        const first = series.slice(0, mid).reduce((a, p) => a + p.value, 0);
        const second = series.slice(mid).reduce((a, p) => a + p.value, 0);
        this.delta = first ? Math.round(((second - first) / first) * 100) : 0;
        this.hasDelta = true;
      } else {
        this.hasDelta = false;
      }
      return;
    }

    if (this.widget.type === 'TABLE') {
      this.tableRows = [...series].reverse().slice(0, 12);
      return;
    }

    this.renderChart(series);
  }

  private renderChart(series: { date: string; value: number }[]): void {
    if (!this.canvas) return;
    this.chart?.destroy();

    const accent = this.accentColor();
    const grid = getComputedStyle(document.documentElement).getPropertyValue('--border').trim();
    const text = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim();
    Chart.defaults.color = text;
    Chart.defaults.font.family = "'Inter', sans-serif";

    if (this.widget.type === 'DONUT') {
      const groups = byChannel(this.points, this.widget.metricKey);
      const palette = [accent, '#a06bff', '#3fb950', '#f5a623', '#ff5c5c', '#00b8d9'];
      this.chart = new Chart(this.canvas.nativeElement, {
        type: 'doughnut',
        data: {
          labels: groups.map((g) => prettyChannel(g.channel)),
          datasets: [{ data: groups.map((g) => Math.round(g.value)), backgroundColor: palette, borderWidth: 0 }],
        },
        options: { cutout: '65%', plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, padding: 12 } } } },
      });
      return;
    }

    const labels = series.map((p) => p.date.slice(5)); // MM-DD
    const data = series.map((p) => Math.round(p.value * 10) / 10);
    this.chart = new Chart(this.canvas.nativeElement, {
      type: this.widget.type === 'BAR' ? 'bar' : 'line',
      data: {
        labels,
        datasets: [
          {
            data,
            borderColor: accent,
            backgroundColor: this.widget.type === 'BAR' ? accent : 'transparent',
            borderRadius: 5,
            tension: 0.35,
            pointRadius: 0,
            borderWidth: 2,
          },
        ],
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { maxTicksLimit: 8 } },
          y: { grid: { color: grid }, beginAtZero: true, ticks: { maxTicksLimit: 5 } },
        },
      },
    });
  }
}
