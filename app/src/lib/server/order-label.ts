import prisma from '$lib/server/prisma';
import { defaultStoreSettings, getSettings } from '$lib/server/store-settings';
import * as bwipjs from 'bwip-js/node';
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib';

type LabelItem = {
	name: string;
	color: string;
	size: string;
	quantity: number;
};

export type OrderLabel = {
	orderNumber: string;
	trackingNumber: string;
	createdAt: Date;
	customerName: string;
	customerPhone: string;
	deliveryAddress: string;
	destination: string;
	origin: string;
	paymentMethod: string;
	amount: number;
	pieces: number;
	items: LabelItem[];
	storeName: string;
	storePhone: string;
	storeEmail: string;
};

const clean = (value: unknown) => String(value ?? '').trim();

export const loadOrderLabel = async (id: string): Promise<OrderLabel | null> => {
	const [order, settings] = await Promise.all([
		prisma.order.findUnique({
			where: { id },
			include: {
				user: { select: { firstName: true, lastName: true } },
				items: true
			}
		}),
		getSettings(defaultStoreSettings)
	]);

	if (!order) return null;

	const address =
		order.shippingAddress && typeof order.shippingAddress === 'object'
			? (order.shippingAddress as Record<string, unknown>)
			: {};
	const addressName = `${clean(address.firstName)} ${clean(address.lastName)}`.trim();
	const userName = `${clean(order.user?.firstName)} ${clean(order.user?.lastName)}`.trim();
	const addressParts = [
		clean(address.addressLine1),
		clean(address.addressLine2),
		clean(address.city),
		clean(address.postalCode),
		clean(address.country)
	].filter(Boolean);

	return {
		orderNumber: order.orderNumber,
		trackingNumber: clean(order.trackingNumber) || order.orderNumber,
		createdAt: order.createdAt,
		customerName: userName || addressName || 'Guest Customer',
		customerPhone: clean(address.phone) || 'Not provided',
		deliveryAddress: addressParts.join(', ') || 'Address not provided',
		destination: clean(address.city) || 'Pakistan',
		origin: 'Pakistan',
		paymentMethod: order.paymentMethod === 'ADVANCE' ? 'Advance Paid' : 'Cash on Delivery',
		amount: Number(order.totalAmount),
		pieces: order.items.reduce((total, item) => total + item.quantity, 0),
		items: order.items.map((item) => ({
			name: item.productName,
			color: clean(item.variantColor),
			size: clean(item.variantSize),
			quantity: item.quantity
		})),
		storeName: settings.store_name || defaultStoreSettings.store_name,
		storePhone: settings.support_phone || defaultStoreSettings.support_phone,
		storeEmail: settings.store_contact_email || defaultStoreSettings.store_contact_email
	};
};

export const createOrderLabelCodes = async (label: OrderLabel) => {
	const barcode = await bwipjs.toBuffer({
		bcid: 'code128',
		text: label.trackingNumber,
		scale: 3,
		height: 10,
		includetext: false,
		paddingwidth: 0,
		paddingheight: 0
	});
	const qr = await bwipjs.toBuffer({
		bcid: 'qrcode',
		text: `ORDER:${label.orderNumber}|TRACKING:${label.trackingNumber}`,
		scale: 4,
		paddingwidth: 0,
		paddingheight: 0
	});

	return { barcode, qr };
};

const pdfSafe = (value: unknown) =>
	clean(value)
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^\x20-\x7E]/g, '?');

const wrapText = (text: string, font: PDFFont, size: number, width: number) => {
	const words = pdfSafe(text).split(/\s+/).filter(Boolean);
	const lines: string[] = [];
	let line = '';

	for (const word of words) {
		const candidate = line ? `${line} ${word}` : word;
		if (font.widthOfTextAtSize(candidate, size) <= width || !line) {
			line = candidate;
		} else {
			lines.push(line);
			line = word;
		}
	}
	if (line) lines.push(line);
	return lines;
};

const drawWrapped = (
	page: PDFPage,
	text: string,
	x: number,
	y: number,
	width: number,
	font: PDFFont,
	size = 7,
	maxLines = 2,
	lineHeight = 8.5
) => {
	const lines = wrapText(text, font, size, width).slice(0, maxLines);
	if (wrapText(text, font, size, width).length > maxLines && lines.length) {
		let last = lines[lines.length - 1];
		while (last.length && font.widthOfTextAtSize(`${last}...`, size) > width)
			last = last.slice(0, -1);
		lines[lines.length - 1] = `${last}...`;
	}
	lines.forEach((line, index) => page.drawText(line, { x, y: y - index * lineHeight, size, font }));
};

const drawSectionHeader = (
	page: PDFPage,
	title: string,
	x: number,
	y: number,
	width: number,
	font: PDFFont
) => {
	page.drawRectangle({ x, y, width, height: 14, color: rgb(0.86, 0.86, 0.86) });
	page.drawText(title, { x: x + 5, y: y + 4, size: 7, font });
};

const drawBox = (page: PDFPage, x: number, y: number, width: number, height: number) => {
	page.drawRectangle({
		x,
		y,
		width,
		height,
		borderColor: rgb(0.25, 0.25, 0.25),
		borderWidth: 0.65
	});
};

const drawKeyValue = (
	page: PDFPage,
	key: string,
	value: string,
	x: number,
	y: number,
	width: number,
	regular: PDFFont,
	bold: PDFFont,
	options: { valueSize?: number; maxLines?: number } = {}
) => {
	page.drawText(key, { x, y, size: 6, font: regular, color: rgb(0.25, 0.25, 0.25) });
	drawWrapped(
		page,
		value,
		x + 46,
		y,
		width - 46,
		bold,
		options.valueSize ?? 7,
		options.maxLines ?? 1
	);
};

const formatDate = (date: Date) =>
	new Intl.DateTimeFormat('en-PK', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		timeZone: 'Asia/Karachi'
	}).format(date);

export const buildOrderLabelPdf = async (label: OrderLabel) => {
	const pdf = await PDFDocument.create();
	const page = pdf.addPage([432, 288]);
	const regular = await pdf.embedFont(StandardFonts.Helvetica);
	const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
	const { barcode, qr } = await createOrderLabelCodes(label);
	const barcodeImage = await pdf.embedPng(barcode);
	const qrImage = await pdf.embedPng(qr);

	page.drawText(pdfSafe(label.storeName).toUpperCase(), { x: 12, y: 267, size: 15, font: bold });
	page.drawText('SHIPPING LABEL', {
		x: 13,
		y: 256,
		size: 6,
		font: bold,
		color: rgb(0.28, 0.28, 0.28)
	});
	page.drawImage(barcodeImage, { x: 238, y: 260, width: 182, height: 18 });
	const barcodeTextWidth = bold.widthOfTextAtSize(pdfSafe(label.trackingNumber), 6.5);
	page.drawText(pdfSafe(label.trackingNumber), {
		x: 329 - barcodeTextWidth / 2,
		y: 252,
		size: 6.5,
		font: bold
	});
	page.drawLine({ start: { x: 12, y: 247 }, end: { x: 420, y: 247 }, thickness: 1 });

	// Consignee and order information.
	drawBox(page, 12, 161, 246, 82);
	drawSectionHeader(page, 'CONSIGNEE INFORMATION', 12.5, 228.5, 245, bold);
	drawKeyValue(page, 'Name:', label.customerName, 18, 215, 232, regular, bold, { valueSize: 8 });
	drawKeyValue(page, 'Contact:', label.customerPhone, 18, 201, 232, regular, bold, {
		valueSize: 8
	});
	page.drawText('Delivery:', {
		x: 18,
		y: 187,
		size: 6,
		font: regular,
		color: rgb(0.25, 0.25, 0.25)
	});
	drawWrapped(page, label.deliveryAddress, 64, 187, 185, bold, 7, 3, 8);

	drawBox(page, 263, 161, 157, 82);
	drawSectionHeader(page, 'ORDER INFORMATION', 263.5, 228.5, 156, bold);
	page.drawImage(qrImage, { x: 273, y: 169, width: 53, height: 53 });
	drawWrapped(page, label.orderNumber, 335, 213, 76, bold, 8, 2, 9);
	page.drawText('Order Ref', { x: 335, y: 196, size: 6, font: regular });
	page.drawText(formatDate(label.createdAt), { x: 335, y: 181, size: 7, font: bold });
	page.drawText('Order Date', { x: 335, y: 171, size: 6, font: regular });

	// Shipment row.
	drawBox(page, 12, 107, 408, 48);
	drawSectionHeader(page, 'SHIPMENT INFORMATION', 12.5, 140.5, 407, bold);
	const shipmentColumns = [
		{ label: 'Pieces', value: String(label.pieces), x: 18, width: 36 },
		{ label: 'Destination', value: label.destination, x: 62, width: 69 },
		{ label: 'Origin', value: label.origin, x: 140, width: 60 },
		{ label: 'Payment', value: label.paymentMethod, x: 209, width: 92 },
		{ label: 'Tracking No.', value: label.trackingNumber, x: 310, width: 102 }
	];
	shipmentColumns.forEach((column, index) => {
		if (index) {
			page.drawLine({
				start: { x: column.x - 5, y: 107 },
				end: { x: column.x - 5, y: 140.5 },
				thickness: 0.5,
				color: rgb(0.55, 0.55, 0.55)
			});
		}
		page.drawText(column.label, { x: column.x, y: 128, size: 5.5, font: regular });
		drawWrapped(page, column.value, column.x, 116, column.width, bold, 7, 2, 8);
	});

	// Shipper and order details.
	drawBox(page, 12, 12, 148, 89);
	drawSectionHeader(page, 'SHIPPER INFORMATION', 12.5, 86.5, 147, bold);
	page.drawText(pdfSafe(label.storeName), { x: 18, y: 72, size: 8, font: bold });
	page.drawText('Online Store Dispatch', { x: 18, y: 60, size: 6.5, font: regular });
	page.drawText(pdfSafe(label.origin), { x: 18, y: 49, size: 6.5, font: regular });
	page.drawText(`Contact: ${pdfSafe(label.storePhone)}`, { x: 18, y: 35, size: 6.5, font: bold });
	drawWrapped(page, label.storeEmail, 18, 23, 135, regular, 6.2, 1);

	drawBox(page, 166, 12, 254, 89);
	drawSectionHeader(page, 'ORDER DETAILS', 166.5, 86.5, 253, bold);
	const itemLines = label.items.map((item) => {
		const variant = [item.color, item.size].filter(Boolean).join(' / ');
		return `${item.quantity}x ${item.name}${variant ? ` (${variant})` : ''}`;
	});
	itemLines.slice(0, 3).forEach((item, index) => {
		drawWrapped(page, item, 173, 73 - index * 13, 154, regular, 6.5, 1);
	});
	if (itemLines.length > 3) {
		page.drawText(`+ ${itemLines.length - 3} more item(s)`, { x: 173, y: 34, size: 6, font: bold });
	}
	page.drawLine({ start: { x: 335, y: 12 }, end: { x: 335, y: 86.5 }, thickness: 0.5 });
	page.drawText('COD AMOUNT', { x: 344, y: 70, size: 6, font: regular });
	page.drawText(`Rs. ${Math.round(label.amount).toLocaleString('en-PK')}`, {
		x: 344,
		y: 54,
		size: 11,
		font: bold
	});
	page.drawText('ORDER TYPE', { x: 344, y: 37, size: 6, font: regular });
	page.drawText(label.paymentMethod === 'Cash on Delivery' ? 'NORMAL / COD' : 'PREPAID', {
		x: 344,
		y: 23,
		size: 7,
		font: bold
	});

	return pdf.save();
};

const htmlSafe = (value: unknown) =>
	clean(value)
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#039;');

export const buildPrintableOrderLabelHtml = async (label: OrderLabel) => {
	const { barcode, qr } = await createOrderLabelCodes(label);
	const barcodeSrc = `data:image/png;base64,${barcode.toString('base64')}`;
	const qrSrc = `data:image/png;base64,${qr.toString('base64')}`;
	const itemLines = label.items.slice(0, 3).map((item) => {
		const variant = [item.color, item.size].filter(Boolean).join(' / ');
		return `<div>${item.quantity}&times; ${htmlSafe(item.name)}${variant ? ` <small>(${htmlSafe(variant)})</small>` : ''}</div>`;
	});
	if (label.items.length > 3)
		itemLines.push(`<div><b>+ ${label.items.length - 3} more item(s)</b></div>`);

	return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Shipping Label ${htmlSafe(label.orderNumber)}</title>
<style>
@page{size:6in 4in;margin:0}*{box-sizing:border-box}html,body{margin:0;background:#fff;color:#111;font-family:Arial,Helvetica,sans-serif}body{width:6in;height:4in;padding:.16in}.label{width:100%;height:100%;font-size:8px}.top{height:.5in;display:flex;align-items:flex-start;border-bottom:1.5px solid #111}.brand{flex:1;font-size:18px;font-weight:800;line-height:1}.brand small{display:block;margin-top:5px;font-size:7px;letter-spacing:1.4px}.barcode{text-align:center;width:2.55in}.barcode img{display:block;width:100%;height:.27in;object-fit:fill}.barcode b{font-size:7px}.grid{display:grid;grid-template-columns:1.57fr 1fr;gap:.07in;margin-top:.06in}.box{border:1px solid #444;overflow:hidden}.head{height:.2in;padding:.045in .07in;background:#ddd;font-weight:800;letter-spacing:.3px}.consignee,.order{height:1.03in}.rows{padding:.07in;line-height:1.35}.row{display:grid;grid-template-columns:.55in 1fr;margin-bottom:.035in}.row span{color:#444}.row b{font-size:9px}.orderbody{display:flex;gap:.08in;padding:.07in}.orderbody img{width:.63in;height:.63in}.orderbody strong{font-size:9px}.shipment{height:.65in;margin-top:.07in}.shipgrid{display:grid;grid-template-columns:.5fr 1fr .8fr 1.25fr 1.35fr;height:.44in}.shipcell{padding:.05in .07in;border-right:1px solid #999}.shipcell:last-child{border:0}.shipcell span{display:block;color:#444}.shipcell b{display:block;margin-top:3px;font-size:8px}.bottom{display:grid;grid-template-columns:1.05fr 1.8fr;gap:.07in;margin-top:.07in}.bottom .box{height:1.18in}.shipper{padding:.08in;line-height:1.45}.shipper b{display:block;font-size:9px}.details{display:grid;grid-template-columns:1.7fr .85fr;height:.98in}.items{padding:.07in;line-height:1.55}.items small{color:#333}.totals{border-left:1px solid #888;padding:.08in}.totals span{display:block;color:#444;font-size:7px}.totals strong{display:block;margin:.04in 0 .12in;font-size:13px}.totals b{display:block;margin-top:.04in;font-size:8px}@media screen{body{margin:24px auto;box-shadow:0 10px 35px #0002}}@media print{body{padding:.16in;box-shadow:none}}
</style>
</head>
<body>
<main class="label">
<div class="top"><div class="brand">${htmlSafe(label.storeName).toUpperCase()}<small>SHIPPING LABEL</small></div><div class="barcode"><img src="${barcodeSrc}" alt="Tracking barcode"><b>${htmlSafe(label.trackingNumber)}</b></div></div>
<div class="grid"><section class="box consignee"><div class="head">CONSIGNEE INFORMATION</div><div class="rows"><div class="row"><span>Name:</span><b>${htmlSafe(label.customerName)}</b></div><div class="row"><span>Contact:</span><b>${htmlSafe(label.customerPhone)}</b></div><div class="row"><span>Delivery:</span><b>${htmlSafe(label.deliveryAddress)}</b></div></div></section><section class="box order"><div class="head">ORDER INFORMATION</div><div class="orderbody"><img src="${qrSrc}" alt="Order QR code"><div><strong>${htmlSafe(label.orderNumber)}</strong><br><small>Order Ref</small><br><br><b>${htmlSafe(formatDate(label.createdAt))}</b><br><small>Order Date</small></div></div></section></div>
<section class="box shipment"><div class="head">SHIPMENT INFORMATION</div><div class="shipgrid"><div class="shipcell"><span>Pieces</span><b>${label.pieces}</b></div><div class="shipcell"><span>Destination</span><b>${htmlSafe(label.destination)}</b></div><div class="shipcell"><span>Origin</span><b>${htmlSafe(label.origin)}</b></div><div class="shipcell"><span>Payment</span><b>${htmlSafe(label.paymentMethod)}</b></div><div class="shipcell"><span>Tracking No.</span><b>${htmlSafe(label.trackingNumber)}</b></div></div></section>
<div class="bottom"><section class="box"><div class="head">SHIPPER INFORMATION</div><div class="shipper"><b>${htmlSafe(label.storeName)}</b>Online Store Dispatch<br>${htmlSafe(label.origin)}<br><b>Contact: ${htmlSafe(label.storePhone)}</b>${htmlSafe(label.storeEmail)}</div></section><section class="box"><div class="head">ORDER DETAILS</div><div class="details"><div class="items">${itemLines.join('')}</div><div class="totals"><span>COD AMOUNT</span><strong>Rs. ${Math.round(label.amount).toLocaleString('en-PK')}</strong><span>ORDER TYPE</span><b>${label.paymentMethod === 'Cash on Delivery' ? 'NORMAL / COD' : 'PREPAID'}</b></div></div></section></div>
</main>
<script>window.addEventListener('load',()=>setTimeout(()=>window.print(),180));<\/script>
</body>
</html>`;
};
