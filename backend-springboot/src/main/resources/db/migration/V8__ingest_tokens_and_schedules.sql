-- Per-client ingest tokens (token-authenticated push API).
ALTER TABLE client ADD COLUMN ingest_token VARCHAR(64);
UPDATE client SET ingest_token = 'ing_' || replace(gen_random_uuid()::text, '-', '')
WHERE ingest_token IS NULL;
ALTER TABLE client ADD CONSTRAINT uq_client_ingest_token UNIQUE (ingest_token);

-- Scheduled report configuration on dashboards.
ALTER TABLE dashboard ADD COLUMN schedule_frequency VARCHAR(12) NOT NULL DEFAULT 'NONE';
ALTER TABLE dashboard ADD COLUMN schedule_recipient  VARCHAR(150);
ALTER TABLE dashboard ADD COLUMN last_sent_at         DATE;
