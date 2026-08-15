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
						<span style="color: #667; font-size: 12px;">${escapeHtml(options || "Shahzad Abaya's")}</span>
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
			<span style="color: #52524f;">Subtotal</span>
			<strong>${formatMoney(order.subtotal)}</strong>
		</p>
		<p style="margin: 0 0 6px; display: flex; justify-content: space-between; gap: 16px;">
			<span style="color: #52524f;">Shipping</span>
			<strong>${formatMoney(order.shippingCost)}</strong>
		</p>
		${
			order.discountTotal > 0
				? `<p style="margin: 0 0 6px; display: flex; justify-content: space-between; gap: 16px;">
					<span style="color: #52524f;">Discount</span>
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

const paymentMethodLabel = (paymentMethod: string) =>
	paymentMethod === 'ADVANCE' ? 'Advance Payment (Free Shipping)' : 'Cash on Delivery';

const renderCustomerOrderEmail = (order: NotificationOrder, orderUrl: string) => {
	const rows = renderItemRows(order);

	return `
		<div style="font-family: Arial, sans-serif; color: #0a0a0a; max-width: 620px; margin: 0 auto;">
			<h1 style="font-size: 28px; margin: 0 0 8px;">Thank you for your order</h1>
			<p style="margin: 0 0 24px; color: #52524f;">Your Shahzad Abaya's order has been received successfully. We will confirm it soon.</p>
			<div style="background: #fbf9f2; border: 1px solid #eee7d8; padding: 18px; margin-bottom: 20px;">
				<p style="margin: 0 0 6px;"><strong>Order:</strong> ${escapeHtml(order.orderNumber)}</p>
				<p style="margin: 0 0 6px;"><strong>Payment:</strong> ${paymentMethodLabel(order.paymentMethod)}</p>
				<p style="margin: 0;"><strong>Total:</strong> ${formatMoney(order.totalAmount)}</p>
			</div>
			${
				orderUrl
					? `<p style="margin: 0 0 22px;">
						<a href="${escapeHtml(orderUrl)}" style="display: inline-block; background: #0a0a0a; color: #ffffff; padding: 12px 18px; border-radius: 999px; text-decoration: none; font-weight: 700;">View your order</a>
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
			<p style="margin: 0; color: #52524f;">${escapeHtml(addressLine(order.shippingAddress))}</p>
		</div>
	`;
};

const renderAdminOrderEmail = (
	order: NotificationOrder,
	adminOrderUrl: string,
	storeName: string
) => {
	const customerName =
		`${order.shippingAddress.firstName || ''} ${order.shippingAddress.lastName || ''}`.trim() ||
		'Customer';
	const customerEmail = String(order.guestEmail || '').trim();
	const customerPhone = String(order.shippingAddress.phone || '').trim();
	const phoneDigits = customerPhone.replace(/\D/g, '');
	const whatsappNumber = phoneDigits.startsWith('0') ? `92${phoneDigits.slice(1)}` : phoneDigits;
	const itemCount = order.items.reduce((total, item) => total + item.quantity, 0);
	const city = String(order.shippingAddress.city || '').trim();
	const deliveryAddress = [
		order.shippingAddress.addressLine1,
		order.shippingAddress.addressLine2,
		order.shippingAddress.city,
		order.shippingAddress.postalCode,
		order.shippingAddress.country
	]
		.filter(Boolean)
		.map(String)
		.join(', ');
	const itemRows = order.items
		.map((item) => {
			const options = [item.variantColor, item.variantSize].filter(Boolean).join(' / ');
			return `
				<tr>
					<td style="padding: 16px 8px 16px 0; border-bottom: 1px solid #e8e4da; vertical-align: top;">
						<p style="margin: 0 0 4px; color: #171713; font-size: 14px; line-height: 20px; font-weight: 700;">${escapeHtml(item.productName)}</p>
						<p style="margin: 0; color: #706d65; font-size: 12px; line-height: 18px;">${escapeHtml(options || 'Standard')}</p>
						<p style="margin: 4px 0 0; color: #8a867d; font-size: 12px; line-height: 18px;">${formatMoney(item.priceAtPurchase)} each</p>
					</td>
					<td width="48" style="padding: 16px 4px; border-bottom: 1px solid #e8e4da; color: #45443f; font-size: 14px; line-height: 20px; text-align: center; vertical-align: top;">${item.quantity}</td>
					<td width="112" style="padding: 16px 0 16px 8px; border-bottom: 1px solid #e8e4da; color: #171713; font-size: 14px; line-height: 20px; font-weight: 700; text-align: right; vertical-align: top; white-space: nowrap;">${formatMoney(item.priceAtPurchase * item.quantity)}</td>
				</tr>
			`;
		})
		.join('');
	const discountRow =
		order.discountTotal > 0
			? `<tr>
				<td style="padding: 5px 0; color: #5f5c54; font-size: 14px; line-height: 20px;">Discount</td>
				<td style="padding: 5px 0; color: #0f6a47; font-size: 14px; line-height: 20px; font-weight: 700; text-align: right;">−${formatMoney(order.discountTotal)}</td>
			</tr>`
			: '';
	const contactActions = [
		customerPhone && phoneDigits
			? `<a href="tel:${escapeHtml(phoneDigits)}" style="display: inline-block; margin: 0 6px 8px 0; padding: 9px 13px; border: 1px solid #d8d2c4; border-radius: 999px; color: #173c30; font-size: 12px; line-height: 16px; font-weight: 700; text-decoration: none;">Call customer</a>`
			: '',
		customerPhone && whatsappNumber
			? `<a href="https://wa.me/${escapeHtml(whatsappNumber)}" style="display: inline-block; margin: 0 6px 8px 0; padding: 9px 13px; border: 1px solid #d8d2c4; border-radius: 999px; color: #173c30; font-size: 12px; line-height: 16px; font-weight: 700; text-decoration: none;">WhatsApp</a>`
			: '',
		customerEmail
			? `<a href="mailto:${escapeHtml(customerEmail)}" style="display: inline-block; margin: 0 0 8px; padding: 9px 13px; border: 1px solid #d8d2c4; border-radius: 999px; color: #173c30; font-size: 12px; line-height: 16px; font-weight: 700; text-decoration: none;">Send email</a>`
			: ''
	].join('');

	return `<!doctype html>
	<html lang="en">
		<head>
			<meta charset="utf-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<meta name="color-scheme" content="light" />
			<title>New order ${escapeHtml(order.orderNumber)}</title>
			<style>
				@media only screen and (max-width: 620px) {
					.email-shell { width: 100% !important; }
					.email-pad { padding-left: 20px !important; padding-right: 20px !important; }
					.summary-cell { display: block !important; width: auto !important; border-right: 0 !important; border-bottom: 1px solid #315247 !important; }
					.summary-cell-last { border-bottom: 0 !important; }
					.mobile-full { display: block !important; width: 100% !important; box-sizing: border-box !important; text-align: center !important; }
				}
			</style>
		</head>
		<body style="margin: 0; padding: 0; background: #f1eee7; color: #171713; font-family: Arial, Helvetica, sans-serif; -webkit-font-smoothing: antialiased;">
			<div style="display: none; max-height: 0; overflow: hidden; opacity: 0; color: transparent;">${escapeHtml(customerName)} placed ${escapeHtml(order.orderNumber)} for ${formatMoney(order.totalAmount)}. Review and confirm the order.</div>
			<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width: 100%; background: #f1eee7;">
				<tr>
					<td align="center" style="padding: 28px 12px;">
						<table role="presentation" class="email-shell" width="680" cellspacing="0" cellpadding="0" border="0" style="width: 680px; max-width: 680px; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 12px 34px rgba(23, 60, 48, 0.08);">
							<tr>
								<td class="email-pad" style="padding: 28px 34px 24px; background: #173c30; color: #ffffff;">
									<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
										<tr>
											<td style="color: #ffffff; font-size: 15px; line-height: 20px; font-weight: 800; letter-spacing: 1.6px; text-transform: uppercase;">${escapeHtml(storeName)}</td>
											<td align="right"><span style="display: inline-block; padding: 6px 10px; border-radius: 999px; background: #c8ff46; color: #10261f; font-size: 10px; line-height: 14px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase;">New order</span></td>
										</tr>
									</table>
									<h1 style="margin: 30px 0 8px; color: #ffffff; font-family: Georgia, 'Times New Roman', serif; font-size: 34px; line-height: 40px; font-weight: 400;">Order received</h1>
									<p style="margin: 0; color: #d9e2de; font-size: 14px; line-height: 22px;">Review the details below and confirm fulfillment for <strong style="color: #ffffff;">${escapeHtml(order.orderNumber)}</strong>.</p>
								</td>
							</tr>
							<tr>
								<td style="background: #173c30; padding: 0 20px 24px;">
									<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width: 100%; border: 1px solid #315247; border-radius: 14px; overflow: hidden;">
										<tr>
											<td class="summary-cell" width="38%" style="padding: 16px; border-right: 1px solid #315247;">
												<p style="margin: 0 0 4px; color: #abc0b8; font-size: 10px; line-height: 14px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">Order total</p>
												<p style="margin: 0; color: #c8ff46; font-size: 21px; line-height: 26px; font-weight: 800;">${formatMoney(order.totalAmount)}</p>
											</td>
											<td class="summary-cell" width="34%" style="padding: 16px; border-right: 1px solid #315247;">
												<p style="margin: 0 0 4px; color: #abc0b8; font-size: 10px; line-height: 14px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">Payment</p>
												<p style="margin: 0; color: #ffffff; font-size: 13px; line-height: 19px; font-weight: 700;">${escapeHtml(paymentMethodLabel(order.paymentMethod))}</p>
											</td>
											<td class="summary-cell summary-cell-last" width="28%" style="padding: 16px;">
												<p style="margin: 0 0 4px; color: #abc0b8; font-size: 10px; line-height: 14px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">Items</p>
												<p style="margin: 0; color: #ffffff; font-size: 16px; line-height: 21px; font-weight: 800;">${itemCount} piece${itemCount === 1 ? '' : 's'}</p>
											</td>
										</tr>
									</table>
								</td>
							</tr>
							<tr>
								<td class="email-pad" style="padding: 30px 34px 8px;">
									<a class="mobile-full" href="${escapeHtml(adminOrderUrl)}" style="display: inline-block; padding: 14px 22px; border-radius: 999px; background: #c8ff46; color: #10261f; font-size: 14px; line-height: 20px; font-weight: 800; text-decoration: none;">Open order in admin&nbsp; →</a>
									<p style="margin: 12px 0 0; color: #8a867d; font-size: 11px; line-height: 17px;">Order ID: ${escapeHtml(order.orderNumber)}</p>
								</td>
							</tr>
							<tr>
								<td class="email-pad" style="padding: 22px 34px 0;">
									<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width: 100%; background: #f7f4ed; border: 1px solid #e7e1d5; border-radius: 14px;">
										<tr>
											<td style="padding: 20px;">
												<p style="margin: 0 0 4px; color: #9a7a4f; font-size: 10px; line-height: 14px; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase;">Customer</p>
												<h2 style="margin: 0 0 12px; color: #171713; font-size: 20px; line-height: 26px;">${escapeHtml(customerName)}</h2>
												${customerPhone ? `<p style="margin: 0 0 5px; color: #5f5c54; font-size: 14px; line-height: 21px;"><strong style="color: #171713;">Phone:</strong> ${escapeHtml(customerPhone)}</p>` : ''}
												${customerEmail ? `<p style="margin: 0 0 5px; color: #5f5c54; font-size: 14px; line-height: 21px; word-break: break-word;"><strong style="color: #171713;">Email:</strong> ${escapeHtml(customerEmail)}</p>` : ''}
												${city ? `<p style="margin: 0; color: #5f5c54; font-size: 14px; line-height: 21px;"><strong style="color: #171713;">City:</strong> ${escapeHtml(city)}</p>` : ''}
												${contactActions ? `<div style="padding-top: 15px;">${contactActions}</div>` : ''}
											</td>
										</tr>
									</table>
								</td>
							</tr>
							<tr>
								<td class="email-pad" style="padding: 30px 34px 0;">
									<p style="margin: 0 0 10px; color: #9a7a4f; font-size: 10px; line-height: 14px; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase;">Order items</p>
									<table width="100%" cellspacing="0" cellpadding="0" border="0" style="width: 100%; border-collapse: collapse;">
										<thead>
											<tr>
												<th style="padding: 0 8px 9px 0; border-bottom: 2px solid #173c30; color: #706d65; font-size: 10px; line-height: 14px; font-weight: 800; letter-spacing: 0.8px; text-align: left; text-transform: uppercase;">Item</th>
												<th width="48" style="padding: 0 4px 9px; border-bottom: 2px solid #173c30; color: #706d65; font-size: 10px; line-height: 14px; font-weight: 800; letter-spacing: 0.8px; text-align: center; text-transform: uppercase;">Qty</th>
												<th width="112" style="padding: 0 0 9px 8px; border-bottom: 2px solid #173c30; color: #706d65; font-size: 10px; line-height: 14px; font-weight: 800; letter-spacing: 0.8px; text-align: right; text-transform: uppercase;">Amount</th>
											</tr>
										</thead>
										<tbody>${itemRows}</tbody>
									</table>
								</td>
							</tr>
							<tr>
								<td class="email-pad" style="padding: 24px 34px 0;">
									<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
										<tr>
											<td class="mobile-full" width="48%" style="padding: 0 24px 20px 0; vertical-align: top;">
												<p style="margin: 0 0 8px; color: #9a7a4f; font-size: 10px; line-height: 14px; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase;">Ship to</p>
												<p style="margin: 0; color: #45443f; font-size: 14px; line-height: 22px;">${escapeHtml(deliveryAddress || 'Address not provided')}</p>
											</td>
											<td class="mobile-full" width="52%" style="padding: 0 0 20px; vertical-align: top;">
												<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
													<tr>
														<td style="padding: 5px 0; color: #5f5c54; font-size: 14px; line-height: 20px;">Subtotal</td>
														<td style="padding: 5px 0; color: #171713; font-size: 14px; line-height: 20px; font-weight: 700; text-align: right;">${formatMoney(order.subtotal)}</td>
													</tr>
													<tr>
														<td style="padding: 5px 0; color: #5f5c54; font-size: 14px; line-height: 20px;">Shipping</td>
														<td style="padding: 5px 0; color: #171713; font-size: 14px; line-height: 20px; font-weight: 700; text-align: right;">${formatMoney(order.shippingCost)}</td>
													</tr>
													${discountRow}
													<tr>
														<td style="padding: 12px 0 0; border-top: 1px solid #d8d2c4; color: #171713; font-size: 16px; line-height: 22px; font-weight: 800;">Total</td>
														<td style="padding: 12px 0 0; border-top: 1px solid #d8d2c4; color: #173c30; font-size: 18px; line-height: 24px; font-weight: 800; text-align: right; white-space: nowrap;">${formatMoney(order.totalAmount)}</td>
													</tr>
												</table>
											</td>
										</tr>
									</table>
								</td>
							</tr>
							<tr>
								<td class="email-pad" style="padding: 22px 34px 30px;">
									<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width: 100%; background: #eff8d9; border-left: 4px solid #9bc832;">
										<tr>
											<td style="padding: 15px 16px; color: #344325; font-size: 13px; line-height: 20px;"><strong>Next step:</strong> Open the order, verify customer details, and confirm fulfillment.</td>
										</tr>
									</table>
								</td>
							</tr>
							<tr>
								<td class="email-pad" style="padding: 20px 34px; background: #f7f4ed; border-top: 1px solid #e7e1d5;">
									<p style="margin: 0; color: #77736a; font-size: 11px; line-height: 17px;">This operational notification was sent automatically by ${escapeHtml(storeName)}.</p>
								</td>
							</tr>
						</table>
					</td>
				</tr>
			</table>
		</body>
	</html>`;
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
		const storeName = settings.store_name || "Shahzad Abaya's";
		const from = formatSender(settings.resend_from_email || env.RESEND_FROM_EMAIL || '', storeName);
		const origin = cleanOrigin(env.SITE_URL || env.PUBLIC_SITE_URL || env.APP_URL || order.siteUrl);
		const adminOrderUrl = buildUrl(
			origin,
			`/shahzad-secure-admin-4db067e1/orders/${encodeURIComponent(order.id)}`
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
				? sendEmail(
						adminEmail,
						`New ${subject}`,
						renderAdminOrderEmail(order, adminOrderUrl, storeName),
						from
					)
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
