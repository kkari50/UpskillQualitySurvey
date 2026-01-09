import { test, expect, Page } from '@playwright/test';

// Wait for Next.js hydration to complete
async function waitForHydration(page: Page) {
  // Wait for the page to be interactive
  await page.waitForLoadState('networkidle');
  // Additional wait for React hydration
  await page.waitForFunction(() => {
    // Check that React has attached event handlers by looking for interactive elements
    const buttons = document.querySelectorAll('button');
    return buttons.length > 0;
  }, { timeout: 10000 });
  // Extra wait for state to settle
  await page.waitForTimeout(1000);
}

// Dismiss intro screen if visible
async function dismissIntroIfVisible(page: Page) {
  const beginBtn = page.getByRole('button', { name: 'Begin Assessment' });
  if (await beginBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
    await beginBtn.click();
    await page.waitForTimeout(500);
  }
}

// Helper function to answer a question and navigate
async function answerQuestionAndNext(page: Page, isLast: boolean = false) {
  // Handle category transition if visible
  const continueBtn = page.getByRole('button', { name: 'Continue' });
  if (await continueBtn.isVisible({ timeout: 500 }).catch(() => false)) {
    await continueBtn.click();
    await page.waitForTimeout(300);
  }

  // Wait for Yes button and click it
  const yesBtn = page.getByRole('button', { name: 'Yes' });
  await expect(yesBtn).toBeVisible({ timeout: 5000 });
  await yesBtn.click();
  await page.waitForTimeout(200);

  // Navigate to next question or submit
  if (isLast) {
    const submitBtn = page.getByRole('button', { name: 'Submit' });
    await expect(submitBtn).toBeEnabled({ timeout: 3000 });
    await submitBtn.click();
  } else {
    const nextBtn = page.getByRole('button', { name: 'Next' });
    await expect(nextBtn).toBeEnabled({ timeout: 3000 });
    await nextBtn.click();
    await page.waitForTimeout(200);
  }
}

test.describe('Complete Survey Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('http://localhost:3000');
    await page.evaluate(() => localStorage.clear());
  });

  test('complete 28-question survey and submit', async ({ page }) => {
    test.setTimeout(180000); // 3 minute timeout

    // Go to survey page
    await page.goto('http://localhost:3000/survey');
    await waitForHydration(page);

    // Dismiss intro screen
    await dismissIntroIfVisible(page);

    // Answer all 28 questions
    for (let i = 0; i < 28; i++) {
      await answerQuestionAndNext(page, i === 27);
    }

    // Should be on complete page
    await expect(page.getByText('Survey Complete')).toBeVisible({ timeout: 10000 });

    // Fill all required fields
    await page.getByLabel('Email').fill('e2e-test-flow@test.example.com');
    await page.getByLabel('Name').fill('E2E Test User');
    await page.getByLabel('Your Role').selectOption('bcba');
    await page.getByLabel('Agency Size').selectOption('medium');
    await page.getByLabel('Primary Service Setting').selectOption('clinic');
    await page.getByLabel('State').selectOption('CA');

    // Click submit button
    await page.getByRole('button', { name: 'View My Results' }).click();

    // Should redirect to results page
    await expect(page).toHaveURL(/\/results\/[a-f0-9-]+/, { timeout: 15000 });
  });

  test('verify question count shows 28 in progress', async ({ page, isMobile }) => {
    await page.goto('http://localhost:3000/survey');
    await waitForHydration(page);

    // Dismiss intro screen
    await dismissIntroIfVisible(page);

    // Dismiss initial category transition if shown
    const continueBtn = page.getByRole('button', { name: 'Continue' });
    if (await continueBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await continueBtn.click();
      await page.waitForTimeout(300);
    }

    // Check progress indicator - mobile shows "1/28", desktop shows "1 of 28"
    const progressText = isMobile
      ? page.getByText('1/28')
      : page.getByText('1 of 28');
    await expect(progressText).toBeVisible({ timeout: 5000 });
  });

  test('survey resets after submission - can start fresh', async ({ page, isMobile }) => {
    test.setTimeout(180000); // 3 minute timeout

    // First complete the survey
    await page.goto('http://localhost:3000/survey');
    await waitForHydration(page);

    // Dismiss intro screen
    await dismissIntroIfVisible(page);

    // Answer all 28 questions
    for (let i = 0; i < 28; i++) {
      await answerQuestionAndNext(page, i === 27);
    }

    // Should be on complete page
    await expect(page.getByText('Survey Complete')).toBeVisible({ timeout: 10000 });

    // Fill all required fields and submit
    await page.getByLabel('Email').fill('e2e-reset-test@test.example.com');
    await page.getByLabel('Name').fill('E2E Reset Test');
    await page.getByLabel('Your Role').selectOption('rbt');
    await page.getByLabel('Agency Size').selectOption('solo_small');
    await page.getByLabel('Primary Service Setting').selectOption('in_home');
    await page.getByLabel('State').selectOption('TX');
    await page.getByRole('button', { name: 'View My Results' }).click();

    // Wait for results page
    await expect(page).toHaveURL(/\/results\/[a-f0-9-]+/, { timeout: 15000 });

    // Now go back to survey - should start from question 1 (with intro screen)
    await page.goto('http://localhost:3000/survey');
    await waitForHydration(page);

    // Dismiss intro screen (survey state was reset)
    await dismissIntroIfVisible(page);

    // Dismiss category transition if shown
    const continueBtn = page.getByRole('button', { name: 'Continue' });
    if (await continueBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await continueBtn.click();
      await page.waitForTimeout(300);
    }

    // Should be on question 1, not question 28
    // Check progress indicator - mobile shows "1/28", desktop shows "1 of 28"
    const progressText = isMobile
      ? page.getByText('1/28')
      : page.getByText('1 of 28');
    await expect(progressText).toBeVisible({ timeout: 5000 });
  });
});
