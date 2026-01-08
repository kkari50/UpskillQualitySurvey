/**
 * Quick DB check - verify same data as Next.js app
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const envFile = readFileSync('.env.local', 'utf-8');
const env: Record<string, string> = {};
envFile.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length) {
    env[key.trim()] = valueParts.join('=').trim();
  }
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const serviceKey = env['SUPABASE_SERVICE_ROLE_KEY'];

console.log('Supabase URL:', supabaseUrl);
console.log('Service key:', serviceKey?.slice(0, 20) + '...');

const supabase = createClient(supabaseUrl, serviceKey);

async function check() {
  // Query survey_stats exactly like results page does
  const { data, error } = await supabase
    .from('survey_stats')
    .select('*')
    .eq('survey_version', '1.0')
    .single();

  console.log('\nsurvey_stats for version 1.0:');
  console.log('Error:', error?.message);
  console.log('Data:', data);
}

check();
