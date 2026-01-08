/**
 * Seed Test Survey Responses via Web UI
 *
 * Uses Playwright to submit 10 test surveys through the browser
 *
 * Run with: npx playwright test scripts/seed-via-ui.ts --headed
 */

import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:3000';

// 10 test profiles with different yes/no patterns
const TEST_PROFILES = [
  { name: 'Strong Agency', pattern: Array(27).fill(true).map((_, i) => i < 25) },         // 25 yes
  { name: 'Good Agency', pattern: Array(27).fill(true).map((_, i) => i < 23) },           // 23 yes
  { name: 'Above Average', pattern: Array(27).fill(true).map((_, i) => i < 21) },         // 21 yes
  { name: 'Moderate High', pattern: Array(27).fill(true).map((_, i) => i < 20) },         // 20 yes
  { name: 'Moderate', pattern: Array(27).fill(true).map((_, i) => i < 18) },              // 18 yes
  { name: 'Moderate Low', pattern: Array(27).fill(true).map((_, i) => i < 17) },          // 17 yes
  { name: 'Improving', pattern: Array(27).fill(true).map((_, i) => i < 15) },             // 15 yes
  { name: 'Developing', pattern: Array(27).fill(true).map((_, i) => i < 13) },            // 13 yes
  { name: 'Early Stage', pattern: Array(27).fill(true).map((_, i) => i < 11) },           // 11 yes
  { name: 'Just Starting', pattern: Array(27).fill(true).map((_, i) => i < 9) },          // 9 yes
];

async function submitSurvey(profileIndex: number) {
  const profile = TEST_PROFILES[profileIndex];
  const email = `seed-test-${profileIndex + 1}@test.example.com`;

  console.log(`\n📝 Submitting survey ${profileIndex + 1}/10: ${profile.name}`);
  console.log(`   Email: ${email}`);
  console.log(`   Expected score: ${profile.pattern.filter(Boolean).length}/27`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Go to survey page
    await page.goto(`${BASE_URL}/survey`);
    await page.waitForLoadState('networkidle');

    // Answer all 27 questions
    for (let q = 0; q < 27; q++) {
      const answer = profile.pattern[q];

      // Click Yes or No button
      const buttonText = answer ? 'Yes' : 'No';
      await page.click(`button:has-text("${buttonText}")`);

      // Wait for next question or completion
      await page.waitForTimeout(300);
    }

    // Should be on complete page - fill email
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });
    await page.fill('input[type="email"]', email);

    // Submit
    await page.click('button[type="submit"]');

    // Wait for redirect to results
    await page.waitForURL(/\/results\//, { timeout: 15000 });

    console.log(`   ✅ Success! Redirected to: ${page.url()}`);

    await browser.close();
    return true;
  } catch (error) {
    console.error(`   ❌ Error:`, error);
    await browser.close();
    return false;
  }
}

async function main() {
  console.log('🌱 Seeding 10 test survey responses via web UI...');
  console.log('   Make sure dev server is running on localhost:3000\n');

  let successCount = 0;

  for (let i = 0; i < TEST_PROFILES.length; i++) {
    const success = await submitSurvey(i);
    if (success) successCount++;

    // Small delay between submissions
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`\n✅ Successfully submitted ${successCount}/${TEST_PROFILES.length} responses`);

  if (successCount >= 10) {
    console.log('📊 Population comparison should now be visible!');
  }
}

main().catch(console.error);
