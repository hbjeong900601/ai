import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase = null;

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('⚡ Supabase Client initialized successfully.');
  } catch (error) {
    console.error('❌ Failed to initialize Supabase Client:', error);
  }
} else {
  console.warn(
    '⚠️ Supabase environment variables are missing.\n' +
    'The application will run in LocalStorage Fallback mode.\n' +
    'To connect to Supabase, provide VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
  );
}

export { supabase };
