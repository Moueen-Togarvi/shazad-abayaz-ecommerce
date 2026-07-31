import { chromium } from '@playwright/test';

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage();
await page.goto('http://localhost:5173/shop/cutdana-lace', { waitUntil: 'networkidle' });

const mainImg = page.locator('img').first();
const swatches = page.locator('button[aria-label^="Select "]');
const n = await swatches.count();
console.log('OUT swatchCount=' + n);

const results = [];
for (let i = 0; i < n; i++) {
  const sw = swatches.nth(i);
  const label = (await sw.getAttribute('aria-label')).replace('Select ', '');
  await sw.click();
  await page.waitForTimeout(250);
  const src = await page.locator('img[alt]').first().getAttribute('src');
  // find the big gallery image specifically
  const gallery = await page.evaluate(() => {
    const imgs = [...document.querySelectorAll('img')];
    const big = imgs.map(i => ({src: i.getAttribute('src'), w: i.clientWidth}))
                    .filter(i => i.src && i.src.includes('cutdana'))
                    .sort((a,b) => b.w - a.w)[0];
    return big ? big.src : null;
  });
  results.push({ label, gallery });
}
for (const r of results) console.log('OUT ' + r.label.padEnd(20) + ' -> ' + (r.gallery||'').split('/').pop());

// verify each colour showed a DIFFERENT image matching its name
let ok = 0;
for (const r of results) {
  const slug = r.label.toLowerCase().replace(/\s+/g,'-');
  if (r.gallery && r.gallery.includes(slug)) ok++;
}
console.log('OUT matched=' + ok + '/' + results.length);

await browser.close();
