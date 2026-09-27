import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Profile {
  id: string;
  full_name: string | null;
  username: string | null;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  role: 'user' | 'admin';
  updated_at: string;
}

export interface AdminUser {
  id: string;
  full_name: string | null;
  email: string;
  role: 'user' | 'admin';
  created_at: string;
  banned_until: string | null;
  banned_reason: string | null;
}
