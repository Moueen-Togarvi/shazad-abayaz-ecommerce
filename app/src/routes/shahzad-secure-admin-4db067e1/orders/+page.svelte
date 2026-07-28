<script lang="ts">
	import { formatMoney } from '$lib/shared/money';
	import {
		Badge,
		Button,
		Card,
		PageHeader,
		Table,
		orderStatus
	} from '$lib/components/admin/ui';

	let { data } = $props();
	let orders = $derived(data.orders || []);
	let filters = $derived(
		(data.filters || { date: '', email: '', phone: '', name: '', city: '' }) as {
			date: string;
			email: string;
			phone: string;
			name: string;
			city: string;
		}
	);
	const filterFields = ['email', 'phone', 'name', 'city'] as const;
</script>

<div class="mx-auto max-w-7xl">
	<PageHeader title="Active Orders" subtitle="Orders that still need attention. Completed and cancelled orders have their own pages.">
		{#snippet actions()}
			<Button href="/abayiza-secure-admin-7k9x2p/orders/completed" variant="secondary">
				Completed
			</Button>
			<Button href="/abayiza-secure-admin-7k9x2p/orders/cancelled" variant="danger">
				Cancelled
			</Button>
		{/snippet}
	</PageHeader>

	<!-- Filters -->
	<Card bodyClass="p-4" class="mb-4">
		<form method="GET">
			<div class="grid grid-cols-1 gap-3 md:grid-cols-6">
				<input
					name="date"
					type="date"
					value={filters.date || ''}
					class="rounded-lg border border-admin-border bg-white px-3 py-2 text-sm text-gray-900 transition-colors focus:border-admin-primary focus:ring-2 focus:ring-admin-primary/20 focus:outline-none"
				/>
				{#each filterFields as field}
					<input
						name={field}
						type="search"
						value={filters[field] || ''}
						placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
						class="rounded-lg border border-admin-border bg-white px-3 py-2 text-sm capitalize text-gray-900 transition-colors placeholder:capitalize placeholder:text-gray-400 focus:border-admin-primary focus:ring-2 focus:ring-admin-primary/20 focus:outline-none"
					/>
				{/each}
				<div class="flex gap-2">
					<Button type="submit" class="flex-1">Filter</Button>
					<a
						href="/abayiza-secure-admin-7k9x2p/orders"
						class="inline-flex items-center justify-center rounded-lg border border-admin-border bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
					>
						Clear
					</a>
				</div>
			</div>
		</form>
	</Card>

	<!-- Orders Table -->
	<Table
		columns={['Order', 'Date', 'Customer', 'Total', 'Phone / City', 'Status', 'Items']}
		isEmpty={orders.length === 0}
		emptyTitle="No active orders"
		emptyDescription="Orders will show up here as customers place them."
		colspan={7}
	>
		{#each orders as order (order.id)}
			<tr
				class="group cursor-pointer transition-colors hover:bg-gray-50"
				onclick={() =>
					(window.location.href = `/abayiza-secure-admin-7k9x2p/orders/${order.id}`)}
			>
				<td class="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
					{order.orderNumber}
				</td>
				<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
					{new Date(order.createdAt).toLocaleDateString()}
				</td>
				<td class="px-6 py-4 whitespace-nowrap">
					<div class="text-sm font-medium text-gray-900 group-hover:text-admin-primary">
						{order.customerName}
					</div>
					<div class="text-xs text-gray-400">{order.customerEmail}</div>
				</td>
				<td class="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-700">
					{formatMoney(order.total)}
				</td>
				<td class="px-6 py-4 whitespace-nowrap">
					<div class="text-sm text-gray-600">{order.customerPhone || '—'}</div>
					<div class="text-xs text-gray-400">{order.customerCity || '—'}</div>
				</td>
				<td class="px-6 py-4 whitespace-nowrap">
					<Badge tone={orderStatus(order.status).tone}>{orderStatus(order.status).label}</Badge>
				</td>
				<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
					{order.items.length} item{order.items.length !== 1 ? 's' : ''}
				</td>
			</tr>
		{/each}
	</Table>

	<!-- Pagination -->
	<div
		class="mt-4 flex items-center justify-between rounded-xl border border-admin-border bg-white px-4 py-3 text-sm shadow-sm"
	>
		<p class="text-gray-500">
			Showing <span class="font-medium text-gray-700">1</span>–<span
				class="font-medium text-gray-700">{orders.length}</span
			>
			of <span class="font-medium text-gray-700">{orders.length}</span> orders
		</p>
		<div class="flex items-center gap-1">
			<button
				type="button"
				class="inline-flex items-center rounded-lg border border-admin-border bg-white px-2.5 py-1.5 text-gray-500 transition-colors hover:bg-gray-50"
				aria-label="Previous"
			>
				<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15 19l-7-7 7-7"
					/>
				</svg>
			</button>
			<button
				type="button"
				class="rounded-lg border border-admin-primary bg-admin-primary px-3 py-1.5 text-sm font-medium text-white"
				>1</button
			>
			<button
				type="button"
				class="inline-flex items-center rounded-lg border border-admin-border bg-white px-2.5 py-1.5 text-gray-500 transition-colors hover:bg-gray-50"
				aria-label="Next"
			>
				<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 5l7 7-7 7"
					/>
				</svg>
			</button>
		</div>
	</div>
</div>
