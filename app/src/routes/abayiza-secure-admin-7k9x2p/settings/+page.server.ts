import { setAdminFlash } from '$lib/server/admin-flash';
import { defaultStoreSettings, getSettings, saveSettings } from '$lib/server/store-settings';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

const getText = (data: FormData, key: string, fallback = '') =>
	String(data.get(key) ?? fallback).trim();

const emailAddress = (value: string) => value.match(/<([^>]+)>/)?.[1] || value;
const isEmail = (value: string) =>
	!value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress(value).trim());

const readSettingsForm = (data: FormData) => ({
	store_name: getText(data, 'store_name'),
	store_contact_email: getText(data, 'store_contact_email'),
	sender_email: getText(data, 'sender_email'),
	support_phone: getText(data, 'support_phone'),
	support_phone_secondary: getText(data, 'support_phone_secondary'),
	whatsapp_catalog: getText(data, 'whatsapp_catalog'),
	whatsapp_order_number: getText(data, 'whatsapp_order_number'),
	whatsapp_order_number_secondary: getText(data, 'whatsapp_order_number_secondary'),
	timezone: getText(data, 'timezone'),
	unit_system: getText(data, 'unit_system'),
	store_currency: getText(data, 'store_currency'),
	default_country: getText(data, 'default_country'),
	free_shipping_threshold: getText(data, 'free_shipping_threshold'),
	cod_enabled: data.get('cod_enabled') === 'on' ? 'true' : 'false',
	jazzcash_status: getText(data, 'jazzcash_status'),
	return_policy_days: getText(data, 'return_policy_days'),
	shipping_note: getText(data, 'shipping_note'),
	order_notify_email: getText(data, 'order_notify_email'),
	resend_from_email: getText(data, 'resend_from_email')
});

export const load: PageServerLoad = async ({ url }) => ({
	settings: await getSettings(defaultStoreSettings),
	saved: url.searchParams.get('saved') === '1',
	reset: url.searchParams.get('reset') === '1'
});

export const actions: Actions = {
	save: async ({ request, cookies }) => {
		const data = await request.formData();
		const settings = readSettingsForm(data);

		if (!settings.store_name) {
			return fail(400, { error: 'Store name is required.', settings });
		}

		if (
			!isEmail(settings.store_contact_email) ||
			!isEmail(settings.sender_email) ||
			!isEmail(settings.order_notify_email) ||
			!isEmail(settings.resend_from_email)
		) {
			return fail(400, { error: 'Please enter valid email addresses.', settings });
		}

		if (Number(settings.return_policy_days) < 0 || Number(settings.free_shipping_threshold) < 0) {
			return fail(400, { error: 'Numeric settings must be zero or higher.', settings });
		}

		await saveSettings(settings);
		setAdminFlash(cookies, 'Settings updated successfully.');
		throw redirect(303, '/abayiza-secure-admin-7k9x2p/settings?saved=1');
	},

	reset: async ({ cookies }) => {
		await saveSettings(defaultStoreSettings);
		setAdminFlash(cookies, 'Settings reset successfully.');
		throw redirect(303, '/abayiza-secure-admin-7k9x2p/settings?reset=1');
	}
};
