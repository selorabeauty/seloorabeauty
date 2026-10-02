-- ═══════════════════════════════════════════════════════════════
--  Selora Beauty — Reset all test data
--  ⚠️  RUN ONCE. This deletes ALL orders and ALL tracked events.
--  Run in EasyPanel → database service → Query/Terminal
-- ═══════════════════════════════════════════════════════════════

BEGIN;

DELETE FROM page_views;
DELETE FROM orders;

-- Restart ID sequences so new rows start at 1
ALTER SEQUENCE IF EXISTS page_views_id_seq RESTART WITH 1;

COMMIT;

-- Verify: should return 0 and 0
SELECT (SELECT COUNT(*) FROM orders) AS orders_left,
       (SELECT COUNT(*) FROM page_views) AS events_left;
