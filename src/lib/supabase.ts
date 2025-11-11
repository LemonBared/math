import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Topic = {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  search_count: number;
  created_at: string;
  updated_at: string;
};

export type Explanation = {
  id: string;
  topic_id: string;
  simple_summary: string;
  detailed_explanation: string;
  formulas: Array<{ formula: string; description: string }>;
  steps: Array<{ step: number; title: string; description: string }>;
  examples: Array<{ title: string; content: string; solution?: string }>;
  common_mistakes: Array<{ mistake: string; correction: string }>;
  tips_and_tricks: Array<string>;
  practice_ideas: string;
  summary: string;
  created_at: string;
};

export type UserHistory = {
  id: string;
  user_id: string;
  topic_id: string;
  visited_at: string;
};

export type Favorite = {
  id: string;
  user_id: string;
  topic_id: string;
  created_at: string;
};
