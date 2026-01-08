/**
 * Example E2E Test
 *
 * Basic test to verify Playwright is configured correctly.
 * Replace with actual E2E tests for survey flow.
 */

import { test, expect } from '@playwright/test'

test.describe('Quick Quality Assessment', () => {
  test('has title', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Quick Quality Assessment|UpskillABA/)
  })

  test('can navigate to landing page', async ({ page }) => {
    await page.goto('/')
    // Check for common elements that should be on the landing page
    await expect(page.locator('body')).toBeVisible()
  })
})

// Test email patterns for E2E data cleanup
test.describe('Test Data Patterns', () => {
  test.skip('uses test email pattern', async () => {
    // These test patterns are recognized by the API and flagged as test data:
    // - test+anything@playwright.local
    // - *@test.example.com
    // - e2e-*@example.com

    const testEmails = [
      'test+survey1@playwright.local',
      'user@test.example.com',
      'e2e-user1@example.com',
    ]

    // Verify patterns match expected format
    for (const email of testEmails) {
      expect(
        email.includes('@playwright.local') ||
          email.includes('@test.example.com') ||
          email.startsWith('e2e-')
      ).toBe(true)
    }
  })
})
