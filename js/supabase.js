
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://egxnmvttcrfaroenelrr.supabase.co'; 
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_ttT5jSJ5931-LS94oBifgQ_SIERaSvp';

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

