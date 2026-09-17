import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MetricService } from '../services/metric.service';
import { PublicDashboard, Widget } from '../models/agency';

@Component({
  selector: 'app-public-dashboard',
  templateUrl: './public-dashboard.component.html',
  styleUrls: ['./public-dashboard.component.css'],
})
export class PublicDashboardComponent implements OnInit {
  data: PublicDashboard | null = null;
  loading = true;
  notFound = false;

  constructor(private route: ActivatedRoute, private metricService: MetricService) {}

  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('token')!;
    this.metricService.publicDashboard(token).subscribe({
      next: (d) => {
        this.data = d;
        this.loading = false;
      },
      error: () => {
        this.notFound = true;
        this.loading = false;
      },
    });
  }

  widgetClass(w: Widget): string {
    if (w.type === 'KPI') return 'span-1';
    if (w.type === 'TABLE' || w.type === 'DONUT') return 'span-1 tall';
    return 'span-2 tall';
  }

  exportPdf(): void {
    window.print();
  }
}
