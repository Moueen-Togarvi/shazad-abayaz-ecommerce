<script lang="ts">
	import { formatMoney } from '$lib/shared/money';

	let { data } = $props();
	let customers = $derived(data.customers || []);
</script>

<div class="mx-auto max-w-7xl">
	<div class="mb-6 flex items-center justify-between">
		<h1 class="text-2xl font-bold text-gray-900">Customers</h1>
		<div class="flex space-x-3">
			<button
				class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
			>
				Export
			</button>
			<button
				class="rounded-md bg-[#000] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800"
			>
				Add customer
			</button>
		</div>
	</div>

	<!-- Filters & Search -->
	<div
		class="flex flex-col items-start justify-between space-y-4 rounded-t-lg border-x border-t border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:space-y-0"
	>
		<div class="flex w-full items-center space-x-2">
			<div class="relative flex-1">
				<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
					<svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/></svg
					>
				</div>
				<input
					type="text"
					class="block w-full rounded-md border border-gray-300 bg-white py-2 pr-3 pl-10 leading-5 placeholder-gray-500 focus:border-[#000] focus:ring-1 focus:ring-[#000] focus:outline-none sm:text-sm"
					placeholder="Filter customers"
				/>
			</div>
			<button
				class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
			>
				Filter
			</button>
		</div>
	</div>

	<!-- Customers Table -->
	<div class="overflow-x-auto rounded-b-lg border border-gray-200 bg-white shadow-sm">
		<table class="min-w-full divide-y divide-gray-200">
			<thead class="bg-gray-50">
				<tr>
					<th
						scope="col"
						class="w-8 px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
					>
						<input type="checkbox" class="rounded border-gray-300 text-[#000] focus:ring-[#000]" />
					</th>
					<th
						scope="col"
						class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
						>Customer name</th
					>
					<th
						scope="col"
						class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
						>Location</th
					>
					<th
						scope="col"
						class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
						>Orders</th
					>
					<th
						scope="col"
						class="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase"
						>Amount spent</th
					>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-200 bg-white">
				{#each customers as customer}
					<tr
						class="group cursor-pointer hover:bg-gray-50"
						onclick={() =>
							(window.location.href = `/abayiza-secure-admin-7k9x2p/customers/${customer.id}`)}
					>
						<td class="px-6 py-4 whitespace-nowrap">
							<input
								type="checkbox"
								class="rounded border-gray-300 text-[#000] focus:ring-[#000]"
							/>
						</td>
						<td class="px-6 py-4 whitespace-nowrap">
							<div class="text-sm font-medium text-blue-600 hover:underline">
								{customer.firstName}
								{customer.lastName}
							</div>
							<div class="text-xs text-gray-500">{customer.email}</div>
						</td>
						<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500"> - </td>
						<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
							{customer.orderCount} orders
						</td>
						<td class="px-6 py-4 text-right text-sm font-medium whitespace-nowrap text-gray-900">
							{formatMoney(customer.totalSpent)}
						</td>
					</tr>
				{/each}
				{#if customers.length === 0}
					<tr>
						<td colspan="5" class="px-6 py-8 text-center text-sm text-gray-500">
							No customers found
						</td>
					</tr>
				{/if}
			</tbody>
		</table>
	</div>
</div>
