// Run: node tests/browser-check.js (local server at 127.0.0.1:8765 required).
const { chromium } = require('playwright-core');
const { AxeBuilder } = require('@axe-core/playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
  });
  const reports = [];
  fs.mkdirSync(path.join(__dirname, '../docs/screenshots'), { recursive: true });
  try {
    for (const width of [1440, 768, 390, 320]) {
      const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
      const page = await context.newPage();
      const errors = [];
      const external = [];
      page.on('pageerror', e => errors.push(e.message));
      page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
      page.on('request', r => { if (!r.url().startsWith('http://127.0.0.1:8765/')) external.push(r.url()); });
      const response = await page.goto('http://127.0.0.1:8765/', { waitUntil: 'networkidle' });
      assert.equal(response.status(), 200);
      assert.match(await page.title(), /Haargenau.*Website-Demo/);
      assert.equal(await page.locator('h1').innerText().then(s => s.replace(/\s+/g, ' ').replace('Haargenau.Ihr','Haargenau. Ihr')), 'Haargenau. Ihr Friseur in Frankfurt.');
      const geometry = await page.evaluate(() => ({
        width: innerWidth,
        document: document.documentElement.scrollWidth,
        overflow: [...document.querySelectorAll('main *, header *, footer *')].filter(e => {
          if (e.classList.contains('sr-only')) return false;
          const r = e.getBoundingClientRect();
          return r.width && (r.right > innerWidth + 1 || r.left < -1);
        }).map(e => e.tagName + '.' + e.className),
        imagesLoaded: [...document.images].every(i => i.complete && i.naturalWidth > 0),
        scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
      }));
      assert.equal(geometry.document, width, JSON.stringify(geometry));
      assert.deepEqual(geometry.overflow, [], JSON.stringify(geometry));
      assert.ok(geometry.imagesLoaded);
      assert.equal(geometry.scrollBehavior, 'auto');
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(() => document.activeElement.textContent), 'Zum Inhalt springen');
      await page.keyboard.press('Enter');
      assert.equal(new URL(page.url()).hash, '#inhalt');
      for (const [name, id] of [['Ihr Besuch', 'besuch'], ['Das Konzept', 'konzept'], ['Kontakt', 'kontakt']]) {
        await page.getByRole('navigation').getByRole('link', { name }).click();
        assert.equal(new URL(page.url()).hash, '#' + id);
        assert.ok(await page.locator('#' + id).isVisible());
      }
      assert.equal(await page.locator('.button').getAttribute('href'), 'tel:' + '+49' + '69' + '523239');
      const maps = page.getByRole('link', { name: /Anfahrt mit Google Maps/ });
      const mapsUrl = new URL(await maps.getAttribute('href'));
      assert.equal(mapsUrl.hostname, 'www.google.com');
      assert.match(mapsUrl.searchParams.get('query'), /Ginnheimer Landstraße 173 60431 Frankfurt/);
      assert.equal(await maps.getAttribute('target'), '_blank');
      const a11y = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
      assert.deepEqual(a11y.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })), []);
      assert.deepEqual(external, []);
      assert.deepEqual(errors, []);
      await page.evaluate(() => scrollTo(0, 0));
      if (width === 1440 || width === 390) await page.screenshot({ path: path.join(__dirname, `../docs/screenshots/${width === 1440 ? 'desktop' : 'mobile'}.png`), fullPage: true });
      reports.push({ width, http: 200, overflow: false, externalRequests: external.length, consoleErrors: errors.length, axeViolations: a11y.violations.length, axePasses: a11y.passes.length, anchors: '3 passed', reducedMotion: 'passed' });
      await context.close();
    }
    const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    const page = await noJs.newPage();
    await page.goto('http://127.0.0.1:8765/');
    await page.getByRole('navigation').getByRole('link', { name: 'Kontakt' }).click();
    assert.equal(new URL(page.url()).hash, '#kontakt');
    assert.ok(await page.getByRole('heading', { name: 'Lust auf Veränderung?' }).isVisible());
    assert.ok(await page.locator('.button').isVisible());
    reports.push({ javaScriptDisabled: true, navigation: 'passed', content: 'visible' });
    const result = { browser: await browser.version(), reports };
    fs.writeFileSync(path.join(__dirname, '../docs/browser-results.json'), JSON.stringify(result, null, 2) + '\n');
    console.log(JSON.stringify(result, null, 2));
    await noJs.close();
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
