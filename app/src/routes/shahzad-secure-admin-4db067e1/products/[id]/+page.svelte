<script lang="ts">
	import ImageFileQueue from '$lib/components/admin/ImageFileQueue.svelte';
	import {
		Badge,
		Button,
		Card,
		Field,
		Modal,
		PageHeader,
		Select,
		TextInput,
		Textarea,
		productStatus as statusInfo
	} from '$lib/components/admin/ui';

	type VariantKind = 'size' | 'color';
	type VariantRow = {
		id: number;
		type: VariantKind;
		size: string;
		color: string;
		stockCount: number;
		sku: string;
	};

	let { data, form } = $props();
	// svelte-ignore state_referenced_locally
	const product = data.product as any;
	// svelte-ignore state_referenced_locally
	const allCollections = (data.allCollections || []) as Array<any>;
	let showDeleteConfirm = $state(false);
	let nextVariantId = product.variants.length + 1;
	let variants = $state<VariantRow[]>(
		(product.variants.length
			? product.variants.map((variant: any, index: number) => ({
					id: index + 1,
					type:
						variant.size === 'One Size' && variant.color && variant.color !== 'Default'
							? ('color' as VariantKind)
							: ('size' as VariantKind),
					size: variant.size || 'S (52)',
					color: variant.color === 'Default' ? 'Black' : variant.color || 'Black',
					stockCount: variant.stockCount || 0,
					sku: variant.sku || ''
				}))
			: [{ id: 1, type: 'size', size: 'S (52)', color: 'Black', stockCount: 0, sku: '' }]) as VariantRow[]
	);

	const sizes = ['XS (50)', 'S (52)', 'M (54)', 'L (56)', 'XL (58)', 'XXL (60)', 'S-XL', 'XS-L'];
	const colors = [
		{ name: 'Black', hex: '#000000' },
		{ name: 'White', hex: '#ffffff' },
		{ name: 'Blue', hex: '#2563eb' },
		{ name: 'Red', hex: '#dc2626' },
		{ name: 'Yellow', hex: '#facc15' },
		{ name: 'Orange', hex: '#f97316' },
		{ name: 'Navy', hex: '#172554' },
		{ name: 'Ivory', hex: '#fff7ed' },
		{ name: 'Dusty Rose', hex: '#c08497' }
	];

	const selectedCollectionIds = product.collections.map((collection: any) => collection.id);
	const totalInventory = product.variants.reduce(
		(total: number, variant: any) => total + Number(variant.stockCount || 0),
		0
	);
	const productStatusKey = !product.isActive
		? 'Draft'
		: totalInventory <= 0
			? 'Out of Stock'
			: 'Active';
	const status = statusInfo(productStatusKey);

	const addVariant = (type: VariantKind = 'size') => {
		variants = [
			...variants,
			{
				id: nextVariantId++,
				type,
				size: 'S (52)',
				color: 'Black',
				stockCount: 0,
				sku: ''
			}
		];
	};

	const removeVariant = (id: number) => {
		if (variants.length === 1) return;
		variants = variants.filter((variant) => variant.id !== id);
	};
</script>

<svelte:head>
	<title>Edit: {product.name} | Admin</title>
</svelte:head>

<div class="mx-auto max-w-5xl pb-12">
	<PageHeader title={product.name} backHref="/abayiza-secure-admin-7k9x2p/products">
		{#snippet actions()}
			<Badge tone={status.tone}>{status.label}</Badge>
			<Button variant="danger" onclick={() => (showDeleteConfirm = true)}>
				<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
					/>
				</svg>
				Delete Product
			</Button>
		{/snippet}
	</PageHeader>

	{#if form?.error}
		<div class="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
			{form.error}
		</div>
	{/if}

	<form method="POST" action="?/update" enctype="multipart/form-data">
		<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
			<div class="space-y-6 lg:col-span-2">
				<Card title="Details">
					<div class="space-y-5">
						<TextInput label="Title" name="name" value={product.name} required />
						<TextInput label="Slug" name="slug" value={product.slug} />
						<Textarea label="Description" name="description" rows={5} value={product.description || ''} />
					</div>
				</Card>

				<Card title="Media">
					{#if product.images?.length}
						<div class="mb-4 grid gap-3 sm:grid-cols-2">
							{#each product.images as image (image.id)}
								<label
									class="overflow-hidden rounded-xl border border-admin-border bg-gray-50"
								>
									<div class="aspect-[4/3] bg-gray-100">
										<img
											src={image.url}
											alt={image.altText || product.name}
											class="h-full w-full object-cover"
										/>
									</div>
									<div
										class="flex items-center justify-between gap-3 border-t border-admin-border px-3 py-2"
									>
										<span class="truncate text-xs font-medium text-gray-500">Current image</span>
										<span class="inline-flex items-center gap-2 text-xs font-semibold text-red-600">
											<input
												type="checkbox"
												name="removeImageIds"
												value={image.id}
												class="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
											/>
											Remove
										</span>
									</div>
								</label>
							{/each}
						</div>
					{:else}
						<p class="mb-4 rounded-lg border border-dashed border-admin-border px-3 py-4 text-sm text-gray-400">
							No images uploaded yet.
						</p>
					{/if}
					<ImageFileQueue
						inputId="edit-product-image-picker"
						label="Add More Images"
						emptyText="Select new images one by one. Checked current images will be removed after saving."
					/>
				</Card>

				<Card title="Pricing">
					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<TextInput label="Price" name="price" type="number" step="0.01" value={product.price} prefix="Rs." required />
						<TextInput label="Discount Price" name="salePrice" type="number" step="0.01" value={product.salePrice ?? ''} prefix="Rs." />
					</div>
				</Card>

				<Card title="Variants">
					{#snippet header()}
						<div class="flex flex-wrap gap-2">
							<Button type="button" variant="secondary" size="sm" onclick={() => addVariant('size')}>
								Add Size
							</Button>
							<Button type="button" variant="secondary" size="sm" onclick={() => addVariant('color')}>
								Add Colour
							</Button>
						</div>
					{/snippet}

					<div class="space-y-3">
						{#each variants as variant, index (variant.id)}
							<div class="rounded-xl border border-admin-border bg-gray-50/60 p-4">
								<div class="grid gap-3 md:grid-cols-[9rem_1fr_7rem_1fr_auto] md:items-end">
									<Field label="Type" class="text-xs">
										{#snippet children()}
											<select
												name="variantType"
												bind:value={variant.type}
												class="block w-full rounded-lg border border-admin-border bg-white px-3 py-2 text-sm text-gray-900 transition-colors focus:border-admin-primary focus:ring-2 focus:ring-admin-primary/20 focus:outline-none"
											>
												<option value="size">Size</option>
												<option value="color">Colour</option>
											</select>
										{/snippet}
									</Field>

									{#if variant.type === 'size'}
										<Field label="Size" class="text-xs">
											{#snippet children()}
												<select
													name="variantSize"
													bind:value={variant.size}
													class="block w-full rounded-lg border border-admin-border bg-white px-3 py-2 text-sm text-gray-900 transition-colors focus:border-admin-primary focus:ring-2 focus:ring-admin-primary/20 focus:outline-none"
												>
													{#each sizes as size}
														<option value={size}>{size}</option>
													{/each}
												</select>
												<input type="hidden" name="variantColor" value="Default" />
											{/snippet}
										</Field>
									{:else}
										<Field label="Colour" class="text-xs">
											{#snippet children()}
												<select
													name="variantColor"
													bind:value={variant.color}
													class="block w-full rounded-lg border border-admin-border bg-white px-3 py-2 text-sm text-gray-900 transition-colors focus:border-admin-primary focus:ring-2 focus:ring-admin-primary/20 focus:outline-none"
												>
													{#each colors as color}
														<option value={color.name}>{color.name}</option>
													{/each}
												</select>
												<input type="hidden" name="variantSize" value="One Size" />
											{/snippet}
										</Field>
									{/if}

									<Field label="Stock" class="text-xs">
										{#snippet children()}
											<input
												name="variantStock"
												type="number"
												min="0"
												bind:value={variant.stockCount}
												class="block w-full rounded-lg border border-admin-border bg-white px-3 py-2 text-sm text-gray-900 transition-colors focus:border-admin-primary focus:ring-2 focus:ring-admin-primary/20 focus:outline-none"
											/>
										{/snippet}
									</Field>

									<Field label="SKU" class="text-xs">
										{#snippet children()}
											<input
												name="variantSku"
												type="text"
												bind:value={variant.sku}
												placeholder={`Auto SKU ${index + 1}`}
												class="block w-full rounded-lg border border-admin-border bg-white px-3 py-2 text-sm text-gray-900 transition-colors focus:border-admin-primary focus:ring-2 focus:ring-admin-primary/20 focus:outline-none"
											/>
										{/snippet}
									</Field>

									<Button
										type="button"
										variant="danger"
										size="sm"
										disabled={variants.length === 1}
										onclick={() => removeVariant(variant.id)}
									>
										Remove
									</Button>
								</div>

								{#if variant.type === 'color'}
									<div class="mt-3 flex flex-wrap gap-2">
										{#each colors as color}
											<button
												type="button"
												class="h-6 w-6 rounded-full border border-admin-border ring-offset-2 transition {variant.color ===
												color.name
													? 'ring-2 ring-admin-primary'
													: ''}"
												style={`background-color: ${color.hex}`}
												aria-label={`Select ${color.name}`}
												onclick={() => (variant.color = color.name)}
											></button>
										{/each}
									</div>
								{/if}
							</div>
						{/each}
					</div>
				</Card>
			</div>

			<div class="space-y-6">
				<Card title="Status">
					<Select name="productStatus" label="Visibility" help="Out of Stock stays visible on the storefront but disables cart and checkout.">
						<option value="ACTIVE" selected={productStatusKey === 'Active'}>Active</option>
						<option value="OUT_OF_STOCK" selected={productStatusKey === 'Out of Stock'}>
							Out of Stock
						</option>
						<option value="DRAFT" selected={productStatusKey === 'Draft'}>Draft</option>
					</Select>
				</Card>

				<Card title="Categories">
					<div class="space-y-2">
						{#each allCollections as collection (collection.id)}
							<label
								class="flex cursor-pointer items-center justify-between rounded-lg border border-admin-border px-3 py-2 text-sm transition-colors hover:bg-gray-50"
							>
								<span class="font-medium text-gray-700">{collection.name}</span>
								<input
									type="checkbox"
									name="collectionIds"
									value={collection.id}
									checked={selectedCollectionIds.includes(collection.id)}
									class="h-4 w-4 rounded border-gray-300 text-admin-primary focus:ring-admin-primary/30"
								/>
							</label>
						{/each}
					</div>
				</Card>

				<div class="sticky bottom-6">
					<Card>
						<Button type="submit" class="w-full">Save Changes</Button>
						<Button href="/abayiza-secure-admin-7k9x2p/products" variant="secondary" class="mt-3 w-full">
							Cancel
						</Button>
					</Card>
				</div>
			</div>
		</div>
	</form>
</div>

<Modal
	open={showDeleteConfirm}
	title="Delete product?"
	description="Delete {product.name}? This removes the product, its images, and all variants. This cannot be undone."
	onClose={() => (showDeleteConfirm = false)}
>
	{#snippet actions()}
		<Button variant="secondary" onclick={() => (showDeleteConfirm = false)}>Cancel</Button>
		<form method="POST" action="?/delete">
			<Button type="submit" variant="primary" class="bg-red-600 hover:bg-red-700">
				Yes, Delete
			</Button>
		</form>
	{/snippet}
</Modal>
