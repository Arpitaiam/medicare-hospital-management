import { createClient } from '@supabase/supabase-js';
export const supabase = createClient(
  'https://wpxzxsncrstykccuwlda.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndweHp4c25jcnN0eWtjY3V3bGRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1MjA4ODIsImV4cCI6MjA5MzA5Njg4Mn0.gLBwaBDG31GkKjaVFQEeUmsN9DlBw0JT6DEIk1l6XJ8'
);