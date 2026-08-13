<script lang="ts">
	import { cart } from '$lib/client/cart.svelte';
	import { trackPurchaseOnce } from '$lib/client/pixels';
	import { cloudinaryUrl } from '$lib/shared/cloudinary-image';
	import { formatMoney } from '$lib/shared/money';
	import { onMount } from 'svelte';

	let { data } = $props();
	let order = $derived(data.order as any);
	let address = $derived((order?.shippingAddress || {}) as Record<string, string>);

	const formatDateTime = (value: string) =>
		new Date(value).toLocaleString('en-PK', {
			day: '2-digit',
			month: 'short',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});

	onMount(() => {
		if (!order) return;

		trackPurchaseOnce(order.id, {
			content_type: 'product',
			content_ids: order.items.map((item: any) => item.productId),
			contents: order.items.map((item: any) => ({
				id: item.productId,
				quantity: item.quantity,
				item_price: Number(item.priceAtPurchase || item.lineTotal / Math.max(item.quantity, 1))
			})),
			num_items: order.items.reduce(
				(total: number, item: any) => total + Number(item.quantity || 0),
				0
			),
			value: Number(order.totalAmount || 0),
			currency: String(order.currency || 'PKR'),
			order_id: order.id,
			transaction_id: order.orderNumber || order.id
		});
		cart.clear();
	});
</script>

<svelte:head>
	<title>Order Received | Shahzad Abaya's</title>
</svelte:head>

<div class="min-h-screen bg-white px-4 py-14">
	{#if order}
		<div class="mx-auto max-w-5xl">
			<div
				class="mx-auto mb-8 max-w-sm rounded-2xl bg-white p-7 text-center shadow-[0_24px_80px_rgba(20,53,45,0.10)]"
			>
				<div
					class="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#c5a880]"
				>
					<svg
						class="h-7 w-7"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.8"
							d="M5 13l4 4L19 7"
						/>
					</svg>
				</div>
				<h1 class="text-xl font-black text-[#0a0a0a]">Thank you!</h1>
				<p class="mt-1 text-xs leading-5 text-gray-500">Your order has been placed successfully.</p>

				<div class="relative my-6 border-t border-dashed border-gray-300">
					<span class="absolute top-1/2 -left-10 h-8 w-8 -translate-y-1/2 rounded-full bg-white"
					></span>
					<span class="absolute top-1/2 -right-10 h-8 w-8 -translate-y-1/2 rounded-full bg-white"
					></span>
				</div>

				<div class="grid grid-cols-2 gap-5 text-left">
					<div>
						<p class="text-[0.65rem] font-bold tracking-[0.16em] text-gray-400 uppercase">Order</p>
						<p class="mt-1 text-sm font-black text-[#0a0a0a]">{order.orderNumber}</p>
					</div>
					<div class="text-right">
						<p class="text-[0.65rem] font-bold tracking-[0.16em] text-gray-400 uppercase">Amount</p>
						<p class="mt-1 text-sm font-black text-[#0a0a0a]">{formatMoney(order.totalAmount)}</p>
					</div>
					<div class="col-span-2">
						<p class="text-[0.65rem] font-bold tracking-[0.16em] text-gray-400 uppercase">
							Date & time
						</p>
						<p class="mt-1 text-sm font-black text-[#0a0a0a]">{formatDateTime(order.createdAt)}</p>
					</div>
				</div>
			</div>

			<div class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
				<section class="rounded-2xl bg-white p-6 shadow-[0_20px_70px_rgba(20,53,45,0.08)]">
					<div class="mb-5 flex items-center justify-between gap-4 border-b border-gray-100 pb-4">
						<div>
							<p class="text-xs font-bold tracking-[0.16em] text-[#a8895f] uppercase">
								Order details
							</p>
							<h2 class="mt-1 font-serif text-2xl text-[#0a0a0a]">Cash on Delivery</h2>
						</div>
						<span class="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-800">
							{order.status}
						</span>
					</div>

					<div class="space-y-4">
						{#each order.items as item}
							<div class="flex items-center gap-4 rounded-xl border border-gray-100 p-3">
								<div class="h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100">
									{#if item.image}
										<img
											src={cloudinaryUrl(item.image, 160)}
											alt={item.productName}
											width="56"
											height="64"
											loading="lazy"
											decoding="async"
											class="h-full w-full object-cover"
										/>
									{/if}
								</div>
								<div class="min-w-0 flex-1">
									<p class="font-medium text-[#0a0a0a]">{item.productName}</p>
									<p class="mt-1 text-xs text-gray-500">
										{[item.variantColor, item.variantSize].filter(Boolean).join(' / ') ||
											"Shahzad Abaya's"} x
										{item.quantity}
									</p>
								</div>
								<p class="text-sm font-black text-[#0a0a0a]">{formatMoney(item.lineTotal)}</p>
							</div>
						{/each}
					</div>

					<div class="mt-6 space-y-2 border-t border-gray-100 pt-5 text-sm">
						<div class="flex justify-between text-gray-500">
							<span>Subtotal</span>
							<span>{formatMoney(order.subtotal)}</span>
						</div>
						<div class="flex justify-between text-gray-500">
							<span>Shipping</span>
							<span>{order.shippingCost === 0 ? 'Free' : formatMoney(order.shippingCost)}</span>
						</div>
						<div class="flex justify-between text-gray-500">
							<span>Discount</span>
							<span>{formatMoney(order.discountTotal)}</span>
						</div>
						<div class="flex justify-between pt-3 text-base font-black text-[#0a0a0a]">
							<span>Total</span>
							<span>{formatMoney(order.totalAmount)}</span>
						</div>
					</div>
				</section>

				<aside class="space-y-6">
					<section class="rounded-2xl bg-white p-6 shadow-[0_20px_70px_rgba(20,53,45,0.08)]">
						<p class="text-xs font-bold tracking-[0.16em] text-[#a8895f] uppercase">Customer</p>
						<h2 class="mt-2 font-serif text-xl text-[#0a0a0a]">{order.customerName}</h2>
						<div class="mt-4 space-y-2 text-sm text-gray-600">
							<p>{order.customerEmail}</p>
							<p>{order.customerPhone}</p>
						</div>
					</section>

					<section class="rounded-2xl bg-white p-6 shadow-[0_20px_70px_rgba(20,53,45,0.08)]">
						<p class="text-xs font-bold tracking-[0.16em] text-[#a8895f] uppercase">
							Shipping address
						</p>
						<div class="mt-4 space-y-3 text-sm">
							<div>
								<p class="text-[0.68rem] font-black tracking-[0.12em] text-gray-400 uppercase">
									Name
								</p>
								<p class="mt-1 font-medium text-[#0a0a0a]">
									{address.firstName || '-'}
									{address.lastName || ''}
								</p>
							</div>
							<div>
								<p class="text-[0.68rem] font-black tracking-[0.12em] text-gray-400 uppercase">
									Address
								</p>
								<p class="mt-1 leading-6 text-gray-600">{address.addressLine1 || '-'}</p>
								{#if address.addressLine2}<p class="leading-6 text-gray-600">
										{address.addressLine2}
									</p>{/if}
							</div>
							<div class="grid grid-cols-2 gap-3">
								<div>
									<p class="text-[0.68rem] font-black tracking-[0.12em] text-gray-400 uppercase">
										City
									</p>
									<p class="mt-1 font-medium text-[#0a0a0a]">{address.city || '-'}</p>
								</div>
								<div>
									<p class="text-[0.68rem] font-black tracking-[0.12em] text-gray-400 uppercase">
										Postal Code
									</p>
									<p class="mt-1 font-medium text-[#0a0a0a]">{address.postalCode || '-'}</p>
								</div>
							</div>
							<div class="grid grid-cols-2 gap-3">
								<div>
									<p class="text-[0.68rem] font-black tracking-[0.12em] text-gray-400 uppercase">
										Country
									</p>
									<p class="mt-1 font-medium text-[#0a0a0a]">{address.country || '-'}</p>
								</div>
								<div>
									<p class="text-[0.68rem] font-black tracking-[0.12em] text-gray-400 uppercase">
										Mobile
									</p>
									<p class="mt-1 font-medium text-[#0a0a0a]">
										{address.phone || order.customerPhone || '-'}
									</p>
								</div>
							</div>
						</div>
					</section>
				</aside>
			</div>

			<div class="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
				<a
					href="/shop"
					class="rounded-full bg-[#0a0a0a] px-8 py-4 text-center text-sm font-black tracking-[0.08em] text-white uppercase transition-colors hover:bg-[#c5a880] hover:text-[#0a0a0a]"
				>
					Continue Shopping
				</a>
				<a
					href="/track"
					class="rounded-full border border-[#0a0a0a] px-8 py-4 text-center text-sm font-black tracking-[0.08em] text-[#0a0a0a] uppercase transition-colors hover:bg-white"
				>
					Track Order
				</a>
			</div>
		</div>
	{:else}
		<div
			class="mx-auto max-w-md rounded-2xl bg-white p-8 text-center shadow-[0_24px_80px_rgba(20,53,45,0.10)]"
		>
			<h1 class="font-serif text-3xl text-[#0a0a0a]">Order not found</h1>
			<p class="mt-3 text-sm leading-6 text-gray-500">
				Use the checkout flow again or contact support with your order number.
			</p>
			<a
				href="/shop"
				class="mt-6 inline-flex rounded-full bg-[#0a0a0a] px-7 py-3 text-sm font-black text-white"
			>
				Continue Shopping
			</a>
		</div>
	{/if}
</div>
