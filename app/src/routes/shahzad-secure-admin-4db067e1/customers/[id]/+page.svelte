<script lang="ts">
	import { formatMoney } from '$lib/shared/money';

	let { data } = $props();
	let customer = $derived(data.customer as any);
	let activeTab = $state('orders');
	let customerName = $derived(
		`${customer.firstName || ''} ${customer.lastName || ''}`.trim() || customer.email
	);
</script>

<div class="mx-auto max-w-5xl pb-12">
	<div class="mb-6 flex items-center space-x-4">
		<a
			href="/abayiza-secure-admin-7k9x2p/customers"
			aria-label="Back to customers"
			class="rounded-md border border-gray-300 bg-white p-2 text-gray-500 shadow-sm hover:bg-gray-50"
		>
			<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M10 19l-7-7m0 0l7-7m-7 7h18"
				/>
			</svg>
		</a>
		<h1 class="text-2xl font-bold text-gray-900">{customerName}</h1>
	</div>

	<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
		<div class="space-y-6 lg:col-span-2">
			<div class="grid grid-cols-3 gap-4">
				{#each [{ label: 'Total Spent', value: formatMoney(customer.totalSpent) }, { label: 'Total Orders', value: customer.orders.length }, { label: 'Avg. Order Value', value: formatMoney(customer.averageOrderValue) }] as stat}
					<div class="rounded-lg border border-gray-200 bg-white p-4 text-center shadow-sm">
						<p class="text-xl font-bold text-gray-900">{stat.value}</p>
						<p class="mt-1 text-xs text-gray-500">{stat.label}</p>
					</div>
				{/each}
			</div>

			<div class="rounded-lg border border-gray-200 bg-white shadow-sm">
				<div class="flex space-x-4 border-b border-gray-200 px-6 pt-1">
					{#each ['orders', 'addresses', 'notes'] as tab}
						<button
							type="button"
							onclick={() => (activeTab = tab)}
							class="border-b-2 pt-2 pb-3 text-sm font-medium capitalize transition-colors {activeTab ===
							tab
								? 'border-[#000] text-[#000]'
								: 'border-transparent text-gray-500 hover:text-gray-700'}"
						>
							{tab}
						</button>
					{/each}
				</div>

				{#if activeTab === 'orders'}
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
										>Date</th
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
							<tbody class="divide-y divide-gray-200 bg-white">
								{#each customer.orders as order}
									<tr class="hover:bg-gray-50">
										<td class="px-6 py-4 text-sm font-medium text-blue-600">
											<a href={`/abayiza-secure-admin-7k9x2p/orders/${order.id}`}
												>{order.orderNumber}</a
											>
										</td>
										<td class="px-6 py-4 text-sm text-gray-500">
											{new Date(order.createdAt).toLocaleDateString()}
										</td>
										<td class="px-6 py-4">
											<span
												class="rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800"
											>
												{order.status}
											</span>
										</td>
										<td class="px-6 py-4 text-right text-sm font-medium text-gray-900">
											{formatMoney(order.totalAmount)}
										</td>
									</tr>
								{/each}
								{#if customer.orders.length === 0}
									<tr>
										<td colspan="4" class="px-6 py-8 text-center text-sm text-gray-500">
											No orders saved for this customer.
										</td>
									</tr>
								{/if}
							</tbody>
						</table>
					</div>
				{:else if activeTab === 'addresses'}
					<div class="grid gap-4 p-6 md:grid-cols-2">
						{#each customer.addresses as address}
							<div class="rounded-md border border-gray-200 p-4">
								<p class="mb-2 text-xs font-medium tracking-widest text-gray-500 uppercase">
									{address.isDefault ? 'Default Address' : 'Saved Address'}
								</p>
								<p class="text-sm leading-relaxed text-gray-700">
									{address.addressLine1}<br />
									{address.addressLine2 ? `${address.addressLine2}\n` : ''}{address.city},
									{address.state}
									{address.postalCode}<br />
									{address.country}<br />
									{address.phone || ''}
								</p>
							</div>
						{/each}
						{#if customer.addresses.length === 0}
							<p class="text-sm text-gray-500">No addresses saved for this customer.</p>
						{/if}
					</div>
				{:else}
					<div class="p-6">
						<p class="rounded border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
							{customer.adminNotes || 'No admin notes saved.'}
						</p>
					</div>
				{/if}
			</div>
		</div>

		<aside class="space-y-6">
			<div class="rounded-lg border border-gray-200 bg-white shadow-sm">
				<div class="border-b border-gray-200 px-6 py-5">
					<h3 class="font-medium text-gray-900">Customer Details</h3>
				</div>
				<div class="space-y-4 p-6">
					<div class="flex items-center gap-3">
						<div
							class="flex h-12 w-12 items-center justify-center rounded-full bg-[#000] font-serif text-lg font-bold text-white"
						>
							{customerName.slice(0, 1).toUpperCase()}
						</div>
						<div>
							<p class="font-medium text-gray-900">{customerName}</p>
							<p class="text-xs text-gray-400">
								Customer since {new Date(customer.createdAt).toLocaleDateString()}
							</p>
						</div>
					</div>
					<a
						href={`mailto:${customer.email}`}
						class="block text-sm text-gray-600 hover:text-[#000]"
					>
						{customer.email}
					</a>
					<p class="text-sm text-gray-500">Role: {customer.role}</p>
				</div>
			</div>
		</aside>
	</div>
</div>
