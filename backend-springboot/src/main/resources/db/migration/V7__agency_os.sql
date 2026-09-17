-- ============================================================
-- Agency OS: clients, dashboards, widgets, and a metric store
-- ============================================================

CREATE TABLE client (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(120) NOT NULL,
    industry    VARCHAR(80),
    brand_color VARCHAR(16),
    logo_url    VARCHAR(500),
    created_at  TIMESTAMP    NOT NULL DEFAULT now(),
    owner_id    BIGINT       NOT NULL REFERENCES users (id) ON DELETE CASCADE
);
CREATE INDEX idx_client_owner ON client (owner_id);

CREATE TABLE dashboard (
    id            BIGSERIAL PRIMARY KEY,
    name          VARCHAR(120) NOT NULL,
    template      VARCHAR(30),
    share_token   VARCHAR(64) UNIQUE,
    share_enabled BOOLEAN      NOT NULL DEFAULT false,
    created_at    TIMESTAMP    NOT NULL DEFAULT now(),
    client_id     BIGINT       NOT NULL REFERENCES client (id) ON DELETE CASCADE
);
CREATE INDEX idx_dashboard_client ON dashboard (client_id);

CREATE TABLE widget (
    id           BIGSERIAL PRIMARY KEY,
    type         VARCHAR(20)  NOT NULL,
    title        VARCHAR(120) NOT NULL,
    metric_key   VARCHAR(60),
    aggregation  VARCHAR(10),
    position     INT          NOT NULL,
    dashboard_id BIGINT       NOT NULL REFERENCES dashboard (id) ON DELETE CASCADE
);
CREATE INDEX idx_widget_dashboard ON widget (dashboard_id);

CREATE TABLE metric_point (
    id         BIGSERIAL PRIMARY KEY,
    metric_key VARCHAR(60)      NOT NULL,
    channel    VARCHAR(40),
    date       DATE             NOT NULL,
    value      DOUBLE PRECISION NOT NULL,
    client_id  BIGINT           NOT NULL REFERENCES client (id) ON DELETE CASCADE
);
CREATE INDEX idx_metric_client_key_date ON metric_point (client_id, metric_key, date);

-- ============================================================
-- Demo client + dashboard for the seed agency user (rishabh)
-- ============================================================
INSERT INTO client (name, industry, brand_color, owner_id)
VALUES ('Acme Coffee Co.', 'E-commerce · Retail', '#e0803a',
        (SELECT id FROM users WHERE username = 'rishabh'));

INSERT INTO dashboard (name, template, share_token, share_enabled, client_id)
VALUES ('Marketing Overview', 'PAID_ADS', 'shr_demo_acme_0001', true,
        (SELECT id FROM client WHERE name = 'Acme Coffee Co.'));

INSERT INTO widget (type, title, metric_key, aggregation, position, dashboard_id)
SELECT t.type, t.title, t.metric_key, t.aggregation, t.position, d.id
FROM dashboard d
JOIN (VALUES
    ('KPI',   'Sessions',      'sessions',    'SUM', 0),
    ('KPI',   'Conversions',   'conversions', 'SUM', 1),
    ('KPI',   'Ad Spend',      'spend',       'SUM', 2),
    ('KPI',   'Revenue',       'revenue',     'SUM', 3),
    ('LINE',  'Sessions trend','sessions',    'SUM', 4),
    ('LINE',  'Revenue trend', 'revenue',     'SUM', 5),
    ('BAR',   'Conversions by day', 'conversions', 'SUM', 6),
    ('DONUT', 'Spend by channel',   'spend',       'SUM', 7),
    ('TABLE', 'Daily sessions',     'sessions',    'SUM', 8)
) AS t(type, title, metric_key, aggregation, position) ON d.name = 'Marketing Overview'
WHERE d.client_id = (SELECT id FROM client WHERE name = 'Acme Coffee Co.');

-- 30 days of realistic-ish metric points (trend + noise), relative to today.
-- Single-channel series.
INSERT INTO metric_point (metric_key, channel, date, value, client_id)
SELECT s.k, s.ch, g::date,
       s.base + (extract(doy FROM g)::int % 7) * s.trend + (random() * s.noise),
       (SELECT id FROM client WHERE name = 'Acme Coffee Co.')
FROM generate_series(CURRENT_DATE - 29, CURRENT_DATE, interval '1 day') g
CROSS JOIN (VALUES
    ('sessions',    'seo',        420.0, 12.0, 160.0),
    ('conversions', 'seo',         14.0,  0.8,  10.0),
    ('revenue',     'google_ads', 900.0, 30.0, 500.0),
    ('clicks',      'google_ads', 240.0,  6.0, 120.0),
    ('impressions', 'google_ads',9000.0,120.0,4000.0)
) AS s(k, ch, base, trend, noise);

-- Spend split across three channels so the donut has slices.
INSERT INTO metric_point (metric_key, channel, date, value, client_id)
SELECT 'spend', s.ch, g::date, s.base + (random() * s.noise),
       (SELECT id FROM client WHERE name = 'Acme Coffee Co.')
FROM generate_series(CURRENT_DATE - 29, CURRENT_DATE, interval '1 day') g
CROSS JOIN (VALUES
    ('google_ads', 120.0, 60.0),
    ('meta_ads',    80.0, 50.0),
    ('linkedin_ads',40.0, 30.0)
) AS s(ch, base, noise);
