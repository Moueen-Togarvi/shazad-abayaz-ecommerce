<script lang="ts">
	import { formatMoney } from '$lib/shared/money';

	let { data } = $props();
	let dateRange = $state('All time');
</script>

<div class="mx-auto max-w-7xl">
	<div class="mb-6 flex items-center justify-between">
		<h1 class="text-2xl font-bold text-gray-900">Analytics</h1>
		<select
			bind:value={dateRange}
			class="rounded-md border-gray-300 text-sm shadow-sm focus:border-[#000] focus:ring-[#000]"
		>
			<option>All time</option>
			<option>Today</option>
			<option>Last 7 days</option>
			<option>Last 30 days</option>
		</select>
	</div>

	<div class="mb-8 grid grid-cols-2 gap-5 lg:grid-cols-4">
		{#each [{ label: 'Total Revenue', value: formatMoney(data.kpis.revenue), color: 'orange' }, { label: 'Total Orders', value: data.kpis.orders, color: 'blue' }, { label: 'Customers', value: data.kpis.customers, color: 'red' }, { label: 'Avg. Order Value', value: formatMoney(data.kpis.averageOrderValue), color: 'yellow' }] as kpi}
			<div class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
				<p class="mb-2 text-xs font-medium tracking-wider text-gray-500 uppercase">{kpi.label}</p>
				<p class="mb-1 text-2xl font-bold text-gray-900">{kpi.value}</p>
				<p class="text-sm font-medium text-gray-500">From saved database records</p>
			</div>
		{/each}
	</div>

	<div class="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
		<div class="rounded-lg border border-gray-200 bg-white shadow-sm lg:col-span-2">
			<div class="flex items-center justify-between border-b border-gray-200 px-6 py-5">
				<h3 class="font-medium text-gray-900">Revenue Overview</h3>
				<span class="text-xs font-semibold text-gray-500">{dateRange}</span>
			</div>
			<div class="flex h-64 items-center justify-center rounded-b-lg bg-gray-50 p-6">
				<div class="text-center">
					<svg
						class="mx-auto h-12 w-12 text-gray-300"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
						/>
					</svg>
					<p class="mt-2 text-sm text-gray-500">
						Revenue charts will populate after orders are saved.
					</p>
				</div>
			</div>
		</div>

		<div class="rounded-lg border border-gray-200 bg-white shadow-sm">
			<div class="border-b border-gray-200 px-6 py-5">
				<h3 class="font-medium text-gray-900">Catalog Health</h3>
			</div>
			<div class="space-y-4 p-6">
				<div class="flex items-center justify-between">
					<span class="text-sm text-gray-600">Products</span>
					<span class="font-semibold text-gray-900">{data.kpis.products}</span>
				</div>
				<div class="flex items-center justify-between">
					<span class="text-sm text-gray-600">Categories</span>
					<span class="font-semibold text-gray-900">{data.kpis.categories}</span>
				</div>
			</div>
		</div>
	</div>

	<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
		<div class="rounded-lg border border-gray-200 bg-white shadow-sm">
			<div class="border-b border-gray-200 px-6 py-5">
				<h3 class="font-medium text-gray-900">Top Selling Products</h3>
			</div>
			<div class="overflow-x-auto">
				<table class="min-w-full divide-y divide-gray-200">
					<thead class="bg-gray-50">
						<tr>
							<th
								class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
								>Product</th
							>
							<th
								class="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase"
								>Units</th
							>
							<th
								class="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase"
								>Revenue</th
							>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200">
						{#each data.topProducts as product}
							<tr class="hover:bg-gray-50">
								<td class="px-6 py-3 text-sm text-gray-900">{product.name}</td>
								<td class="px-6 py-3 text-right text-sm text-gray-500">{product.units}</td>
								<td class="px-6 py-3 text-right text-sm font-medium text-gray-900">
									{formatMoney(product.revenue)}
								</td>
							</tr>
						{/each}
						{#if data.topProducts.length === 0}
							<tr>
								<td colspan="3" class="px-6 py-8 text-center text-sm text-gray-500">
									No sales data yet.
								</td>
							</tr>
						{/if}
					</tbody>
				</table>
			</div>
		</div>

		<div class="rounded-lg border border-gray-200 bg-white shadow-sm">
			<div class="border-b border-gray-200 px-6 py-5">
				<h3 class="font-medium text-gray-900">Recent Orders</h3>
			</div>
			<div class="overflow-x-auto">
				<table class="min-w-full divide-y divide-gray-200">
					<thead class="bg-gray-50">
						<tr>
							<th
								class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
								>Order</th
							>
							<th
								class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
								>Status</th
							>
							<th
								class="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase"
								>Total</th
							>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200">
						{#each data.recentOrders as order}
							<tr class="hover:bg-gray-50">
								<td class="px-6 py-3 text-sm font-medium text-blue-600">
									<a href={`/abayiza-secure-admin-7k9x2p/orders/${order.id}`}>{order.orderNumber}</a
									>
								</td>
								<td class="px-6 py-3 text-sm text-gray-500">{order.status}</td>
								<td class="px-6 py-3 text-right text-sm font-medium text-gray-900">
									{formatMoney(order.totalAmount)}
								</td>
							</tr>
						{/each}
						{#if data.recentOrders.length === 0}
							<tr>
								<td colspan="3" class="px-6 py-8 text-center text-sm text-gray-500">
									No orders saved yet.
								</td>
							</tr>
						{/if}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
