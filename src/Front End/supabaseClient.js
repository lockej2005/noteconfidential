// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gnsthkndopmfmgwetzmh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imduc3Roa25kb3BtZm1nd2V0em1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY1NzY3NDEsImV4cCI6MjAyMjE1Mjc0MX0.496hsOcVE3iIlFMyHWJ2Uib31ZkVzTWnWceXH2PoHPM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
