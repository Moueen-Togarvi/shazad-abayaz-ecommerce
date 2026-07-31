import { chromium } from 'playwright';

const TOKEN = process.argv[2];
const PORT = process.argv[3] || '5187';

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
await context.addCookies([
	{
		name: 'shahzad_admin_session',
		value: TOKEN,
		domain: 'localhost',
		path: '/',
		httpOnly: true,
		sameSite: 'Lax'
	}
]);

const page = await context.newPage();
await page.goto(`http://localhost:${PORT}/shahzad-secure-admin-4db067e1/products/new`, {
	waitUntil: 'networkidle'
});

await page.waitForSelector('text=Add colour / size option', { timeout: 15000 });

const card = page
	.locator('div')
	.filter({ hasText: 'Add colour / size option' })
	.first();

await page.screenshot({
	path: '/tmp/claude-1000/-home-moueentogarvi-code-shazad-abayaz-ecommerce/b8ddee24-7f50-4c43-83de-6155c8a5327f/scratchpad/variants-full.png',
	fullPage: true
});

const errors = [];
page.on('console', (msg) => {
	if (msg.type() === 'error') errors.push(msg.text());
});

console.log('Screenshot saved. Console errors:', errors);
await browser.close();
