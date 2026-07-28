<script lang="ts">
	import { formatMoney } from '$lib/shared/money';

	let { data } = $props();
	let orders = $derived(data.orders || []);
	let filters = $derived(data.filters || {});
</script>

<div class="mx-auto max-w-7xl">
	<div class="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
		<div>
			<h1 class="text-2xl font-bold text-gray-900">Completed Orders</h1>
			<p class="mt-1 text-sm text-gray-500">Orders marked Complete are saved here.</p>
		</div>
		<a
			href="/abayiza-secure-admin-7k9x2p/orders"
			class="inline-flex rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
		>
			Active Orders
		</a>
	</div>

	<form method="GET" class="rounded-t-lg border-x border-t border-gray-200 bg-white p-4 shadow-sm">
		<div class="grid grid-cols-1 gap-3 md:grid-cols-6">
			<input
				name="date"
				type="date"
				value={filters.date || ''}
				class="rounded-md border-gray-300 text-sm focus:border-[#000] focus:ring-[#000]"
			/>
			<input
				name="email"
				type="search"
				value={filters.email || ''}
				placeholder="Email"
				class="rounded-md border-gray-300 text-sm focus:border-[#000] focus:ring-[#000]"
			/>
			<input
				name="phone"
				type="search"
				value={filters.phone || ''}
				placeholder="Phone"
				class="rounded-md border-gray-300 text-sm focus:border-[#000] focus:ring-[#000]"
			/>
			<input
				name="name"
				type="search"
				value={filters.name || ''}
				placeholder="Name"
				class="rounded-md border-gray-300 text-sm focus:border-[#000] focus:ring-[#000]"
			/>
			<input
				name="city"
				type="search"
				value={filters.city || ''}
				placeholder="City"
				class="rounded-md border-gray-300 text-sm focus:border-[#000] focus:ring-[#000]"
			/>
			<div class="flex gap-2">
				<button
					type="submit"
					class="flex-1 rounded-md bg-[#000] px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
				>
					Filter
				</button>
				<a
					href="/abayiza-secure-admin-7k9x2p/orders/completed"
					class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
				>
					Clear
				</a>
			</div>
		</div>
	</form>

	<div class="overflow-x-auto rounded-b-lg border border-gray-200 bg-white shadow-sm">
		<table class="min-w-full divide-y divide-gray-200">
			<thead class="bg-gray-50">
				<tr>
					<th
						scope="col"
						class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
						>Order</th
					>
					<th
						scope="col"
						class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
						>Completed</th
					>
					<th
						scope="col"
						class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
						>Customer</th
					>
					<th
						scope="col"
						class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
						>Phone / City</th
					>
					<th
						scope="col"
						class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
						>Items</th
					>
					<th
						scope="col"
						class="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase"
						>Total</th
					>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-200 bg-white">
				{#each orders as order}
					<tr
						class="cursor-pointer hover:bg-gray-50"
						onclick={() =>
							(window.location.href = `/abayiza-secure-admin-7k9x2p/orders/${order.id}`)}
					>
						<td class="px-6 py-4 text-sm font-medium whitespace-nowrap text-blue-600">
							{order.orderNumber}
						</td>
						<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
							{new Date(order.updatedAt).toLocaleDateString()}
						</td>
						<td class="px-6 py-4 whitespace-nowrap">
							<div class="text-sm font-medium text-gray-900">{order.customerName}</div>
							<div class="text-xs text-gray-500">{order.customerEmail || '-'}</div>
						</td>
						<td class="px-6 py-4 whitespace-nowrap">
							<div class="text-sm text-gray-700">{order.customerPhone || '-'}</div>
							<div class="text-xs text-gray-500">{order.customerCity || '-'}</div>
						</td>
						<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
							{order.items.length} item{order.items.length === 1 ? '' : 's'}
						</td>
						<td class="px-6 py-4 text-right text-sm font-medium whitespace-nowrap text-gray-900">
							{formatMoney(order.totalAmount)}
						</td>
					</tr>
				{/each}

				{#if orders.length === 0}
					<tr>
						<td colspan="6" class="px-6 py-10 text-center text-sm text-gray-500">
							No completed orders found
						</td>
					</tr>
				{/if}
			</tbody>
		</table>
	</div>
</div>
