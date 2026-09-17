import { Aggregation, MetricPoint, Widget } from '../models/agency';

export interface SeriesPoint {
  date: string;
  value: number;
}

/** Sum a metric's points per day into an ascending series. */
export function seriesFor(points: MetricPoint[], metricKey?: string): SeriesPoint[] {
  if (!metricKey) return [];
  const byDate = new Map<string, number>();
  for (const p of points) {
    if (p.metricKey !== metricKey) continue;
    byDate.set(p.date, (byDate.get(p.date) ?? 0) + p.value);
  }
  return [...byDate.entries()]
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function aggregate(series: SeriesPoint[], agg: Aggregation = 'SUM'): number {
  if (!series.length) return 0;
  if (agg === 'LAST') return series[series.length - 1].value;
  const sum = series.reduce((acc, p) => acc + p.value, 0);
  return agg === 'AVG' ? sum / series.length : sum;
}

/** Group a metric's points by channel (for donut/breakdown widgets). */
export function byChannel(points: MetricPoint[], metricKey?: string): { channel: string; value: number }[] {
  if (!metricKey) return [];
  const map = new Map<string, number>();
  for (const p of points) {
    if (p.metricKey !== metricKey) continue;
    const ch = p.channel || 'other';
    map.set(ch, (map.get(ch) ?? 0) + p.value);
  }
  return [...map.entries()].map(([channel, value]) => ({ channel, value })).sort((a, b) => b.value - a.value);
}

export function widgetValue(widget: Widget, points: MetricPoint[]): number {
  return aggregate(seriesFor(points, widget.metricKey), widget.aggregation ?? 'SUM');
}

export function prettyChannel(ch: string): string {
  return ch.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
