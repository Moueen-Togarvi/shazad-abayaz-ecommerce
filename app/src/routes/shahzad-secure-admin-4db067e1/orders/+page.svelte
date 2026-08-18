<script lang="ts">
	import { enhance } from '$app/forms';
	import { formatMoney } from '$lib/shared/money';
	import {
		Badge,
		Button,
		Card,
		PageHeader,
		Table,
		orderStatus
	} from '$lib/components/admin/ui';

	let { data, form } = $props();
	let orders = $derived(data.orders || []);
	let totalOrderCount = $derived(data.totalOrderCount || 0);
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

	let deleteStep = $state<0 | 1 | 2>(0);
	let deletePassword = $state('');
	let deleting = $state(false);

	const closeDeleteFlow = () => {
		deleteStep = 0;
		deletePassword = '';
	};
</script>

<div class="mx-auto max-w-7xl">
	<PageHeader title="Active Orders" subtitle="Orders that still need attention. Completed and cancelled orders have their own pages.">
		{#snippet actions()}
			<Button href="/shahzad-secure-admin-4db067e1/orders/completed" variant="secondary">
				Completed
			</Button>
			<Button href="/shahzad-secure-admin-4db067e1/orders/cancelled" variant="danger">
				Cancelled
			</Button>
			<Button variant="danger" onclick={() => (deleteStep = 1)}>Delete All Orders</Button>
		{/snippet}
	</PageHeader>

	{#if form?.error}
		<div class="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
			{form.error}
		</div>
	{/if}

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
						href="/shahzad-secure-admin-4db067e1/orders"
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
					(window.location.href = `/shahzad-secure-admin-4db067e1/orders/${order.id}`)}
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

{#if deleteStep === 1}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
		<div class="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
			<p class="text-xs font-black tracking-[0.16em] text-red-600 uppercase">
				Delete All Orders
			</p>
			<h2 class="mt-2 text-xl font-black text-gray-950">Are you absolutely sure?</h2>
			<p class="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
				This will permanently delete all {totalOrderCount} order{totalOrderCount === 1
					? ''
					: 's'} in the database — active, completed, and cancelled. This cannot be undone.
			</p>
			<div class="mt-5 flex justify-end gap-3">
				<button
					type="button"
					class="rounded-full border border-gray-300 px-5 py-2 text-sm font-black text-gray-700 hover:bg-gray-50"
					onclick={closeDeleteFlow}
				>
					Cancel
				</button>
				<button
					type="button"
					class="rounded-full bg-red-600 px-5 py-2 text-sm font-black text-white hover:bg-red-700"
					onclick={() => (deleteStep = 2)}
				>
					Yes, Continue
				</button>
			</div>
		</div>
	</div>
{/if}

{#if deleteStep === 2}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
		<div class="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
			<p class="text-xs font-black tracking-[0.16em] text-red-600 uppercase">Final Confirmation</p>
			<h2 class="mt-2 text-xl font-black text-gray-950">Enter your password to confirm</h2>
			<p class="mt-1 text-sm text-gray-500">
				For your security, deleting all orders requires your admin password.
			</p>
			<form
				method="POST"
				action="?/deleteAll"
				use:enhance={() => {
					deleting = true;
					return async ({ update }) => {
						await update();
						deleting = false;
						closeDeleteFlow();
					};
				}}
			>
				<input
					type="password"
					name="password"
					bind:value={deletePassword}
					placeholder="Your admin password"
					autocomplete="current-password"
					required
					class="mt-4 block w-full rounded-lg border border-admin-border bg-white px-3 py-2 text-sm text-gray-900 transition-colors focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none"
				/>
				<div class="mt-5 flex justify-end gap-3">
					<button
						type="button"
						class="rounded-full border border-gray-300 px-5 py-2 text-sm font-black text-gray-700 hover:bg-gray-50"
						onclick={closeDeleteFlow}
						disabled={deleting}
					>
						Cancel
					</button>
					<button
						type="submit"
						class="rounded-full bg-red-600 px-5 py-2 text-sm font-black text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
						disabled={deleting || !deletePassword}
					>
						{deleting ? 'Deleting…' : 'Delete All Orders Permanently'}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
