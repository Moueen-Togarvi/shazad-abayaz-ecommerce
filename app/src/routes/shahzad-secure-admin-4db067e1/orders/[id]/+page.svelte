<script lang="ts">
	import { formatMoney } from '$lib/shared/money';
	import { Badge, Button, Card, Modal, PageHeader, orderStatus } from '$lib/components/admin/ui';

	let { data, form } = $props();
	let order = $derived(data.order as any);
	let address = $derived((order.shippingAddress || {}) as Record<string, string>);
	let showCancelModal = $state(false);

	const actionDisabled = (status: string) =>
		order.status === status || order.status === 'DELIVERED' || order.status === 'CANCELLED';
	const backHref = $derived(
		order.status === 'DELIVERED'
			? '/shahzad-secure-admin-4db067e1/orders/completed'
			: order.status === 'CANCELLED'
				? '/shahzad-secure-admin-4db067e1/orders/cancelled'
				: '/shahzad-secure-admin-4db067e1/orders'
	);
	const status = $derived(orderStatus(order.status));
	const labelBase = $derived(`/shahzad-secure-admin-4db067e1/orders/${order.id}/shipping-label`);
</script>

<svelte:head>
	<title>Order {order.orderNumber} | Shahzad Abaya's Admin</title>
</svelte:head>

<div class="mx-auto max-w-7xl pb-12">
	<PageHeader
		title={order.orderNumber}
		subtitle={`Placed ${new Date(order.createdAt).toLocaleString()} · ${order.items.length} item${order.items.length === 1 ? '' : 's'}`}
		{backHref}
	>
		{#snippet actions()}
			<Button href={`${labelBase}.pdf`} variant="secondary" download>
				<svg
					class="h-4 w-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					aria-hidden="true"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14"
					/>
				</svg>
				Download PDF
			</Button>
			<Button href={`${labelBase}/print`} variant="primary" target="_blank" rel="noreferrer">
				<svg
					class="h-4 w-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					aria-hidden="true"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 9V3h12v6M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2m-10-4h12v7H6v-7z"
					/>
				</svg>
				Print Label
			</Button>
			<Badge tone={status.tone}>{status.label}</Badge>
			<Badge tone="neutral">Cash on Delivery</Badge>
		{/snippet}
	</PageHeader>

	{#if form?.error}
		<div class="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
			{form.error}
		</div>
	{/if}

	<!-- Status actions -->
	<Card class="mb-6" bodyClass="p-4">
		<div class="flex flex-wrap items-center gap-2">
			<span class="mr-1 text-sm font-medium text-gray-600">Update status:</span>
			<form method="POST" action="?/updateStatus">
				<input type="hidden" name="status" value="PROCESSING" />
				<Button type="submit" variant="secondary" size="sm" disabled={actionDisabled('PROCESSING')}>
					In Progress
				</Button>
			</form>
			<form method="POST" action="?/updateStatus">
				<input type="hidden" name="status" value="DELIVERED" />
				<Button
					type="submit"
					variant="primary"
					size="sm"
					class="bg-emerald-600 hover:bg-emerald-700"
					disabled={actionDisabled('DELIVERED')}
				>
					Mark Complete
				</Button>
			</form>
			<Button
				variant="danger"
				size="sm"
				disabled={order.status === 'DELIVERED' || order.status === 'CANCELLED'}
				onclick={() => (showCancelModal = true)}
			>
				Cancel Order
			</Button>
		</div>
	</Card>

	<!-- Summary cards -->
	<div class="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
		<div class="rounded-xl border border-admin-border bg-white p-4 shadow-sm">
			<p class="text-xs font-medium tracking-wide text-gray-400 uppercase">Total</p>
			<p class="mt-1.5 text-xl font-semibold text-gray-900">{formatMoney(order.totalAmount)}</p>
		</div>
		<div class="rounded-xl border border-admin-border bg-white p-4 shadow-sm">
			<p class="text-xs font-medium tracking-wide text-gray-400 uppercase">Customer</p>
			<p class="mt-1.5 truncate text-sm font-semibold text-gray-900">{order.customerName}</p>
		</div>
		<div class="rounded-xl border border-admin-border bg-white p-4 shadow-sm">
			<p class="text-xs font-medium tracking-wide text-gray-400 uppercase">Mobile</p>
			<p class="mt-1.5 truncate text-sm font-semibold text-gray-900">
				{order.customerPhone || '—'}
			</p>
		</div>
		<div class="rounded-xl border border-admin-border bg-white p-4 shadow-sm">
			<p class="text-xs font-medium tracking-wide text-gray-400 uppercase">City</p>
			<p class="mt-1.5 truncate text-sm font-semibold text-gray-900">
				{order.customerCity || '—'}
			</p>
		</div>
	</div>

	<div class="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_23rem]">
		<div class="space-y-6">
			<!-- Items -->
			<Card title="Items in this order">
				{#snippet header()}
					<Badge tone="neutral"
						>{order.items.length} item{order.items.length === 1 ? '' : 's'}</Badge
					>
				{/snippet}

				<div class="-m-6 divide-y divide-admin-border">
					{#each order.items as item (item.id)}
						<div class="grid gap-4 p-5 md:grid-cols-[7.5rem_1fr_auto] md:items-center">
							<div
								class="h-36 overflow-hidden rounded-xl border border-admin-border bg-gray-100 md:h-32"
							>
								{#if item.image}
									<img
										src={item.image}
										alt={item.productName}
										class="h-full w-full object-cover object-center"
									/>
								{:else}
									<div
										class="flex h-full items-center justify-center text-xs font-medium text-gray-400"
									>
										No image
									</div>
								{/if}
							</div>
							<div class="min-w-0">
								<p class="font-medium text-gray-900">{item.productName}</p>
								<div class="mt-2 flex flex-wrap gap-2">
									{#if item.variantColor}
										<Badge tone="neutral">{item.variantColor}</Badge>
									{/if}
									{#if item.variantSize}
										<Badge tone="neutral">{item.variantSize}</Badge>
									{/if}
									<Badge tone="neutral">Qty {item.quantity}</Badge>
								</div>
							</div>
							<div class="text-left md:text-right">
								<p class="text-sm text-gray-400">{formatMoney(item.priceAtPurchase)} each</p>
								<p class="mt-1 text-lg font-semibold text-gray-900">
									{formatMoney(item.lineTotal)}
								</p>
							</div>
						</div>
					{/each}
				</div>
			</Card>

			<!-- Payment -->
			<Card title="Payment summary">
				{#snippet header()}
					<Badge tone={order.isPaid ? 'success' : 'warning'}>
						{order.isPaid ? 'Paid' : 'Unpaid'}
					</Badge>
				{/snippet}

				<div class="space-y-2.5 text-sm">
					<div class="flex justify-between text-gray-600">
						<span>Subtotal</span><span>{formatMoney(order.subtotal)}</span>
					</div>
					<div class="flex justify-between text-gray-600">
						<span>Shipping</span><span>{formatMoney(order.shippingCost)}</span>
					</div>
					<div
						class="flex justify-between border-t border-admin-border pt-3 text-base font-semibold text-gray-900"
					>
						<span>Total due</span><span>{formatMoney(order.totalAmount)}</span>
					</div>
				</div>
			</Card>
		</div>

		<aside class="space-y-6">
			<!-- Shipping label -->
			<Card title="Shipping label">
				<div class="rounded-xl border border-dashed border-admin-border bg-gray-50 p-4">
					<div class="flex items-start gap-3">
						<div
							class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-gray-700 shadow-sm"
						>
							<svg
								class="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="1.8"
									d="M3 5v14M7 5v14M10 5v14M14 5v14M16 5v14M21 5v14"
								/>
							</svg>
						</div>
						<div>
							<p class="text-sm font-semibold text-gray-900">Ready automatically</p>
							<p class="mt-1 text-xs leading-5 text-gray-500">
								Includes the order barcode, QR code, address, items and COD amount.
							</p>
						</div>
					</div>
					<div class="mt-4 grid grid-cols-2 gap-2">
						<Button href={`${labelBase}.pdf`} variant="secondary" size="sm" download
							>Download</Button
						>
						<Button
							href={`${labelBase}/print`}
							variant="primary"
							size="sm"
							target="_blank"
							rel="noreferrer">Print</Button
						>
					</div>
				</div>
			</Card>

			<!-- Customer -->
			<Card title="Customer">
				<div class="space-y-3 text-sm text-gray-600">
					<div>
						<p class="text-xs font-medium tracking-wide text-gray-400 uppercase">Name</p>
						<p class="mt-0.5 font-medium text-gray-900">{order.customerName}</p>
					</div>
					<div>
						<p class="text-xs font-medium tracking-wide text-gray-400 uppercase">Email</p>
						<p class="mt-0.5 font-medium break-all text-gray-900">
							{order.customerEmail || 'No email saved'}
						</p>
					</div>
					<div>
						<p class="text-xs font-medium tracking-wide text-gray-400 uppercase">Mobile</p>
						<p class="mt-0.5 font-medium text-gray-900">
							{order.customerPhone || 'No phone saved'}
						</p>
					</div>
				</div>
			</Card>

			<!-- Delivery address -->
			<Card title="Delivery address">
				<div class="space-y-3 text-sm">
					<div>
						<p class="text-xs font-medium tracking-wide text-gray-400 uppercase">Name</p>
						<p class="mt-0.5 font-medium text-gray-900">
							{address.firstName || '—'}
							{address.lastName || ''}
						</p>
					</div>
					<div>
						<p class="text-xs font-medium tracking-wide text-gray-400 uppercase">Address</p>
						<p class="mt-0.5 leading-6 text-gray-700">{address.addressLine1 || '—'}</p>
						{#if address.addressLine2}
							<p class="leading-6 text-gray-700">{address.addressLine2}</p>
						{/if}
					</div>
					<div class="grid grid-cols-2 gap-3">
						<div>
							<p class="text-xs font-medium tracking-wide text-gray-400 uppercase">City</p>
							<p class="mt-0.5 font-medium text-gray-900">{address.city || '—'}</p>
						</div>
						<div>
							<p class="text-xs font-medium tracking-wide text-gray-400 uppercase">Postal</p>
							<p class="mt-0.5 font-medium text-gray-900">{address.postalCode || '—'}</p>
						</div>
					</div>
					<div class="grid grid-cols-2 gap-3">
						<div>
							<p class="text-xs font-medium tracking-wide text-gray-400 uppercase">Country</p>
							<p class="mt-0.5 font-medium text-gray-900">{address.country || '—'}</p>
						</div>
						<div>
							<p class="text-xs font-medium tracking-wide text-gray-400 uppercase">Mobile</p>
							<p class="mt-0.5 font-medium text-gray-900">{address.phone || '—'}</p>
						</div>
					</div>
				</div>
			</Card>

			<!-- Fulfillment -->
			<Card title="Fulfillment">
				<div class="space-y-3 text-sm">
					<div class="flex items-center justify-between">
						<span class="text-gray-500">Tracking</span>
						<span class="font-medium text-gray-900">{order.trackingNumber || 'Not assigned'}</span>
					</div>
					<div class="flex items-center justify-between">
						<span class="text-gray-500">Status</span>
						<Badge tone={status.tone}>{status.label}</Badge>
					</div>
					<div class="flex items-center justify-between">
						<span class="text-gray-500">Updated</span>
						<span class="font-medium text-gray-900"
							>{new Date(order.updatedAt).toLocaleDateString()}</span
						>
					</div>
				</div>
			</Card>
		</aside>
	</div>
</div>

<Modal
	open={showCancelModal}
	title="Cancel this order?"
	description="Order {order.orderNumber} will move from active orders to cancelled orders. You can review it later from the cancelled orders page."
	onClose={() => (showCancelModal = false)}
>
	{#snippet actions()}
		<Button variant="secondary" onclick={() => (showCancelModal = false)}>Keep Order</Button>
		<form method="POST" action="?/updateStatus">
			<input type="hidden" name="status" value="CANCELLED" />
			<Button type="submit" variant="primary" class="bg-red-600 hover:bg-red-700">
				Yes, Cancel Order
			</Button>
		</form>
	{/snippet}
</Modal>
