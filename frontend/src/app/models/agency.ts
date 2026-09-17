export type WidgetType = 'KPI' | 'LINE' | 'BAR' | 'DONUT' | 'TABLE';
export type Aggregation = 'SUM' | 'AVG' | 'LAST';

export interface Client {
  id: number;
  name: string;
  industry?: string;
  brandColor?: string;
  logoUrl?: string;
  ingestToken?: string;
  createdAt?: string;
  dashboardCount?: number;
}

export interface ClientPayload {
  name: string;
  industry?: string;
  brandColor?: string;
  logoUrl?: string;
}

export interface Widget {
  id?: number;
  type: WidgetType;
  title: string;
  metricKey?: string;
  aggregation?: Aggregation;
  position?: number;
}

export interface DashboardSummary {
  id: number;
  name: string;
  template?: string;
  shareEnabled: boolean;
  widgetCount: number;
}

export interface Dashboard {
  id: number;
  name: string;
  template?: string;
  shareEnabled: boolean;
  shareToken?: string;
  clientId: number;
  clientName?: string;
  brandColor?: string;
  scheduleFrequency?: string;
  scheduleRecipient?: string;
  widgets: Widget[];
}

export interface MetricPoint {
  metricKey: string;
  channel?: string;
  date: string;
  value: number;
}

export interface PublicDashboard {
  dashboardName: string;
  clientName: string;
  brandColor?: string;
  logoUrl?: string;
  widgets: Widget[];
  metrics: MetricPoint[];
}

export const DASHBOARD_TEMPLATES = [
  { key: 'PAID_ADS', label: 'Paid Ads', icon: 'ads_click' },
  { key: 'SEO', label: 'SEO / Organic', icon: 'travel_explore' },
  { key: 'SOCIAL', label: 'Social', icon: 'thumb_up' },
  { key: 'EMAIL', label: 'Email', icon: 'mail' },
  { key: 'BLANK', label: 'Blank', icon: 'dashboard_customize' },
];

/** Known metric keys → display metadata. Unknown keys fall back to a number format. */
export const METRIC_CATALOG: Record<string, { label: string; unit: 'number' | 'currency' | 'percent' }> = {
  sessions: { label: 'Sessions', unit: 'number' },
  users: { label: 'Users', unit: 'number' },
  conversions: { label: 'Conversions', unit: 'number' },
  spend: { label: 'Ad Spend', unit: 'currency' },
  revenue: { label: 'Revenue', unit: 'currency' },
  clicks: { label: 'Clicks', unit: 'number' },
  impressions: { label: 'Impressions', unit: 'number' },
  ctr: { label: 'CTR', unit: 'percent' },
  roas: { label: 'ROAS', unit: 'number' },
  opens: { label: 'Opens', unit: 'number' },
  sends: { label: 'Sends', unit: 'number' },
};

export const KNOWN_METRIC_KEYS = Object.keys(METRIC_CATALOG);

export function metricLabel(key?: string): string {
  if (!key) return '—';
  return METRIC_CATALOG[key]?.label ?? key;
}

export function formatMetric(key: string | undefined, value: number): string {
  const unit = key ? METRIC_CATALOG[key]?.unit : 'number';
  if (unit === 'currency') {
    return '$' + Math.round(value).toLocaleString();
  }
  if (unit === 'percent') {
    return value.toFixed(1) + '%';
  }
  if (Math.abs(value) >= 1000) {
    return Math.round(value).toLocaleString();
  }
  return (Math.round(value * 10) / 10).toLocaleString();
}
