-- Migration: Online Tournaments System for هیأت شطرنج نیشابور
-- Run in Supabase SQL Editor after existing schema
-- This migration is idempotent where possible

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ═══════════════════════════════════════════════════════════════
-- ONLINE TOURNAMENTS
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS online_tournaments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  format TEXT NOT NULL CHECK (format IN ('swiss', 'arena')),
  status TEXT NOT NULL DEFAULT 'scheduled'
    CHECK (status IN ('scheduled', 'registration', 'running', 'finished', 'cancelled')),
  starts_at TIMESTAMPTZ NOT NULL,
  registration_opens_at TIMESTAMPTZ,
  registration_closes_at TIMESTAMPTZ,
  base_time_seconds INTEGER NOT NULL DEFAULT 600, -- 10 min
  increment_seconds INTEGER NOT NULL DEFAULT 0,
  swiss_rounds INTEGER, -- required for swiss
  arena_duration_minutes INTEGER, -- required for arena
  max_players INTEGER,
  current_round INTEGER DEFAULT 0,
  standings JSONB DEFAULT '[]'::jsonb,
  top_three JSONB DEFAULT '[]'::jsonb,
  finished_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_online_tournaments_status ON online_tournaments(status);
CREATE INDEX IF NOT EXISTS idx_online_tournaments_starts_at ON online_tournaments(starts_at);

-- ═══════════════════════════════════════════════════════════════
-- ONLINE TOURNAMENT PLAYERS (display name + secure session)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS online_tournament_players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID NOT NULL REFERENCES online_tournaments(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  session_token_hash TEXT NOT NULL, -- sha256 of the issued token
  score NUMERIC(6,1) DEFAULT 0,
  buchholz NUMERIC(8,1) DEFAULT 0,
  wins INTEGER DEFAULT 0,
  draws INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  byes INTEGER DEFAULT 0,
  color_balance INTEGER DEFAULT 0, -- +1 white, -1 black cumulative
  is_active BOOLEAN DEFAULT true,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (tournament_id, display_name)
);

CREATE INDEX IF NOT EXISTS idx_otp_tournament ON online_tournament_players(tournament_id);
CREATE INDEX IF NOT EXISTS idx_otp_token ON online_tournament_players(session_token_hash);

-- ═══════════════════════════════════════════════════════════════
-- ROUNDS (Swiss)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS online_tournament_rounds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID NOT NULL REFERENCES online_tournaments(id) ON DELETE CASCADE,
  round_number INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'pairing', 'running', 'finished')),
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (tournament_id, round_number)
);

CREATE INDEX IF NOT EXISTS idx_otr_tournament ON online_tournament_rounds(tournament_id);

-- ═══════════════════════════════════════════════════════════════
-- ONLINE GAMES
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS online_games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID NOT NULL REFERENCES online_tournaments(id) ON DELETE CASCADE,
  round_id UUID REFERENCES online_tournament_rounds(id) ON DELETE SET NULL,
  white_player_id UUID REFERENCES online_tournament_players(id) ON DELETE SET NULL,
  black_player_id UUID REFERENCES online_tournament_players(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'ongoing', 'finished', 'aborted')),
  result TEXT CHECK (result IN ('1-0', '0-1', '1/2-1/2', NULL)),
  fen TEXT NOT NULL DEFAULT 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  pgn TEXT DEFAULT '',
  white_clock_ms BIGINT NOT NULL,
  black_clock_ms BIGINT NOT NULL,
  active_color TEXT CHECK (active_color IN ('white', 'black', NULL)),
  clock_started_at TIMESTAMPTZ,
  increment_seconds INTEGER NOT NULL DEFAULT 0,
  version INTEGER NOT NULL DEFAULT 1, -- optimistic concurrency
  draw_offer_by UUID REFERENCES online_tournament_players(id),
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  end_reason TEXT, -- mate, resign, timeout, draw_agreement, stalemate, abort, etc.
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_og_tournament ON online_games(tournament_id);
CREATE INDEX IF NOT EXISTS idx_og_round ON online_games(round_id);
CREATE INDEX IF NOT EXISTS idx_og_status ON online_games(status);
CREATE INDEX IF NOT EXISTS idx_og_players ON online_games(white_player_id, black_player_id);

-- ═══════════════════════════════════════════════════════════════
-- MOVES (optional detailed history; PGN is primary)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS online_game_moves (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID NOT NULL REFERENCES online_games(id) ON DELETE CASCADE,
  move_number INTEGER NOT NULL,
  color TEXT NOT NULL CHECK (color IN ('white', 'black')),
  san TEXT NOT NULL,
  uci TEXT,
  fen_after TEXT NOT NULL,
  clock_ms_after BIGINT,
  played_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (game_id, move_number, color)
);

CREATE INDEX IF NOT EXISTS idx_ogm_game ON online_game_moves(game_id);

-- ═══════════════════════════════════════════════════════════════
-- RATE LIMITING (simple)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 0,
  window_start TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
-- RLS POLICIES (restrictive; writes only via service role / server)
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE online_tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE online_tournament_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE online_tournament_rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE online_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE online_game_moves ENABLE ROW LEVEL SECURITY;

-- Public read for tournaments list & details (non-sensitive)
CREATE POLICY "Public read online_tournaments"
  ON online_tournaments FOR SELECT
  USING (true);

CREATE POLICY "Public read online_tournament_players"
  ON online_tournament_players FOR SELECT
  USING (true);

CREATE POLICY "Public read online_tournament_rounds"
  ON online_tournament_rounds FOR SELECT
  USING (true);

CREATE POLICY "Public read online_games"
  ON online_games FOR SELECT
  USING (true);

CREATE POLICY "Public read online_game_moves"
  ON online_game_moves FOR SELECT
  USING (true);

-- No public INSERT/UPDATE/DELETE; all mutations go through server with service role

-- ═══════════════════════════════════════════════════════════════
-- HELPER: updated_at trigger
-- ═══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS \[ BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END; \] LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_online_tournaments_updated ON online_tournaments;
CREATE TRIGGER trg_online_tournaments_updated
  BEFORE UPDATE ON online_tournaments
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_online_games_updated ON online_games;
CREATE TRIGGER trg_online_games_updated
  BEFORE UPDATE ON online_games
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE online_tournaments IS 'مسابقات آنلاین هیأت شطرنج نیشابور';
COMMENT ON TABLE online_games IS 'بازی‌های آنلاین با ساعت سرور-محور';
