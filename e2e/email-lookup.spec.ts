import { test, expect } from '@playwright/test';

test.describe('Email Lookup for Results', () => {
  test('should display the email lookup form on results page', async ({ page }) => {
    await page.goto('/results');

    // Check form is visible
    await expect(page.getByText('View Your Results')).toBeVisible();
    await expect(page.getByPlaceholder('your@email.com')).toBeVisible();
    await expect(page.getByRole('button', { name: /Send Link/i })).toBeVisible();
  });

  test('should show success message after submitting email', async ({ page }) => {
    await page.goto('/results');

    // Fill in email
    const emailInput = page.getByPlaceholder('your@email.com');
    await emailInput.fill('test@example.com');

    // Submit form
    const submitButton = page.getByRole('button', { name: /Send Link/i });
    await submitButton.click();

    // Wait for success message
    await expect(page.getByText(/Check Your Inbox/i)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/we've sent a link to access your results/i)).toBeVisible();
  });

  test('should disable button while submitting', async ({ page }) => {
    await page.goto('/results');

    const emailInput = page.getByPlaceholder('your@email.com');
    await emailInput.fill('test@example.com');

    const submitButton = page.getByRole('button', { name: /Send Link/i });
    await submitButton.click();

    // Button should show loading state
    await expect(page.getByText(/Sending.../i)).toBeVisible();
  });

  test('should not submit with empty email', async ({ page }) => {
    await page.goto('/results');

    const submitButton = page.getByRole('button', { name: /Send Link/i });

    // Button should be disabled when email is empty
    await expect(submitButton).toBeDisabled();
  });

  test('API should return success for POST request', async ({ request }) => {
    const response = await request.post('/api/results/lookup', {
      data: { email: 'test@example.com' },
    });

    expect(response.ok()).toBeTruthy();

    const json = await response.json();
    expect(json.success).toBe(true);
    expect(json.message).toContain('survey');
  });

  test('API should return error for invalid email', async ({ request }) => {
    const response = await request.post('/api/results/lookup', {
      data: { email: 'invalid-email' },
    });

    expect(response.status()).toBe(400);

    const json = await response.json();
    expect(json.success).toBe(false);
  });

  test('API GET should work with query parameter', async ({ request }) => {
    const response = await request.get('/api/results/lookup?email=test@example.com');

    expect(response.ok()).toBeTruthy();

    const json = await response.json();
    // Will return found: false for non-existent email, but should not error
    expect(json).toHaveProperty('found');
  });

  test('should allow trying a different email after submission', async ({ page }) => {
    await page.goto('/results');

    // Submit first email
    await page.getByPlaceholder('your@email.com').fill('first@example.com');
    await page.getByRole('button', { name: /Send Link/i }).click();

    // Wait for success message
    await expect(page.getByText(/Check Your Inbox/i)).toBeVisible({ timeout: 10000 });

    // Click "Try a different email" button
    await page.getByRole('button', { name: /Try a different email/i }).click();

    // Form should be visible again with empty input
    await expect(page.getByPlaceholder('your@email.com')).toBeVisible();
    await expect(page.getByPlaceholder('your@email.com')).toHaveValue('');

    // Should be able to submit another email
    await page.getByPlaceholder('your@email.com').fill('second@example.com');
    await page.getByRole('button', { name: /Send Link/i }).click();

    // Should show success again
    await expect(page.getByText(/Check Your Inbox/i)).toBeVisible({ timeout: 10000 });
  });
});
