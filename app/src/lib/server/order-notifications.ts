import { env } from '$env/dynamic/private';
import prisma from '$lib/server/prisma';
import { defaultStoreSettings, getSettings } from '$lib/server/store-settings';
import { formatMoney } from '$lib/shared/money';

type NotificationOrder = {
	id: string;
	orderNumber: string;
	guestEmail?: string | null;
	totalAmount: number;
	subtotal: number;
	shippingCost: number;
	discountTotal: number;
	paymentMethod: string;
	shippingAddress: Record<string, unknown>;
	siteUrl?: string;
	items: Array<{
		productName: string;
		variantColor?: string | null;
		variantSize?: string | null;
		quantity: number;
		priceAtPurchase: number;
	}>;
};

const escapeHtml = (value: unknown) =>
	String(value ?? '')
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#039;');

const addressLine = (address: Record<string, unknown>) =>
	[
		`${address.firstName || ''} ${address.lastName || ''}`.trim(),
		address.addressLine1,
		address.addressLine2,
		address.city,
		address.postalCode,
		address.country,
		address.phone
	]
		.filter(Boolean)
		.map(String)
		.join(', ');

const cleanOrigin = (value: string | undefined) => {
	const trimmed = String(value || '').trim();
	if (!trimmed) return '';
	return trimmed.replace(/\/+$/, '');
};

const buildUrl = (origin: string, path: string) => (origin ? `${origin}${path}` : path);

const formatSender = (value: string, storeName: string) => {
	const trimmed = value.trim();
	if (!trimmed) return `${storeName} <onboarding@resend.dev>`;
	if (trimmed.includes('<')) return trimmed;
	return `${storeName} <${trimmed}>`;
};

const renderItemRows = (order: NotificationOrder) =>
	order.items
		.map((item) => {
			const options = [item.variantColor, item.variantSize].filter(Boolean).join(' / ');
			return `
				<tr>
					<td style="padding: 10px 0; border-bottom: 1px solid #eee;">
						<strong>${escapeHtml(item.productName)}</strong><br />
						<span style="color: #667; font-size: 12px;">${escapeHtml(options || 'Abayiza')}</span>
					</td>
					<td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
					<td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right;">${formatMoney(item.priceAtPurchase * item.quantity)}</td>
				</tr>
			`;
		})
		.join('');

const renderTotals = (order: NotificationOrder) => `
	<div style="border-top: 1px solid #eee; padding-top: 14px; margin-top: 16px;">
		<p style="margin: 0 0 6px; display: flex; justify-content: space-between; gap: 16px;">
			<span style="color: #596c62;">Subtotal</span>
			<strong>${formatMoney(order.subtotal)}</strong>
		</p>
		<p style="margin: 0 0 6px; display: flex; justify-content: space-between; gap: 16px;">
			<span style="color: #596c62;">Shipping</span>
			<strong>${formatMoney(order.shippingCost)}</strong>
		</p>
		${
			order.discountTotal > 0
				? `<p style="margin: 0 0 6px; display: flex; justify-content: space-between; gap: 16px;">
					<span style="color: #596c62;">Discount</span>
					<strong>${formatMoney(order.discountTotal)}</strong>
				</p>`
				: ''
		}
		<p style="margin: 12px 0 0; display: flex; justify-content: space-between; gap: 16px; font-size: 18px;">
			<span>Total</span>
			<strong>${formatMoney(order.totalAmount)}</strong>
		</p>
	</div>
`;

const renderCustomerOrderEmail = (order: NotificationOrder, orderUrl: string) => {
	const rows = renderItemRows(order);

	return `
		<div style="font-family: Arial, sans-serif; color: #14352d; max-width: 620px; margin: 0 auto;">
			<h1 style="font-size: 28px; margin: 0 0 8px;">Thank you for your order</h1>
			<p style="margin: 0 0 24px; color: #596c62;">Your Abayiza order has been received successfully. We will confirm it soon.</p>
			<div style="background: #fbf9f2; border: 1px solid #eee7d8; padding: 18px; margin-bottom: 20px;">
				<p style="margin: 0 0 6px;"><strong>Order:</strong> ${escapeHtml(order.orderNumber)}</p>
				<p style="margin: 0 0 6px;"><strong>Payment:</strong> Cash on Delivery</p>
				<p style="margin: 0;"><strong>Total:</strong> ${formatMoney(order.totalAmount)}</p>
			</div>
			${
				orderUrl
					? `<p style="margin: 0 0 22px;">
						<a href="${escapeHtml(orderUrl)}" style="display: inline-block; background: #14352d; color: #ffffff; padding: 12px 18px; border-radius: 999px; text-decoration: none; font-weight: 700;">View your order</a>
					</p>`
					: ''
			}
			<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
				<thead>
					<tr>
						<th style="text-align: left; padding-bottom: 8px;">Item</th>
						<th style="text-align: center; padding-bottom: 8px;">Qty</th>
						<th style="text-align: right; padding-bottom: 8px;">Amount</th>
					</tr>
				</thead>
				<tbody>${rows}</tbody>
			</table>
			${renderTotals(order)}
			<p style="margin: 0 0 8px;"><strong>Shipping address</strong></p>
			<p style="margin: 0; color: #596c62;">${escapeHtml(addressLine(order.shippingAddress))}</p>
		</div>
	`;
};

const renderAdminOrderEmail = (order: NotificationOrder, adminOrderUrl: string) => {
	const rows = renderItemRows(order);
	const customerName =
		`${order.shippingAddress.firstName || ''} ${order.shippingAddress.lastName || ''}`.trim();

	return `
		<div style="font-family: Arial, sans-serif; color: #14352d; max-width: 680px; margin: 0 auto;">
			<h1 style="font-size: 28px; margin: 0 0 8px;">New order received</h1>
			<p style="margin: 0 0 24px; color: #596c62;">A customer placed order ${escapeHtml(order.orderNumber)} on Abayiza.</p>
			<div style="background: #14352d; color: #ffffff; padding: 18px; margin-bottom: 20px;">
				<p style="margin: 0 0 6px;"><strong>Total:</strong> ${formatMoney(order.totalAmount)}</p>
				<p style="margin: 0 0 6px;"><strong>Customer:</strong> ${escapeHtml(customerName || 'Customer')}</p>
				<p style="margin: 0;"><strong>Email:</strong> ${escapeHtml(order.guestEmail || 'No email')}</p>
			</div>
			<p style="margin: 0 0 22px;">
				<a href="${escapeHtml(adminOrderUrl)}" style="display: inline-block; background: #e4b43d; color: #14352d; padding: 12px 18px; border-radius: 999px; text-decoration: none; font-weight: 800;">Open order in admin</a>
			</p>
			<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
				<thead>
					<tr>
						<th style="text-align: left; padding-bottom: 8px;">Item</th>
						<th style="text-align: center; padding-bottom: 8px;">Qty</th>
						<th style="text-align: right; padding-bottom: 8px;">Amount</th>
					</tr>
				</thead>
				<tbody>${rows}</tbody>
			</table>
			${renderTotals(order)}
			<p style="margin: 18px 0 8px;"><strong>Shipping address</strong></p>
			<p style="margin: 0; color: #596c62;">${escapeHtml(addressLine(order.shippingAddress))}</p>
		</div>
	`;
};

const getFallbackAdminEmail = async (customerEmail: string) => {
	const adminUser = await prisma.user.findFirst({
		where: {
			role: { in: ['SUPER_ADMIN', 'EDITOR'] },
			email: customerEmail ? { not: customerEmail } : undefined
		},
		orderBy: { createdAt: 'asc' },
		select: { email: true }
	});

	return adminUser?.email || '';
};

const sendEmail = async (to: string, subject: string, html: string, from: string) => {
	const apiKey = env.RESEND_API_KEY;
	if (!apiKey || !to) return { skipped: true };

	const response = await fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			from,
			to: [to],
			subject,
			html
		})
	});

	if (!response.ok) {
		const body = await response.text();
		throw new Error(`Resend email failed: ${response.status} ${body}`);
	}

	return response.json();
};

export const sendOrderNotifications = async (order: NotificationOrder) => {
	try {
		const settings = await getSettings(defaultStoreSettings);
		const customerEmail = String(order.guestEmail || '').trim();
		const fallbackAdminEmail = await getFallbackAdminEmail(customerEmail);
		const adminEmail =
			settings.order_notify_email ||
			env.ORDER_NOTIFY_EMAIL ||
			env.RESEND_NOTIFY_EMAIL ||
			fallbackAdminEmail ||
			settings.store_contact_email ||
			'';
		const storeName = settings.store_name || 'Abayiza';
		const from = formatSender(settings.resend_from_email || env.RESEND_FROM_EMAIL || '', storeName);
		const origin = cleanOrigin(env.SITE_URL || env.PUBLIC_SITE_URL || env.APP_URL || order.siteUrl);
		const adminOrderUrl = buildUrl(
			origin,
			`/abayiza-secure-admin-7k9x2p/orders/${encodeURIComponent(order.id)}`
		);
		const customerOrderUrl = buildUrl(
			origin,
			`/checkout/success?order=${encodeURIComponent(order.id)}`
		);
		const subject = `${storeName} order ${order.orderNumber}`;

		const results = await Promise.allSettled([
			customerEmail
				? sendEmail(
						customerEmail,
						`Your ${subject}`,
						renderCustomerOrderEmail(order, customerOrderUrl),
						from
					)
				: Promise.resolve({ skipped: true }),
			adminEmail
				? sendEmail(adminEmail, `New ${subject}`, renderAdminOrderEmail(order, adminOrderUrl), from)
				: Promise.resolve({ skipped: true })
		]);

		for (const result of results) {
			if (result.status === 'rejected') {
				console.warn(result.reason);
			}
		}
	} catch (error) {
		console.warn('Order notification emails could not be sent.', error);
	}
};
