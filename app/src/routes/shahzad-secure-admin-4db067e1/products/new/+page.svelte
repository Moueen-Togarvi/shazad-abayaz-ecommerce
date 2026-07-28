<script lang="ts">
	import ImageFileQueue from '$lib/components/admin/ImageFileQueue.svelte';
	import { Button, Card, Field, PageHeader, Select, TextInput, Textarea } from '$lib/components/admin/ui';

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
	let collections = $derived((data.collections || []) as Array<any>);
	let nextVariantId = 2;
	let variants = $state<VariantRow[]>([
		{ id: 1, type: 'size', size: 'S (52)', color: 'Black', stockCount: 0, sku: '' }
	]);

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
	<title>Add Product | Abayiza Admin</title>
</svelte:head>

<div class="mx-auto max-w-5xl pb-12">
	<PageHeader title="Add Product" subtitle="Create a new product in your catalog." backHref="/abayiza-secure-admin-7k9x2p/products" />

	{#if form?.error}
		<div class="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
			{form.error}
		</div>
	{/if}

	<form method="POST" action="?/create" enctype="multipart/form-data">
		<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
			<div class="space-y-6 lg:col-span-2">
				<Card title="Details">
					<div class="space-y-5">
						<TextInput label="Title" name="name" placeholder="e.g. Ayla Nida Abaya" required />
						<TextInput label="Slug" name="slug" placeholder="auto-generated if empty" help="URL-friendly identifier. Leave blank to auto-generate from the title." />
						<Textarea label="Description" name="description" rows={5} placeholder="Describe fabric, silhouette, and care details…" />
					</div>
				</Card>

				<Card title="Media">
					<ImageFileQueue inputId="new-product-image-picker" label="Add Image" />
				</Card>

				<Card title="Pricing">
					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<TextInput label="Price" name="price" type="number" step="0.01" prefix="Rs." placeholder="0.00" required />
						<TextInput label="Discount Price" name="salePrice" type="number" step="0.01" prefix="Rs." placeholder="0.00" help="Optional — sale price shown instead of the regular price." />
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
					<Select name="productStatus" label="Visibility" help="Draft stays hidden. Out of Stock stays visible but disables cart and checkout.">
						<option value="ACTIVE">Active</option>
						<option value="OUT_OF_STOCK">Out of Stock</option>
						<option value="DRAFT">Draft</option>
					</Select>
				</Card>

				<Card title="Categories">
					{#if collections.length}
						<div class="space-y-2">
							{#each collections as collection}
								<label
									class="flex cursor-pointer items-center justify-between rounded-lg border border-admin-border px-3 py-2 text-sm transition-colors hover:bg-gray-50"
								>
									<span class="font-medium text-gray-700">{collection.name}</span>
									<input
										type="checkbox"
										name="collectionIds"
										value={collection.id}
										class="h-4 w-4 rounded border-gray-300 text-admin-primary focus:ring-admin-primary/30"
									/>
								</label>
							{/each}
						</div>
					{:else}
						<p class="text-sm text-gray-400">Add categories first from the Categories page.</p>
					{/if}
				</Card>

				<div class="sticky bottom-6">
					<Card>
						<Button type="submit" class="w-full">Save Product</Button>
						<Button href="/abayiza-secure-admin-7k9x2p/products" variant="secondary" class="mt-3 w-full">
							Discard
						</Button>
					</Card>
				</div>
			</div>
		</div>
	</form>
</div>
