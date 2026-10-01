-- ═══════════════════════════════════════════════════════════════
--  Selora Beauty — Admin Dashboard Migration
--  Run once in your PostgreSQL database
-- ═══════════════════════════════════════════════════════════════

-- 1. Page-view / click tracking table
CREATE TABLE IF NOT EXISTS page_views (
    id          BIGSERIAL PRIMARY KEY,
    session_id  VARCHAR(64),
    event       VARCHAR(50)  NOT NULL DEFAULT 'pageview',  -- 'pageview' | 'add_to_cart' | 'checkout_start' | 'click'
    page_url    TEXT,
    referrer    TEXT,
    ip_address  VARCHAR(45),
    country     VARCHAR(10),
    is_ksa      BOOLEAN      DEFAULT FALSE,
    is_vpn      BOOLEAN      DEFAULT FALSE,
    user_agent  TEXT,
    created_at  TIMESTAMP    DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pv_created    ON page_views (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pv_event      ON page_views (event);
CREATE INDEX IF NOT EXISTS idx_pv_is_ksa     ON page_views (is_ksa);
CREATE INDEX IF NOT EXISTS idx_pv_session    ON page_views (session_id);

-- 2. Add missing columns to orders if they don't exist yet
ALTER TABLE orders ADD COLUMN IF NOT EXISTS city       VARCHAR(200);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS district   VARCHAR(200);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS address    TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'cod';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS items      JSON;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS notes      TEXT;

-- Done
