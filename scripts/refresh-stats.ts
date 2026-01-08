/**
 * Refresh Materialized Views
 *
 * Manually refreshes the population statistics views
 *
 * Run with: npx tsx scripts/refresh-stats.ts
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// Load .env.local manually
const envFile = readFileSync('.env.local', 'utf-8');
const env: Record<string, string> = {};
envFile.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length) {
    env[key.trim()] = valueParts.join('=').trim();
  }
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseServiceKey = env['SUPABASE_SERVICE_ROLE_KEY'];

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function refreshStats() {
  console.log('🔄 Refreshing materialized views via SQL...\n');

  // Use raw SQL to refresh materialized views
  const refreshSQL = `
    REFRESH MATERIALIZED VIEW survey_stats;
    REFRESH MATERIALIZED VIEW question_stats;
    REFRESH MATERIALIZED VIEW category_stats;
    REFRESH MATERIALIZED VIEW score_distribution;
  `;

  // Try using rpc to execute raw SQL
  const { error: refreshError } = await supabase.rpc('exec_sql', { sql: refreshSQL });

  if (refreshError) {
    console.log('  Note: Could not auto-refresh views (requires DB admin)');
    console.log('  Run this SQL in Supabase Dashboard > SQL Editor:');
    console.log('  ---');
    console.log('  REFRESH MATERIALIZED VIEW survey_stats;');
    console.log('  REFRESH MATERIALIZED VIEW category_stats;');
    console.log('  REFRESH MATERIALIZED VIEW score_distribution;');
    console.log('  ---');
  } else {
    console.log('  ✅ All views refreshed');
  }

  // Check current stats
  console.log('\n📊 Current survey_stats:');
  const { data, error } = await supabase
    .from('survey_stats')
    .select('*');

  if (error) {
    console.log(`  Error: ${error.message}`);
  } else if (!data || data.length === 0) {
    console.log('  No data in survey_stats view');
  } else {
    console.log('  ', data);
  }

  // Check response count directly
  console.log('\n📈 Direct response count:');
  const { data: responses, error: respError } = await supabase
    .from('survey_responses')
    .select('id, is_test, total_score, completed_at')
    .order('completed_at', { ascending: false })
    .limit(15);

  if (respError) {
    console.log(`  Error: ${respError.message}`);
  } else {
    const testCount = responses?.filter(r => r.is_test).length ?? 0;
    const realCount = responses?.filter(r => !r.is_test).length ?? 0;
    console.log(`  Recent 15 responses: ${realCount} real, ${testCount} test`);
    console.log('  ', responses);
  }
}

refreshStats().catch(console.error);
