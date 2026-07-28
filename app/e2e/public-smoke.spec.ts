import { expect, test } from '@playwright/test';

test.describe('public storefront smoke', () => {
	test('renders the homepage storefront', async ({ page }) => {
		await page.goto('/');

		await expect(page).toHaveTitle(/Abayiza \| Premium Modest Fashion/);
		await expect(page.getByRole('link', { name: /Shop Collection/ })).toHaveAttribute(
			'href',
			'/shop'
		);
		await expect(page.getByRole('heading', { name: /Signature Collections/ })).toBeVisible();
	});

	test('renders a paginated homepage section page', async ({ page }) => {
		await page.goto('/sections/new-arrivals?page=1');

		await expect(page).toHaveTitle(/New Arrivals \| Abayiza/);
		await expect(page.getByRole('heading', { level: 1, name: 'New Arrivals' })).toBeVisible();
		await expect(page.getByRole('link', { name: 'Back Home' })).toHaveAttribute('href', '/');
		await expect(page.getByText(/Page 1 of/)).toBeVisible();
	});

	test('protects the admin storefront route', async ({ page }) => {
		await page.goto('/abayiza-secure-admin-7k9x2p/storefront');

		await expect(page).toHaveURL(/\/abayiza-secure-admin-7k9x2p\/login\?redirectTo=.*storefront/);
		await expect(page).toHaveTitle(/Admin Login \| Abayiza/);
		await expect(page.getByRole('heading', { name: 'Sign in to Abayiza' })).toBeVisible();
	});

	test('shows the contact page and key support controls', async ({ page }) => {
		await page.goto('/contact');

		await expect(page).toHaveTitle(/Contact Us \| Abayiza/);
		await expect(page.getByRole('heading', { level: 1, name: 'Contact Us' })).toBeVisible();
		await expect(page.getByRole('heading', { name: 'Get in Touch' })).toBeVisible();
		await expect(page.getByRole('link', { name: 'support@abayiza.com' })).toBeVisible();
		await expect(page.getByLabel(/Email Address/)).toBeVisible();
		await expect(page.getByLabel(/Message/)).toBeVisible();
		await expect(page.getByRole('button', { name: 'Submit Message' })).toBeVisible();
	});

	test('opens the cart page with an empty-bag call to action', async ({ page }) => {
		await page.goto('/cart');

		await expect(page).toHaveTitle(/Your Bag \| Abayiza/);
		await expect(page.getByRole('heading', { level: 1, name: 'Your Bag' })).toBeVisible();
		await expect(page.getByText('Your bag is currently empty.')).toBeVisible();
		await expect(page.getByRole('link', { name: 'Continue Shopping' })).toHaveAttribute(
			'href',
			'/shop'
		);
	});

	test('switches from sign in to create account on the login page', async ({ page }) => {
		await page.goto('/login');

		await expect(page).toHaveTitle(/Sign In \| Abayiza/);
		await expect(page.getByLabel('Email Address')).toBeVisible();
		await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();

		await expect(async () => {
			await page.getByRole('button', { name: 'Create one' }).click();
			await expect(page.getByLabel('First Name')).toBeVisible({ timeout: 1_000 });
		}).toPass();
		await expect(page.getByLabel('Last Name')).toBeVisible();
		await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
	});
});
