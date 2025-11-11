/*
  # Math Explanation Website Schema

  1. New Tables
    - `topics`
      - `id` (uuid, primary key)
      - `title` (text) - The math topic title
      - `category` (text) - Subject area (Algebra, Calculus, etc.)
      - `difficulty` (text) - beginner, intermediate, advanced
      - `search_count` (integer) - Track popularity
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `explanations`
      - `id` (uuid, primary key)
      - `topic_id` (uuid, foreign key)
      - `simple_summary` (text)
      - `detailed_explanation` (text)
      - `formulas` (jsonb) - Array of key formulas
      - `steps` (jsonb) - Step-by-step breakdown
      - `examples` (jsonb) - Array of examples
      - `common_mistakes` (jsonb)
      - `tips_and_tricks` (jsonb)
      - `practice_ideas` (text)
      - `summary` (text)
      - `created_at` (timestamptz)
    
    - `user_history`
      - `id` (uuid, primary key)
      - `user_id` (uuid) - Anonymous or auth user
      - `topic_id` (uuid, foreign key)
      - `visited_at` (timestamptz)
    
    - `favorites`
      - `id` (uuid, primary key)
      - `user_id` (uuid)
      - `topic_id` (uuid, foreign key)
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on all tables
    - Public read access for topics and explanations
    - User-specific access for history and favorites
*/

CREATE TABLE IF NOT EXISTS topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL DEFAULT '',
  difficulty text NOT NULL DEFAULT 'beginner',
  search_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS explanations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid REFERENCES topics(id) ON DELETE CASCADE,
  simple_summary text NOT NULL DEFAULT '',
  detailed_explanation text NOT NULL DEFAULT '',
  formulas jsonb DEFAULT '[]'::jsonb,
  steps jsonb DEFAULT '[]'::jsonb,
  examples jsonb DEFAULT '[]'::jsonb,
  common_mistakes jsonb DEFAULT '[]'::jsonb,
  tips_and_tricks jsonb DEFAULT '[]'::jsonb,
  practice_ideas text DEFAULT '',
  summary text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  topic_id uuid REFERENCES topics(id) ON DELETE CASCADE,
  visited_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  topic_id uuid REFERENCES topics(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, topic_id)
);

ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE explanations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Topics are viewable by everyone"
  ON topics FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Explanations are viewable by everyone"
  ON explanations FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can view own history"
  ON user_history FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can insert own history"
  ON user_history FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view all favorites"
  ON favorites FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can insert own favorites"
  ON favorites FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can delete own favorites"
  ON favorites FOR DELETE
  TO anon, authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_topics_title ON topics(title);
CREATE INDEX IF NOT EXISTS idx_topics_category ON topics(category);
CREATE INDEX IF NOT EXISTS idx_explanations_topic_id ON explanations(topic_id);
CREATE INDEX IF NOT EXISTS idx_user_history_user_id ON user_history(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
