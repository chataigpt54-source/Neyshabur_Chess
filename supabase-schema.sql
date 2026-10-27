
-- Schema for هیأت شطرنج شهرستان نیشابور
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- News
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Players
CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  photo_url TEXT,
  bio TEXT,
  achievements TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tournaments
CREATE TABLE IF NOT EXISTS tournaments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  status TEXT NOT NULL DEFAULT 'upcoming'
    CHECK (status IN ('upcoming', 'ongoing', 'past')),
  registration_open BOOLEAN DEFAULT true,
  image_url TEXT,
  location TEXT,
  max_participants INTEGER,

  -- Lichess integration
  lichess_tournament_id TEXT UNIQUE,
  lichess_tournament_url TEXT,
  lichess_results JSONB NOT NULL DEFAULT '[]'::jsonb,
  lichess_last_synced_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add Lichess columns to existing installations
ALTER TABLE public.tournaments
  ADD COLUMN IF NOT EXISTS lichess_tournament_id TEXT,
  ADD COLUMN IF NOT EXISTS lichess_tournament_url TEXT,
  ADD COLUMN IF NOT EXISTS lichess_results JSONB
    NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS lichess_last_synced_at TIMESTAMPTZ;

-- Unique index for linked Lichess tournaments
CREATE UNIQUE INDEX IF NOT EXISTS
  idx_tournaments_lichess_id_unique
ON public.tournaments (lichess_tournament_id)
WHERE lichess_tournament_id IS NOT NULL;

-- Registrations
CREATE TABLE IF NOT EXISTS registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID NOT NULL
    REFERENCES tournaments(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  national_id TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gallery
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Static pages (about, contact)
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Settings (logo etc)
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admins
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lichess users
-- Stores the verified Lichess account ID and username.
-- Never store the user's Lichess password here.
CREATE TABLE IF NOT EXISTS public.lichess_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lichess_id TEXT NOT NULL UNIQUE,
  username TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_news_published
  ON news(published, published_at DESC);

CREATE INDEX IF NOT EXISTS idx_news_slug
  ON news(slug);

CREATE INDEX IF NOT EXISTS idx_tournaments_status
  ON tournaments(status, start_date);

CREATE INDEX IF NOT EXISTS idx_registrations_tournament
  ON registrations(tournament_id);

CREATE INDEX IF NOT EXISTS idx_lichess_users_username
  ON public.lichess_users(username);

-- Seed default pages
INSERT INTO pages (slug, title, content) VALUES
  (
    'about',
    'درباره هیأت',
    'هیأت شطرنج شهرستان نیشابور مرجع رسمی اخبار، مسابقات و فعالیت‌های شطرنج شهرستان نیشابور است.

این هیأت با هدف توسعه و ترویج ورزش فکری شطرنج، برگزاری مسابقات منظم (از جمله جام قهرمانان)، آموزش و شناسایی استعدادهای جوان فعالیت می‌کند.

آدرس: خراسان رضوی، نیشابور، خیابان فلسطین، درب ورودی هیأت فوتبال، طبقه دوم'
  ),
  (
    'contact',
    'تماس با ما',
    'راه‌های ارتباط با هیأت شطرنج شهرستان نیشابور

نشانی: خراسان رضوی، نیشابور، خیابان فلسطین، درب ورودی هیأت فوتبال، طبقه دوم

تلفن:
مهدی بوژمهرانی — [شماره تماس موجود در نسخه فعلی]
مسعود مشایخان — [شماره تماس موجود در نسخه فعلی]

ایمیل: chesskhayam@gmail.com'
  )
ON CONFLICT (slug) DO UPDATE
SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  updated_at = NOW();

-- Seed past tournaments (جام قهرمانان ۱ تا ۸)
INSERT INTO tournaments
  (title, description, start_date, status, registration_open, location)
VALUES
  (
    'اولین دوره جام قهرمانان شطرنج نیشابور',
    'اولین دوره جام قهرمانان شطرنج نیشابور

مشاهده نتایج: https://s3.chess-results.com/tnr1233602.aspx?lan=4&art=0&fed=IRI&SNode=S0',
    '2020-01-01', 'past', false, 'نیشابور'
  ),
  (
    'دومین دوره جام قهرمانان شطرنج نیشابور',
    'دومین دوره جام قهرمانان شطرنج نیشابور',
    '2021-01-01', 'past', false, 'نیشابور'
  ),
  (
    'سومین دوره جام قهرمانان شطرنج نیشابور',
    'سومین دوره جام قهرمانان شطرنج نیشابور',
    '2021-06-01', 'past', false, 'نیشابور'
  ),
  (
    'چهارمین دوره جام قهرمانان شطرنج نیشابور',
    'چهارمین دوره جام قهرمانان شطرنج نیشابور',
    '2022-01-01', 'past', false, 'نیشابور'
  ),
  (
    'پنجمین دوره جام قهرمانان شطرنج نیشابور',
    'پنجمین دوره جام قهرمانان شطرنج نیشابور',
    '2022-06-01', 'past', false, 'نیشابور'
  ),
  (
    'ششمین دوره جام قهرمانان شطرنج نیشابور',
    'ششمین دوره جام قهرمانان شطرنج نیشابور',
    '2023-01-01', 'past', false, 'نیشابور'
  ),
  (
    'هفتمین دوره جام قهرمانان شطرنج نیشابور',
    'هفتمین دوره جام قهرمانان شطرنج نیشابور',
    '2023-06-01', 'past', false, 'نیشابور'
  ),
  (
    'هشتمین دوره جام قهرمانان شطرنج نیشابور',
    'هشتمین دوره جام قهرمانان شطرنج نیشابور

مشاهده نتایج: https://s3.chess-results.com/tnr1498847.aspx?lan=1&turdet=YES&SNode=S0',
    '2024-01-01', 'past', false, 'نیشابور'
  )
ON CONFLICT DO NOTHING;

-- Admin seed
-- Intentionally do not insert a default admin password.
-- Create an admin with a valid bcrypt hash using a secure setup process.

-- Storage buckets:
-- Create buckets: images (public), logos (public).
-- Allow public read and restricted write as needed.

-- Enable RLS
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lichess_users ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read news"
  ON news FOR SELECT
  USING (published = true);

CREATE POLICY "Public read players"
  ON players FOR SELECT
  USING (true);

CREATE POLICY "Public read tournaments"
  ON tournaments FOR SELECT
  USING (true);

CREATE POLICY "Public read gallery"
  ON gallery FOR SELECT
  USING (true);

CREATE POLICY "Public read pages"
  ON pages FOR SELECT
  USING (true);

CREATE POLICY "Public insert registrations"
  ON registrations FOR INSERT
  WITH CHECK (true);

-- Existing development policies retained from the original schema.
-- WARNING: These policies allow broad access and are NOT safe for production.
CREATE POLICY "Allow all for news"
  ON news FOR ALL
  USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for players"
  ON players FOR ALL
  USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for tournaments"
  ON tournaments FOR ALL
  USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for registrations"
  ON registrations FOR ALL
  USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for gallery"
  ON gallery FOR ALL
  USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for pages"
  ON pages FOR ALL
  USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for settings"
  ON settings FOR ALL
  USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for admins"
  ON admins FOR ALL
  USING (true) WITH CHECK (true);

-- No public policies for lichess_users.
-- Access this table from trusted server code using the service role.
