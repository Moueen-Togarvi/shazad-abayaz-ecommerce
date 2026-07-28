<script lang="ts">
	import { formatMoney } from '$lib/shared/money';
	import { Badge, Card, EmptyState, PageHeader, StatCard, Table, orderStatus } from '$lib/components/admin/ui';

	let { data } = $props();
	let selectedDateRange = $state('Last 7 days');
</script>

<div class="mx-auto max-w-7xl">
	<PageHeader title="Dashboard" subtitle="A quick look at how your store is performing.">
		{#snippet actions()}
			<div class="relative">
				<select
					bind:value={selectedDateRange}
					class="block rounded-lg border border-admin-border bg-white px-3 py-2.5 pr-8 text-sm text-gray-700 shadow-sm transition-colors focus:border-admin-primary focus:ring-2 focus:ring-admin-primary/20 focus:outline-none"
				>
					<option>Today</option>
					<option>Yesterday</option>
					<option>Last 7 days</option>
					<option>Last 30 days</option>
					<option>This month</option>
				</select>
			</div>
		{/snippet}
	</PageHeader>

	<!-- Stats Grid -->
	<div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
		<StatCard
			label="Total Sales"
			value={formatMoney(data.stats.totalSales)}
			tone="amber"
		>
			{#snippet icon()}
				<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
			{/snippet}
		</StatCard>

		<StatCard label="Total Orders" value={data.stats.totalOrders} tone="blue">
			{#snippet icon()}
				<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
					/>
				</svg>
			{/snippet}
		</StatCard>

		<StatCard
			label="Products In DB"
			value={data.meta.productCount}
			sub={`${data.meta.categoryCount} categories`}
			tone="emerald"
		>
			{#snippet icon()}
				<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
					/>
				</svg>
			{/snippet}
		</StatCard>

		<StatCard
			label="Avg. Order Value"
			value={formatMoney(data.stats.averageOrderValue)}
			tone="neutral"
		>
			{#snippet icon()}
				<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
					/>
				</svg>
			{/snippet}
		</StatCard>
	</div>

	<!-- Chart & Top Products -->
	<div class="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
		<Card title="Revenue" class="lg:col-span-2" bodyClass="p-0">
			<div class="flex h-80 items-center justify-center p-6">
				<div class="text-center">
					<div
						class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-300"
					>
						<svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.8"
								d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
							/>
						</svg>
					</div>
					<p class="mt-3 text-sm font-medium text-gray-500">Revenue chart coming soon</p>
					<p class="text-xs text-gray-400">A charting library will be wired up here.</p>
				</div>
			</div>
		</Card>

		<Card title="Catalog Products">
			{#snippet header()}
				<a
					href="/abayiza-secure-admin-7k9x2p/products"
					class="text-sm font-medium text-admin-primary hover:underline">View all</a
				>
			{/snippet}

			{#if data.topProducts.length}
				<ul class="-m-6 divide-y divide-admin-border">
					{#each data.topProducts as product}
						<li class="flex items-center gap-3 p-4 transition-colors hover:bg-gray-50">
							<div
								class="h-12 w-10 shrink-0 overflow-hidden rounded-md border border-admin-border bg-gray-100"
							>
								<img
									src={product.image}
									alt={product.name}
									class="h-full w-full object-cover"
								/>
							</div>
							<div class="min-w-0 flex-1">
								<p class="truncate text-sm font-medium text-gray-900">{product.name}</p>
								<p class="truncate text-xs text-gray-400">{product.inventory} in stock</p>
							</div>
							<span class="text-sm font-semibold text-gray-700"
								>{formatMoney(product.salePrice || product.price)}</span
							>
						</li>
					{/each}
				</ul>
			{:else}
				<EmptyState title="No products yet" description="Add your first product." />
			{/if}
		</Card>
	</div>

	<!-- Recent Orders & Low Stock -->
	<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
		<Card title="Recent Orders" class="lg:col-span-2">
			{#snippet header()}
				<a
					href="/abayiza-secure-admin-7k9x2p/orders"
					class="text-sm font-medium text-admin-primary hover:underline">View all</a
				>
			{/snippet}

			<Table
				columns={['Order', 'Customer', 'Status', 'Total']}
				isEmpty={data.recentOrders.length === 0}
				emptyTitle="No orders yet"
				colspan={4}
				class="border-0 shadow-none"
			>
				{#each data.recentOrders as order (order.id)}
					<tr class="transition-colors hover:bg-gray-50">
						<td class="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
							<a
								href="/abayiza-secure-admin-7k9x2p/orders/{order.id}"
								class="text-admin-primary hover:underline">#{order.shortId}</a
							>
						</td>
						<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-600">{order.customerName}</td>
						<td class="px-6 py-4 whitespace-nowrap">
							<Badge tone={orderStatus(order.status).tone}>{orderStatus(order.status).label}</Badge>
						</td>
						<td class="px-6 py-4 text-right text-sm font-medium whitespace-nowrap text-gray-900"
							>{formatMoney(order.total)}</td
						>
					</tr>
				{/each}
			</Table>
		</Card>

		<Card title="Inventory Alerts" class="lg:col-span-2">
			{#if data.lowStockVariants.length}
				<ul class="-m-6 divide-y divide-admin-border">
					{#each data.lowStockVariants as variant (variant.id)}
						<li class="flex items-center justify-between gap-3 p-4 transition-colors hover:bg-gray-50">
							<div class="flex items-center gap-3">
								<div
									class="h-10 w-8 shrink-0 overflow-hidden rounded border border-admin-border bg-gray-100"
								>
									<img
										src={variant.image}
										alt={variant.productName}
										class="h-full w-full object-cover"
									/>
								</div>
								<div class="min-w-0">
									<p class="truncate text-sm font-medium text-gray-900">{variant.productName}</p>
									<p class="truncate text-xs text-gray-400">
										SKU: {variant.sku} • Size: {variant.size}
									</p>
								</div>
							</div>
							<div class="flex items-center gap-3">
								<Badge tone="danger">Only {variant.stockCount} left</Badge>
							</div>
						</li>
					{/each}
				</ul>
			{:else}
				<EmptyState title="Inventory is healthy" description="No low-stock alerts right now." />
			{/if}
		</Card>
	</div>
</div>
