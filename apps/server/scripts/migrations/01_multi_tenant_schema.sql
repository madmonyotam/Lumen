-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY, -- Firebase UID
    email TEXT UNIQUE,
    display_name TEXT,
    photo_url TEXT,
    settings JSONB DEFAULT '{}'::jsonb
);

-- 2. Create Lumens Table
CREATE TABLE IF NOT EXISTS lumens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    state JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_alive BOOLEAN DEFAULT false,
    last_updated BIGINT
);

-- 3. Modify Memories Table
-- It currently has: id (SERIAL), content, timestamp, strength, importance, metadata, embedding, keywords
-- We need to add `user_id` to make RLS easier, rather than joining through `lumens` on every query.
ALTER TABLE memories ADD COLUMN IF NOT EXISTS user_id TEXT REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE memories ADD COLUMN IF NOT EXISTS lumen_id UUID REFERENCES lumens(id) ON DELETE CASCADE;

-- 4. Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE lumens ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
-- Users can only read/write their own user record
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'user_isolation'
    ) THEN
        CREATE POLICY user_isolation ON users
            FOR ALL
            USING (id = current_setting('app.current_user_id', true));
    END IF;
END $$;

-- Users can only read/write their own lumens
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'lumens' AND policyname = 'lumen_isolation'
    ) THEN
        CREATE POLICY lumen_isolation ON lumens
            FOR ALL
            USING (user_id = current_setting('app.current_user_id', true));
    END IF;
END $$;

-- Users can only read/write their own memories
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'memories' AND policyname = 'memory_isolation'
    ) THEN
        CREATE POLICY memory_isolation ON memories
            FOR ALL
            USING (user_id = current_setting('app.current_user_id', true));
    END IF;
END $$;
