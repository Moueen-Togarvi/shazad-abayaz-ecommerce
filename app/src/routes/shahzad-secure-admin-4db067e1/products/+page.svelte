<script lang="ts">
	import { formatMoney } from '$lib/shared/money';
	import {
		Badge,
		Button,
		PageHeader,
		Table,
		productStatus
	} from '$lib/components/admin/ui';

	let { data } = $props();
	let products = $derived((data.products || []) as Array<any>);
</script>

<div class="mx-auto max-w-7xl">
	<PageHeader title="Products" subtitle="Manage your catalog, inventory, and pricing.">
		{#snippet actions()}
			<Button variant="secondary" size="md">Export</Button>
			<Button href="/abayiza-secure-admin-7k9x2p/products/new" size="md">
				<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 4v16m8-8H4"
					/>
				</svg>
				Add Product
			</Button>
		{/snippet}
	</PageHeader>

	<!-- Filters & Search -->
	<div
		class="mb-4 flex flex-col gap-3 rounded-xl border border-admin-border bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
	>
		<div class="flex gap-1">
			<button
				class="rounded-lg border-b-2 border-admin-primary px-3 py-1.5 text-sm font-medium text-gray-900">All</button
			>
			<button
				class="rounded-lg border-b-2 border-transparent px-3 py-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-700">Active</button
			>
			<button
				class="rounded-lg border-b-2 border-transparent px-3 py-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-700">Draft</button
			>
			<button
				class="rounded-lg border-b-2 border-transparent px-3 py-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-700">Archived</button
			>
		</div>
		<div class="relative w-full sm:w-72">
			<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
				<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
			</div>
			<input
				type="text"
				class="block w-full rounded-lg border border-admin-border bg-white py-2 pr-3 pl-9 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:border-admin-primary focus:ring-2 focus:ring-admin-primary/20 focus:outline-none"
				placeholder="Filter products…"
			/>
		</div>
	</div>

	<!-- Product Table -->
	<Table
		columns={['Product', 'Status', 'Price', 'Inventory', 'Categories', 'Actions']}
		isEmpty={products.length === 0}
		emptyTitle="No products yet"
		emptyDescription="Create your first product to get started."
		colspan={6}
	>
		{#each products as product (product.id)}
			<tr
				class="group cursor-pointer transition-colors hover:bg-gray-50"
				onclick={() =>
					(window.location.href = `/abayiza-secure-admin-7k9x2p/products/${product.id}`)}
			>
				<td class="px-6 py-4 whitespace-nowrap">
					<div class="flex items-center gap-3">
						<div
							class="h-10 w-8 shrink-0 overflow-hidden rounded-md border border-admin-border bg-gray-100"
						>
							<img
								class="h-full w-full object-cover"
								src={product.images && product.images.length > 0
									? product.images[0].url
									: ''}
								alt={product.name}
							/>
						</div>
						<div class="min-w-0">
							<div class="text-sm font-medium text-gray-900 group-hover:text-admin-primary">
								{product.name}
							</div>
							<p class="max-w-xs truncate text-xs text-gray-400">{product.description}</p>
						</div>
					</div>
				</td>
				<td class="px-6 py-4 whitespace-nowrap">
					<Badge tone={productStatus(product.status).tone}>
						{productStatus(product.status).label}
					</Badge>
				</td>
				<td class="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-700">
					{formatMoney(product.salePrice || product.price)}
				</td>
				<td
					class="px-6 py-4 text-sm whitespace-nowrap {product.totalInventory === 0
						? 'text-red-600'
						: 'text-gray-500'}"
				>
					{product.totalInventory} in stock
					<span class="text-gray-400">· {product.variants.length} variants</span>
				</td>
				<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
					{product.collections.map((collection: any) => collection.name).join(', ') ||
						'No category'}
				</td>
				<td class="px-6 py-4 text-right text-sm whitespace-nowrap">
					<div class="flex justify-end gap-2">
						<Button
							href={`/abayiza-secure-admin-7k9x2p/products/${product.id}`}
							variant="secondary"
							size="sm"
							onclick={(event: MouseEvent) => event.stopPropagation()}>Edit</Button
						>
						<form
							method="POST"
							action="?/delete"
							onsubmit={(event) => {
								event.stopPropagation();
								if (!confirm(`Delete ${product.name}?`)) event.preventDefault();
							}}
						>
							<input type="hidden" name="id" value={product.id} />
							<Button
								type="submit"
								variant="danger"
								size="sm"
								onclick={(event: MouseEvent) => event.stopPropagation()}>Delete</Button
							>
						</form>
					</div>
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
				class="font-medium text-gray-700">{products.length}</span
			>
			of <span class="font-medium text-gray-700">{products.length}</span> products
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
