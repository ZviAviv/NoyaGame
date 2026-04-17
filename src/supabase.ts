import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://bhqxymxqvobewntbrcnw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJocXh5bXhxdm9iZXdudGJyY253Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NDY3MzIsImV4cCI6MjA5MjAyMjczMn0.MnDRJKTWukJHAfxS8-DDW2Hcm0QhifV9OOw-ruiUomE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
