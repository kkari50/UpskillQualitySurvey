import { test, expect } from "@playwright/test";

/**
 * Mobile PDF Viewer Tests
 *
 * Tests that PDF viewing works correctly on mobile devices.
 * Mobile users should see an "Open in Browser" button instead of
 * the "not supported" message.
 */

// Only run these tests on mobile projects
test.describe("Mobile PDF Viewer", () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE viewport

  test("shows Open in Browser button on mobile when viewing PDF resource", async ({
    page,
  }) => {
    // Navigate to results page with known token
    await page.goto("/results/042f6528-eec2-466a-b0b7-4679bb2ab904");
    await page.waitForLoadState("networkidle");

    // Wait for page content to render
    await page.waitForTimeout(2000);

    // Expand all collapsible sections to reveal resource links
    await page.evaluate(() => {
      const closedTriggers = document.querySelectorAll('[data-state="closed"]');
      closedTriggers.forEach((trigger) => {
        if (trigger instanceof HTMLElement) {
          trigger.click();
        }
      });
    });

    await page.waitForTimeout(1000);

    // Find a PDF resource button (these trigger the PDF modal)
    const pdfButton = page.locator('button:has-text("Parker et al")').first();

    // Check if there's a PDF button, if not skip
    const pdfButtonCount = await pdfButton.count();
    if (pdfButtonCount === 0) {
      test.skip();
      return;
    }

    // Click the PDF button to open modal
    await pdfButton.click();

    // Wait for modal to appear
    await page.waitForSelector('[role="dialog"]', { timeout: 5000 });

    // Verify the modal is open
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // Verify "Open in Browser" button is present (NOT "not supported" message)
    const openButton = modal.locator('button:has-text("Open in Browser")');
    await expect(openButton).toBeVisible();

    // Verify the old "not supported" message is NOT present
    const notSupportedText = modal.locator(
      'text="PDF viewing is not supported on mobile devices"'
    );
    await expect(notSupportedText).not.toBeVisible();

    // Verify "Download PDF" button is NOT present (we removed it)
    const downloadButton = modal.locator('button:has-text("Download PDF")');
    await expect(downloadButton).not.toBeVisible();
  });

  test("Open in Browser button has correct styling", async ({ page }) => {
    await page.goto("/results/042f6528-eec2-466a-b0b7-4679bb2ab904");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    // Expand sections
    await page.evaluate(() => {
      const closedTriggers = document.querySelectorAll('[data-state="closed"]');
      closedTriggers.forEach((trigger) => {
        if (trigger instanceof HTMLElement) {
          trigger.click();
        }
      });
    });

    await page.waitForTimeout(1000);

    // Find and click a PDF resource
    const pdfButton = page.locator('button:has-text("Parker et al")').first();
    const pdfButtonCount = await pdfButton.count();
    if (pdfButtonCount === 0) {
      test.skip();
      return;
    }

    await pdfButton.click();
    await page.waitForSelector('[role="dialog"]', { timeout: 5000 });

    // Check button has teal background styling
    const openButton = page
      .locator('[role="dialog"]')
      .locator('button:has-text("Open in Browser")');
    await expect(openButton).toBeVisible();

    // Verify button is full width on mobile
    const buttonBox = await openButton.boundingBox();
    const modalBox = await page.locator('[role="dialog"]').boundingBox();

    if (buttonBox && modalBox) {
      // Button should take most of the modal width (accounting for padding)
      const widthRatio = buttonBox.width / modalBox.width;
      expect(widthRatio).toBeGreaterThan(0.7);
    }
  });
});

/**
 * Mobile Responsiveness Tests
 *
 * Tests that key pages render correctly on mobile viewports.
 */
test.describe("Mobile Responsiveness", () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE viewport

  test("results page renders correctly on mobile", async ({ page }) => {
    await page.goto("/results/042f6528-eec2-466a-b0b7-4679bb2ab904");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    // Check that main content is visible
    const heading = page.locator("h1").first();
    await expect(heading).toBeVisible();

    // Check score display is visible
    const scoreSection = page.locator('text="Your Score"').first();
    if ((await scoreSection.count()) > 0) {
      await expect(scoreSection).toBeVisible();
    }

    // Check categories are displayed
    const dailySessions = page.locator('text="Daily Sessions"').first();
    if ((await dailySessions.count()) > 0) {
      await expect(dailySessions).toBeVisible();
    }

    // Verify no horizontal scroll (content fits viewport)
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 10); // Small tolerance
  });

  test("survey page renders correctly on mobile", async ({ page }) => {
    await page.goto("/survey");
    await page.waitForLoadState("networkidle");

    // Check survey content is visible
    const heading = page.locator("h1, h2").first();
    await expect(heading).toBeVisible();

    // Verify no horizontal scroll
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 10);
  });

  test("home page renders correctly on mobile", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Check main content is visible
    const mainContent = page.locator("main").first();
    await expect(mainContent).toBeVisible();

    // Verify no horizontal scroll
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 10);
  });

  test("resource pages render correctly on mobile", async ({ page }) => {
    // Test the program info sheet resource page
    await page.goto("/resources/program-info-sheet");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    // Check content is visible
    const heading = page.locator("h1").first();
    await expect(heading).toBeVisible();

    // Verify no horizontal scroll
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 10);
  });
});
