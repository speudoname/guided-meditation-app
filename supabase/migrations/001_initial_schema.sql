-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE subscription_tier AS ENUM ('free', 'premium');
CREATE TYPE session_state AS ENUM ('started', 'paused', 'resumed', 'abandoned', 'completed');
CREATE TYPE activity_type AS ENUM ('timer', 'guided_meditation', 'course_session', 'breathing');
CREATE TYPE course_scheduling_mode AS ENUM ('linear_daily', 'day_part', 'freeform', 'challenge');
CREATE TYPE transaction_type AS ENUM ('credit', 'debit', 'monthly_allocation', 'purchase', 'refund');

-- User profiles table (extends Supabase auth.users)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier subscription_tier DEFAULT 'free',
  tokens_balance INTEGER DEFAULT 100 CHECK (tokens_balance >= 0),
  practice_plan JSONB DEFAULT '{"type": "daily", "morning_time": "08:00", "evening_time": null}'::jsonb,
  settings JSONB DEFAULT '{}'::jsonb,
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Token transactions table
CREATE TABLE token_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  transaction_type transaction_type NOT NULL,
  description TEXT,
  reference_type TEXT, -- 'meditation_session', 'course_enrollment', etc.
  reference_id UUID, -- ID of the related entity
  balance_after INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Token pricing configuration (admin-configurable)
CREATE TABLE token_pricing (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  activity_type activity_type NOT NULL UNIQUE,
  cost_per_minute INTEGER, -- For time-based activities
  flat_cost INTEGER, -- For fixed-cost activities
  download_cost INTEGER, -- Additional cost for downloads
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sound packs table
CREATE TABLE sound_packs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  is_default BOOLEAN DEFAULT false,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Individual sounds table
CREATE TABLE sounds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pack_id UUID REFERENCES sound_packs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  event_type TEXT, -- 'start', 'interval', 'end'
  duration_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Meditation sessions table (for timer sessions)
CREATE TABLE meditation_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  duration_minutes INTEGER NOT NULL,
  elapsed_minutes INTEGER DEFAULT 0,
  interval_minutes INTEGER,
  state session_state NOT NULL,
  sound_pack_id UUID REFERENCES sound_packs(id),
  settings JSONB DEFAULT '{}'::jsonb,
  started_at TIMESTAMPTZ NOT NULL,
  paused_at TIMESTAMPTZ,
  resumed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  abandoned_at TIMESTAMPTZ,
  tokens_charged INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Teachers table
CREATE TABLE teachers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  bio TEXT,
  specialty TEXT[],
  is_verified BOOLEAN DEFAULT false,
  total_students INTEGER DEFAULT 0,
  rating DECIMAL(3,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Courses table
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  scheduling_mode course_scheduling_mode NOT NULL DEFAULT 'freeform',
  schedule_config JSONB DEFAULT '{}'::jsonb, -- Store challenge days, windows, etc.
  categories TEXT[] NOT NULL,
  tags TEXT[],
  cover_image_url TEXT,
  intro_video_url TEXT,
  total_sessions INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Course sessions (individual meditation tracks within courses)
CREATE TABLE course_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  session_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  audio_url TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  is_locked BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(course_id, session_number)
);

-- Standalone meditations table
CREATE TABLE meditations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  audio_url TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  categories TEXT[],
  tags TEXT[],
  cover_image_url TEXT,
  is_published BOOLEAN DEFAULT false,
  play_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Course enrollments
CREATE TABLE course_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  last_accessed_at TIMESTAMPTZ,
  current_session INTEGER DEFAULT 1,
  completed_sessions INTEGER[] DEFAULT '{}',
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, course_id)
);

-- Session progress tracking (for both course sessions and standalone meditations)
CREATE TABLE session_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  session_type TEXT NOT NULL, -- 'course_session' or 'meditation'
  session_id UUID NOT NULL, -- References either course_sessions.id or meditations.id
  last_position_seconds INTEGER DEFAULT 0,
  total_listened_minutes INTEGER DEFAULT 0,
  state session_state,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  last_played_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  tokens_charged INTEGER DEFAULT 0,
  UNIQUE(user_id, session_type, session_id)
);

-- Breathing exercises presets
CREATE TABLE breathing_presets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  pattern TEXT NOT NULL, -- e.g., "4-7-8" or "box-4"
  inhale_seconds INTEGER NOT NULL,
  hold_inhale_seconds INTEGER,
  exhale_seconds INTEGER NOT NULL,
  hold_exhale_seconds INTEGER,
  purpose TEXT,
  instructions TEXT,
  is_system BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Breathing sessions tracking
CREATE TABLE breathing_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  preset_id UUID REFERENCES breathing_presets(id),
  custom_pattern JSONB, -- For custom patterns
  rounds_target INTEGER,
  rounds_completed INTEGER DEFAULT 0,
  duration_minutes INTEGER,
  state session_state NOT NULL,
  started_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ,
  abandoned_at TIMESTAMPTZ,
  tokens_charged INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User downloads (premium feature)
CREATE TABLE user_downloads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL, -- 'course_session', 'meditation'
  content_id UUID NOT NULL,
  downloaded_at TIMESTAMPTZ DEFAULT NOW(),
  file_size_mb INTEGER,
  tokens_charged INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  UNIQUE(user_id, content_type, content_id)
);

-- Streaks and achievements
CREATE TABLE user_streaks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  grace_days_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- User badges/achievements
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_url TEXT,
  criteria JSONB NOT NULL, -- Defines unlock criteria
  points INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Subscription plans configuration
CREATE TABLE subscription_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tier subscription_tier NOT NULL UNIQUE,
  monthly_tokens INTEGER NOT NULL,
  price_cents INTEGER,
  features JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_url TEXT,
  parent_id UUID REFERENCES categories(id),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin audit log
CREATE TABLE admin_audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES user_profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_subscription_tier ON user_profiles(subscription_tier);
CREATE INDEX idx_token_transactions_user_id ON token_transactions(user_id);
CREATE INDEX idx_token_transactions_created_at ON token_transactions(created_at DESC);
CREATE INDEX idx_meditation_sessions_user_id ON meditation_sessions(user_id);
CREATE INDEX idx_meditation_sessions_state ON meditation_sessions(state);
CREATE INDEX idx_course_enrollments_user_id ON course_enrollments(user_id);
CREATE INDEX idx_course_enrollments_course_id ON course_enrollments(course_id);
CREATE INDEX idx_session_progress_user_id ON session_progress(user_id);
CREATE INDEX idx_session_progress_session ON session_progress(session_type, session_id);
CREATE INDEX idx_user_streaks_user_id ON user_streaks(user_id);
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON teachers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_meditations_updated_at BEFORE UPDATE ON meditations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_token_pricing_updated_at BEFORE UPDATE ON token_pricing
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_subscription_plans_updated_at BEFORE UPDATE ON subscription_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_user_streaks_updated_at BEFORE UPDATE ON user_streaks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Insert default data
INSERT INTO subscription_plans (tier, monthly_tokens, price_cents, features) VALUES
  ('free', 100, 0, '{"download": false, "premium_content": false}'::jsonb),
  ('premium', 500, 999, '{"download": true, "premium_content": true, "priority_support": true}'::jsonb);

INSERT INTO token_pricing (activity_type, cost_per_minute, flat_cost, download_cost, description) VALUES
  ('timer', 1, NULL, NULL, 'Meditation timer sessions cost 1 token per minute'),
  ('guided_meditation', NULL, 3, 5, 'Standalone meditations cost 3 tokens, plus 5 for download'),
  ('course_session', NULL, 2, 5, 'Course sessions cost 2 tokens, plus 5 for download'),
  ('breathing', NULL, 1, NULL, 'Breathing exercises cost 1 token per session');

INSERT INTO breathing_presets (name, pattern, inhale_seconds, hold_inhale_seconds, exhale_seconds, hold_exhale_seconds, purpose, is_system) VALUES
  ('Calming 3-4-3', '3-4-3', 3, 4, 3, NULL, 'Reduces anxiety and promotes calm', true),
  ('Quick Relax 4-4-2', '4-4-2', 4, 4, 2, NULL, 'Quick relaxation technique', true),
  ('Sleep 4-7-8', '4-7-8', 4, 7, 8, NULL, 'Prepares body for sleep', true),
  ('Deep Relax 7-7-8', '7-7-8', 7, 7, 8, NULL, 'Deep relaxation and stress relief', true),
  ('Box Breathing', 'box-4', 4, 4, 4, 4, 'Improves focus and clarity', true);

-- Default categories
INSERT INTO categories (name, slug, description, display_order) VALUES
  ('Meditation', 'meditation', 'Core meditation practices', 1),
  ('Sleep', 'sleep', 'Better sleep and rest', 2),
  ('Anxiety', 'anxiety', 'Manage anxiety and stress', 3),
  ('Focus', 'focus', 'Improve concentration', 4),
  ('Beginner', 'beginner', 'Perfect for beginners', 5);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE meditation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE breathing_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (users can only see/modify their own data)
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own transactions" ON token_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own meditation sessions" ON meditation_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own meditation sessions" ON meditation_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meditation sessions" ON meditation_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- Public read access for courses, meditations, categories
CREATE POLICY "Public can view published courses" ON courses
  FOR SELECT USING (is_published = true);

CREATE POLICY "Public can view published meditations" ON meditations
  FOR SELECT USING (is_published = true);

CREATE POLICY "Public can view categories" ON categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view sound packs" ON sound_packs
  FOR SELECT USING (true);

CREATE POLICY "Public can view breathing presets" ON breathing_presets
  FOR SELECT USING (true);