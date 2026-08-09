-- Replace the generic placeholder tasks with a realistic operator workload.
-- Dates are relative to CURRENT_DATE so Focus / Analytics stay meaningful over time.

DELETE FROM task
WHERE title IN ('Task 1', 'Task 2', 'Task 3')
  AND user_id = (SELECT id FROM users WHERE username = 'rishabh');

INSERT INTO task (title, description, status, priority, due_date, user_id, created_at, updated_at) VALUES
 ('Rotate production database credentials', 'Quarterly secret rotation for the primary Postgres cluster and app service accounts.', 'TO_DO', 'HIGH', CURRENT_DATE, (SELECT id FROM users WHERE username='rishabh'), now() - interval '1 day', now() - interval '1 day'),
 ('Ship v2 API gateway', 'Cut over to the new gateway with rate limiting, auth, and request tracing.', 'IN_PROGRESS', 'HIGH', CURRENT_DATE + 2, (SELECT id FROM users WHERE username='rishabh'), now() - interval '6 day', now() - interval '1 day'),
 ('Write incident postmortem (API outage)', 'Blameless writeup for the 22-minute 5xx spike; owners and action items.', 'TO_DO', 'HIGH', CURRENT_DATE - 1, (SELECT id FROM users WHERE username='rishabh'), now() - interval '3 day', now() - interval '3 day'),
 ('Review Q3 board deck', 'Tighten the narrative and refresh the metrics slides before Thursday.', 'IN_PROGRESS', 'MEDIUM', CURRENT_DATE + 4, (SELECT id FROM users WHERE username='rishabh'), now() - interval '4 day', now() - interval '2 day'),
 ('Migrate Postgres 15 to 16', 'Blue/green upgrade with logical replication and a tested rollback.', 'DONE', 'MEDIUM', CURRENT_DATE - 4, (SELECT id FROM users WHERE username='rishabh'), now() - interval '12 day', now() - interval '4 day'),
 ('Patch CVE-2026-1180 in auth service', 'Bump the vulnerable dependency and redeploy across all environments.', 'TO_DO', 'HIGH', CURRENT_DATE + 1, (SELECT id FROM users WHERE username='rishabh'), now() - interval '2 day', now() - interval '2 day'),
 ('Onboard new operator (Ana)', 'Access provisioning, runbook walkthrough, and first on-call shadow.', 'TO_DO', 'LOW', CURRENT_DATE + 3, (SELECT id FROM users WHERE username='rishabh'), now() - interval '2 day', now() - interval '2 day'),
 ('Tune alerting thresholds', 'Reduce pager noise: recalibrate latency and error-rate alerts.', 'IN_PROGRESS', 'MEDIUM', CURRENT_DATE + 5, (SELECT id FROM users WHERE username='rishabh'), now() - interval '5 day', now() - interval '1 day'),
 ('Publish public status page', 'Wire uptime checks and incident feed to a customer-facing status page.', 'TO_DO', 'MEDIUM', CURRENT_DATE + 7, (SELECT id FROM users WHERE username='rishabh'), now() - interval '1 day', now() - interval '1 day'),
 ('Renew TLS certificates', 'Auto-renew failed for two edge domains; renew and fix the cron.', 'TO_DO', 'HIGH', CURRENT_DATE - 2, (SELECT id FROM users WHERE username='rishabh'), now() - interval '3 day', now() - interval '3 day'),
 ('Draft investor update', 'Monthly note: growth, runway, hiring, and the one big risk.', 'IN_PROGRESS', 'MEDIUM', CURRENT_DATE + 6, (SELECT id FROM users WHERE username='rishabh'), now() - interval '3 day', now() - interval '1 day'),
 ('Archive stale tasks', 'Sweep everything untouched for 60+ days into the archive.', 'DONE', 'LOW', CURRENT_DATE - 6, (SELECT id FROM users WHERE username='rishabh'), now() - interval '9 day', now() - interval '5 day'),
 ('Design HELM analytics v2', 'Cohort retention and throughput-by-tag; sketch the data model.', 'TO_DO', 'LOW', CURRENT_DATE + 14, (SELECT id FROM users WHERE username='rishabh'), now() - interval '1 day', now() - interval '1 day'),
 ('Fix flaky e2e tests', 'Three login specs fail intermittently in CI; stabilize the waits.', 'IN_PROGRESS', 'MEDIUM', CURRENT_DATE + 2, (SELECT id FROM users WHERE username='rishabh'), now() - interval '4 day', now() - interval '1 day'),
 ('Negotiate cloud contract renewal', 'Push for committed-use discount ahead of the annual renewal.', 'TO_DO', 'MEDIUM', CURRENT_DATE + 10, (SELECT id FROM users WHERE username='rishabh'), now() - interval '2 day', now() - interval '2 day'),
 ('Ship dark-mode polish', 'Fix contrast on chips and elevated surfaces in the light theme.', 'DONE', 'LOW', CURRENT_DATE - 3, (SELECT id FROM users WHERE username='rishabh'), now() - interval '7 day', now() - interval '3 day'),
 ('Set up on-call rotation', 'Define the schedule, escalation policy, and handoff checklist.', 'TO_DO', 'MEDIUM', CURRENT_DATE + 8, (SELECT id FROM users WHERE username='rishabh'), now() - interval '1 day', now() - interval '1 day'),
 ('Run backup & restore drill', 'Prove RPO/RTO by restoring last night''s snapshot into staging.', 'TO_DO', 'HIGH', CURRENT_DATE + 1, (SELECT id FROM users WHERE username='rishabh'), now() - interval '2 day', now() - interval '2 day');

-- Tags
INSERT INTO task_tags (task_id, tag)
SELECT t.id, v.tag
FROM task t
JOIN (VALUES
  ('Rotate production database credentials', 'security'),
  ('Rotate production database credentials', 'ops'),
  ('Ship v2 API gateway', 'backend'),
  ('Ship v2 API gateway', 'release'),
  ('Write incident postmortem (API outage)', 'ops'),
  ('Write incident postmortem (API outage)', 'writing'),
  ('Review Q3 board deck', 'exec'),
  ('Migrate Postgres 15 to 16', 'infra'),
  ('Migrate Postgres 15 to 16', 'database'),
  ('Patch CVE-2026-1180 in auth service', 'security'),
  ('Onboard new operator (Ana)', 'people'),
  ('Tune alerting thresholds', 'observability'),
  ('Publish public status page', 'product'),
  ('Renew TLS certificates', 'security'),
  ('Renew TLS certificates', 'infra'),
  ('Draft investor update', 'exec'),
  ('Draft investor update', 'writing'),
  ('Design HELM analytics v2', 'product'),
  ('Design HELM analytics v2', 'design'),
  ('Fix flaky e2e tests', 'qa'),
  ('Negotiate cloud contract renewal', 'finance'),
  ('Ship dark-mode polish', 'frontend'),
  ('Set up on-call rotation', 'ops'),
  ('Run backup & restore drill', 'infra')
) AS v(title, tag) ON t.title = v.title
WHERE t.user_id = (SELECT id FROM users WHERE username = 'rishabh');

-- Subtasks (contiguous positions per task)
INSERT INTO task_subtasks (task_id, position, title, done)
SELECT t.id, v.position, v.subtitle, v.done
FROM task t
JOIN (VALUES
  ('Ship v2 API gateway', 0, 'Finalize OpenAPI schema', true),
  ('Ship v2 API gateway', 1, 'Implement rate limiting', true),
  ('Ship v2 API gateway', 2, 'Wire request tracing', false),
  ('Ship v2 API gateway', 3, 'Run load tests', false),
  ('Ship v2 API gateway', 4, 'Cut the release', false),
  ('Migrate Postgres 15 to 16', 0, 'Provision v16 replica', true),
  ('Migrate Postgres 15 to 16', 1, 'Verify logical replication', true),
  ('Migrate Postgres 15 to 16', 2, 'Cut over and monitor', true),
  ('Draft investor update', 0, 'Pull latest metrics', true),
  ('Draft investor update', 1, 'Write the narrative', false),
  ('Draft investor update', 2, 'Circulate for review', false),
  ('Run backup & restore drill', 0, 'Restore snapshot to staging', false),
  ('Run backup & restore drill', 1, 'Validate data integrity', false),
  ('Run backup & restore drill', 2, 'Record RPO/RTO', false)
) AS v(title, position, subtitle, done) ON t.title = v.title
WHERE t.user_id = (SELECT id FROM users WHERE username = 'rishabh');
