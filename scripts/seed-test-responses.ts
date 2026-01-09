/**
 * Seed Test Survey Responses
 *
 * Creates 10 test survey responses with varied answers
 * to populate the population comparison feature.
 *
 * Run with: npx tsx scripts/seed-test-responses.ts
 */

const BASE_URL = 'http://localhost:3000';

const QUESTION_IDS = [
  // Daily Sessions (7)
  'ds_001', 'ds_002', 'ds_003', 'ds_004', 'ds_005', 'ds_006', 'ds_007',
  // Treatment Fidelity (5)
  'tf_001', 'tf_002', 'tf_003', 'tf_004', 'tf_005',
  // Data Analysis (6)
  'da_001', 'da_002', 'da_003', 'da_004', 'da_005', 'da_006',
  // Caregiver Guidance (6)
  'cg_001', 'cg_002', 'cg_003', 'cg_004', 'cg_005', 'cg_006',
  // Supervision (4)
  'sup_001', 'sup_002', 'sup_003', 'sup_004',
];

// Test response profiles with different score distributions
const TEST_PROFILES = [
  { name: 'Strong Agency', yesRate: 0.93 },      // ~26/28 = 93%
  { name: 'Good Agency', yesRate: 0.86 },        // ~24/28 = 86%
  { name: 'Above Average', yesRate: 0.79 },      // ~22/28 = 79%
  { name: 'Moderate High', yesRate: 0.75 },      // ~21/28 = 75%
  { name: 'Moderate', yesRate: 0.68 },           // ~19/28 = 68%
  { name: 'Moderate Low', yesRate: 0.64 },       // ~18/28 = 64%
  { name: 'Improving', yesRate: 0.57 },          // ~16/28 = 57%
  { name: 'Developing', yesRate: 0.50 },         // ~14/28 = 50%
  { name: 'Early Stage', yesRate: 0.43 },        // ~12/28 = 43%
  { name: 'Just Starting', yesRate: 0.36 },      // ~10/28 = 36%
];

function generateAnswers(yesRate: number): Record<string, boolean> {
  const answers: Record<string, boolean> = {};

  // Use seeded randomness based on yes rate to get consistent but varied answers
  for (let i = 0; i < QUESTION_IDS.length; i++) {
    // Use a deterministic pattern with some variation
    const threshold = yesRate + (Math.sin(i * 1.5) * 0.1);
    const random = (i * 0.037) % 1; // Pseudo-random based on index
    answers[QUESTION_IDS[i]] = random < threshold;
  }

  return answers;
}

async function submitTestResponse(profile: typeof TEST_PROFILES[0], index: number) {
  // Use non-test email domain so data isn't filtered from population stats
  const email = `seed-agency-${index + 1}@seeddata.com`;
  const answers = generateAnswers(profile.yesRate);
  const yesCount = Object.values(answers).filter(Boolean).length;

  console.log(`Submitting ${profile.name} (${yesCount}/28 = ${Math.round(yesCount/28*100)}%): ${email}`);

  try {
    const response = await fetch(`${BASE_URL}/api/survey/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        name: `Test User ${index + 1}`,
        answers,
        surveyVersion: '1.0',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`  Error: ${data.error?.message || data.error || 'Unknown error'}`);
      return false;
    }

    console.log(`  Success! Token: ${data.data?.resultsToken?.slice(0, 8)}...`);
    return true;
  } catch (error) {
    console.error(`  Network error:`, error);
    return false;
  }
}

async function main() {
  console.log('🌱 Seeding 10 test survey responses...\n');

  let successCount = 0;

  for (let i = 0; i < TEST_PROFILES.length; i++) {
    const success = await submitTestResponse(TEST_PROFILES[i], i);
    if (success) successCount++;

    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\n✅ Successfully seeded ${successCount}/${TEST_PROFILES.length} responses`);

  if (successCount >= 10) {
    console.log('📊 Population comparison should now be visible!');
  } else {
    console.log('⚠️  Not enough responses for population comparison (need 10)');
  }
}

main().catch(console.error);
