import { test, expect } from '@playwright/test';

test('all resource links on results page are accessible', async ({ page }) => {
  // Go to the results page
  await page.goto('http://localhost:3000/results/042f6528-eec2-466a-b0b7-4679bb2ab904');

  // Wait for page to load
  await page.waitForLoadState('networkidle');

  // Find all resource links (links to /resources/*)
  const resourceLinks = await page.locator('a[href^="/resources/"]').all();

  console.log(`Found ${resourceLinks.length} resource links`);

  // Collect all unique hrefs
  const hrefs = new Set<string>();
  for (const link of resourceLinks) {
    const href = await link.getAttribute('href');
    if (href) hrefs.add(href);
  }

  console.log(`Unique resource pages: ${hrefs.size}`);
  console.log('Resources found:', Array.from(hrefs));

  // Test each resource page loads successfully
  const results: { url: string; status: string; loadTime: number }[] = [];

  for (const href of hrefs) {
    const startTime = Date.now();
    try {
      const response = await page.goto(`http://localhost:3000${href}`, {
        waitUntil: 'domcontentloaded',
        timeout: 30000
      });
      const loadTime = Date.now() - startTime;
      const status = response && response.status() === 200 ? 'OK' : `Error: ${response ? response.status() : 'no response'}`;
      results.push({ url: href, status, loadTime });
      console.log(`✓ ${href} - ${status} (${loadTime}ms)`);
    } catch (error) {
      const loadTime = Date.now() - startTime;
      results.push({ url: href, status: `Failed: ${error}`, loadTime });
      console.log(`✗ ${href} - Failed (${loadTime}ms)`);
    }
  }

  // Summary
  console.log('\n--- Summary ---');
  const failed = results.filter(r => !r.status.startsWith('OK'));
  if (failed.length > 0) {
    console.log('Failed resources:', failed);
  } else {
    console.log('All resources loaded successfully!');
  }

  // Average load time
  const avgLoadTime = results.reduce((sum, r) => sum + r.loadTime, 0) / results.length;
  console.log(`Average load time: ${Math.round(avgLoadTime)}ms`);

  // Assert all passed
  expect(failed.length).toBe(0);
});
