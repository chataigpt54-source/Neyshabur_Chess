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
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'past')),
  registration_open BOOLEAN DEFAULT true,
  image_url TEXT,
  location TEXT,
  max_participants INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Registrations
CREATE TABLE IF NOT EXISTS registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  national_id TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_news_published ON news(published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_slug ON news(slug);
CREATE INDEX IF NOT EXISTS idx_tournaments_status ON tournaments(status, start_date);
CREATE INDEX IF NOT EXISTS idx_registrations_tournament ON registrations(tournament_id);

-- Seed default pages
INSERT INTO pages (slug, title, content) VALUES
  ('about', 'درباره هیأت', 'هیأت شطرنج شهرستان نیشابور مرجع رسمی اخبار، مسابقات و فعالیت‌های شطرنج شهرستان نیشابور است.

این هیأت با هدف توسعه و ترویج ورزش فکری شطرنج، برگزاری مسابقات منظم (از جمله جام قهرمانان)، آموزش و شناسایی استعدادهای جوان فعالیت می‌کند.

آدرس: خراسان رضوی، نیشابور، خیابان فلسطین، درب ورودی هیأت فوتبال، طبقه دوم'),
  ('contact', 'تماس با ما', 'راه‌های ارتباط با هیأت شطرنج شهرستان نیشابور

نشانی: خراسان رضوی، نیشابور، خیابان فلسطین، درب ورودی هیأت فوتبال، طبقه دوم

تلفن:
مهدی بوژمهرانی — ۰۹۱۵۳۵۲۸۱۷۷
مسعود مشایخان — ۰۹۱۵۵۵۱۶۱۶۷

ایمیل: chesskhayam@gmail.com')
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, content = EXCLUDED.content, updated_at = NOW();

-- Seed past tournaments (جام قهرمانان ۱ تا ۸)
INSERT INTO tournaments (title, description, start_date, status, registration_open, location) VALUES
  ('اولین دوره جام قهرمانان شطرنج نیشابور', 'اولین دوره جام قهرمانان شطرنج نیشابور

مشاهده نتایج: https://s3.chess-results.com/tnr1233602.aspx?lan=4&art=0&fed=IRI&SNode=S0', '2020-01-01', 'past', false, 'نیشابور'),
  ('دومین دوره جام قهرمانان شطرنج نیشابور', 'دومین دوره جام قهرمانان شطرنج نیشابور', '2021-01-01', 'past', false, 'نیشابور'),
  ('سومین دوره جام قهرمانان شطرنج نیشابور', 'سومین دوره جام قهرمانان شطرنج نیشابور', '2021-06-01', 'past', false, 'نیشابور'),
  ('چهارمین دوره جام قهرمانان شطرنج نیشابور', 'چهارمین دوره جام قهرمانان شطرنج نیشابور', '2022-01-01', 'past', false, 'نیشابور'),
  ('پنجمین دوره جام قهرمانان شطرنج نیشابور', 'پنجمین دوره جام قهرمانان شطرنج نیشابور', '2022-06-01', 'past', false, 'نیشابور'),
  ('ششمین دوره جام قهرمانان شطرنج نیشابور', 'ششمین دوره جام قهرمانان شطرنج نیشابور', '2023-01-01', 'past', false, 'نیشابور'),
  ('هفتمین دوره جام قهرمانان شطرنج نیشابور', 'هفتمین دوره جام قهرمانان شطرنج نیشابور', '2023-06-01', 'past', false, 'نیشابور'),
  ('هشتمین دوره جام قهرمانان شطرنج نیشابور', 'هشتمین دوره جام قهرمانان شطرنج نیشابور

مشاهده نتایج: https://s3.chess-results.com/tnr1498847.aspx?lan=1&turdet=YES&SNode=S0', '2024-01-01', 'past', false, 'نیشابور')
ON CONFLICT DO NOTHING;

-- Seed admin (password: Mazda2933)
-- Hash generated with bcrypt for "Mazda2933"
INSERT INTO admins (username, password_hash) VALUES
  ('Admin', '$2a$10$8K1p/a0dL1LXMIgoEDFrwOfMQbPvJqKzqKzqKzqKzqKzqKzqKzqKzq')
ON CONFLICT (username) DO NOTHING;

-- Note: Replace the hash above with a real bcrypt hash.
-- You can generate it with: node -e "console.log(require('bcryptjs').hashSync('Mazda2933', 10))"

-- Storage buckets (run in Supabase dashboard or via API)
-- CREATE buckets: images (public), logos (public)
-- Allow public read, authenticated write if needed.

-- RLS: For simplicity in this empty CMS, you may disable RLS or set permissive policies.
-- Example permissive policies (development only):
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Public read for content
CREATE POLICY "Public read news" ON news FOR SELECT USING (published = true);
CREATE POLICY "Public read players" ON players FOR SELECT USING (true);
CREATE POLICY "Public read tournaments" ON tournaments FOR SELECT USING (true);
CREATE POLICY "Public read gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Public read pages" ON pages FOR SELECT USING (true);
CREATE POLICY "Public insert registrations" ON registrations FOR INSERT WITH CHECK (true);

-- Full access for service/anon during development (adjust for production!)
CREATE POLICY "Allow all for news" ON news FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for players" ON players FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for tournaments" ON tournaments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for registrations" ON registrations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for gallery" ON gallery FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for pages" ON pages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for settings" ON settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for admins" ON admins FOR ALL USING (true) WITH CHECK (true);
