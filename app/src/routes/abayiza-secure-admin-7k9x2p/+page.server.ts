import prisma from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [orders, customerCount, productCount, categoryCount] = await Promise.all([
		prisma.order.findMany({
			orderBy: { createdAt: 'desc' },
			include: { user: true }
		}),
		prisma.user.count({ where: { role: 'CUSTOMER' } }),
		prisma.product.count(),
		prisma.collection.count()
	]);

	const totalOrders = orders.length;
	const totalSales = orders.reduce((acc: number, order: any) => acc + Number(order.totalAmount), 0);
	const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

	const recentOrders = orders.slice(0, 5).map((o: any) => ({
		id: o.id,
		shortId: o.id.slice(-6),
		customerName: o.user ? `${o.user.firstName} ${o.user.lastName}` : 'Guest',
		status: o.status,
		total: Number(o.totalAmount)
	}));

	// Top Products (Simplification: fetch active products)
	const topProducts = await prisma.product.findMany({
		where: { isActive: true },
		take: 4,
		include: {
			images: { orderBy: { displayOrder: 'asc' } },
			variants: true
		}
	});

	// Low Stock Alerts (variants with < 10 stock)
	const lowStockVariants = await prisma.productVariant.findMany({
		where: { stockCount: { lt: 10 } },
		include: { product: { include: { images: { orderBy: { displayOrder: 'asc' } } } } },
		take: 5
	});

	return {
		stats: {
			totalOrders,
			totalSales,
			averageOrderValue
		},
		recentOrders,
		topProducts: topProducts.map((p: any) => ({
			id: p.id,
			name: p.name,
			image: p.images[0]?.url || '',
			price: Number(p.price),
			salePrice: p.salePrice ? Number(p.salePrice) : null,
			inventory: p.variants.reduce((acc: number, variant: any) => acc + variant.stockCount, 0)
		})),
		lowStockVariants: lowStockVariants.map((v: any) => ({
			id: v.id,
			productName: v.product.name,
			sku: v.sku,
			size: v.size,
			stockCount: v.stockCount,
			image: v.product.images[0]?.url || ''
		})),
		meta: {
			customerCount,
			productCount,
			categoryCount
		}
	};
};
