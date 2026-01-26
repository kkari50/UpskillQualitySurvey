import { test, expect } from '@playwright/test';

// Set longer timeout for this test since it tests many resources
test.setTimeout(300000);

interface ResourceResult {
  url: string;
  title: string;
  type: 'page' | 'pdf' | 'external';
  status: number | string;
  loadTime: number;
  result: 'PASS' | 'FAIL';
  error?: string;
}

test('Test all resource links from results page', async ({ page }) => {
  const results: ResourceResult[] = [];

  // Go to the results page
  console.log('Navigating to results page...');
  await page.goto('http://localhost:3000/results/042f6528-eec2-466a-b0b7-4679bb2ab904');
  await page.waitForLoadState('networkidle');

  // Wait for the page to fully render (it's client-side rendered)
  await page.waitForTimeout(3000);

  // Use JavaScript to expand all collapsible items at once
  console.log('Expanding all collapsible sections via JavaScript...');
  await page.evaluate(() => {
    // Click all closed collapsible triggers
    const closedTriggers = document.querySelectorAll('[data-state="closed"]');
    closedTriggers.forEach((trigger) => {
      if (trigger instanceof HTMLElement) {
        trigger.click();
      }
    });
  });

  // Wait for content to render
  await page.waitForTimeout(2000);

  // Now find all resource links by looking for teal-styled links
  console.log('Finding resource links...');

  const resourceData = await page.evaluate(() => {
    const links: { href: string; title: string }[] = [];

    // Find all anchor tags with teal styling (resource links)
    const anchors = document.querySelectorAll('a.bg-teal-50, a[class*="teal"]');
    anchors.forEach((a) => {
      const href = a.getAttribute('href');
      const title = a.textContent?.trim() || '';
      if (href && title) {
        links.push({ href, title });
      }
    });

    // Also check for buttons that might trigger PDF modals
    const buttons = document.querySelectorAll('button.bg-teal-50, button[class*="teal"]');
    buttons.forEach((btn) => {
      const title = btn.textContent?.trim() || '';
      if (title) {
        links.push({ href: `[PDF Modal] ${title}`, title });
      }
    });

    return links;
  });

  // Deduplicate
  const uniqueUrls = new Map<string, string>();
  for (const { href, title } of resourceData) {
    if (!uniqueUrls.has(href) && !href.startsWith('[PDF Modal]')) {
      uniqueUrls.set(href, title);
    }
  }

  console.log(`\nFound ${uniqueUrls.size} unique resource links to test\n`);

  // Test each resource
  for (const [href, title] of uniqueUrls) {
    const startTime = Date.now();
    let resourceResult: ResourceResult;

    // Determine resource type
    const isPdf = href.endsWith('.pdf');
    const isExternal = href.startsWith('http');
    const type: 'page' | 'pdf' | 'external' = isPdf ? 'pdf' : isExternal ? 'external' : 'page';

    try {
      if (isExternal) {
        // For external links, just do a fetch to check if accessible
        const response = await page.request.get(href, { timeout: 15000 });
        const loadTime = Date.now() - startTime;
        const status = response.status();

        resourceResult = {
          url: href,
          title,
          type: 'external',
          status,
          loadTime,
          result: status >= 200 && status < 400 ? 'PASS' : 'FAIL',
          error: status >= 400 ? `HTTP ${status}` : undefined,
        };
      } else {
        const fullUrl = href.startsWith('/') ? `http://localhost:3000${href}` : href;
        const response = await page.goto(fullUrl, {
          waitUntil: 'domcontentloaded',
          timeout: 30000,
        });

        const loadTime = Date.now() - startTime;
        const status = response?.status() || 0;

        resourceResult = {
          url: href,
          title,
          type,
          status,
          loadTime,
          result: status === 200 ? 'PASS' : 'FAIL',
          error: status !== 200 ? `HTTP ${status}` : undefined,
        };
      }
    } catch (error) {
      const loadTime = Date.now() - startTime;
      resourceResult = {
        url: href,
        title,
        type,
        status: 'ERROR',
        loadTime,
        result: 'FAIL',
        error: error instanceof Error ? error.message : String(error),
      };
    }

    results.push(resourceResult);

    // Log progress
    const statusIcon = resourceResult.result === 'PASS' ? '✓' : '✗';
    console.log(`${statusIcon} ${resourceResult.title} - ${resourceResult.status} (${resourceResult.loadTime}ms)`);
  }

  // Print summary table
  console.log('\n' + '='.repeat(140));
  console.log('RESOURCE TEST RESULTS SUMMARY');
  console.log('='.repeat(140));
  console.log(
    'TITLE'.padEnd(50) +
    'URL'.padEnd(45) +
    'TYPE'.padEnd(10) +
    'STATUS'.padEnd(10) +
    'TIME(ms)'.padEnd(10) +
    'RESULT'.padEnd(8) +
    'ERROR'
  );
  console.log('-'.repeat(140));

  for (const r of results) {
    console.log(
      r.title.substring(0, 48).padEnd(50) +
      r.url.substring(0, 43).padEnd(45) +
      r.type.padEnd(10) +
      String(r.status).padEnd(10) +
      String(r.loadTime).padEnd(10) +
      r.result.padEnd(8) +
      (r.error || '').substring(0, 30)
    );
  }

  console.log('-'.repeat(140));

  // Statistics
  const passed = results.filter(r => r.result === 'PASS').length;
  const failed = results.filter(r => r.result === 'FAIL').length;
  const pages = results.filter(r => r.type === 'page');
  const pdfs = results.filter(r => r.type === 'pdf');
  const external = results.filter(r => r.type === 'external');
  const avgLoadTime = results.filter(r => r.loadTime > 0).reduce((sum, r) => sum + r.loadTime, 0) /
    results.filter(r => r.loadTime > 0).length || 0;

  console.log(`\nTOTAL: ${results.length} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log(`PAGES: ${pages.length} | PDFs: ${pdfs.length} | EXTERNAL: ${external.length}`);
  console.log(`AVG LOAD TIME: ${Math.round(avgLoadTime)}ms`);
  console.log('='.repeat(140));

  // Assert no failures
  const failures = results.filter(r => r.result === 'FAIL');
  if (failures.length > 0) {
    console.log('\nFAILED RESOURCES:');
    failures.forEach(f => console.log(`  - ${f.title}: ${f.url} - ${f.error}`));
  }

  expect(failures.length).toBe(0);
});
