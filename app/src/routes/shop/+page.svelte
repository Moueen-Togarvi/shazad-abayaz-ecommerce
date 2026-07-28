<script lang="ts">
	import { page } from '$app/state';
	import { cart } from '$lib/client/cart.svelte';
	import { formatMoney } from '$lib/shared/money';
	import {
		SITE_IMAGE,
		SITE_NAME,
		absoluteUrl,
		jsonLdScript,
		metaDescription
	} from '$lib/shared/seo';
	import ProductCard from '$lib/components/ProductCard.svelte';

	type Pagination = {
		page: number;
		pageSize: number;
		total: number;
		totalPages: number;
		hasPrevious: boolean;
		hasNext: boolean;
		previousPage: number;
		nextPage: number;
	};

	let { data } = $props();
	let products = $derived((data.products || []) as Array<any>);
	let collections = $derived((data.collections || []) as Array<any>);
	let colors = $derived(
		((data.colors || []) as string[]).filter((c) => c && c.toLowerCase() !== 'default')
	);
	let sizes = $derived(
		((data.sizes || []) as string[]).filter((s) => s && s.toLowerCase() !== 'default')
	);
	let pagination = $derived(
		(data.pagination || {
			page: 1,
			pageSize: 8,
			total: products.length,
			totalPages: 1,
			hasPrevious: false,
			hasNext: false,
			previousPage: 1,
			nextPage: 1
		}) as Pagination
	);
	let filters = $derived(
		(data.filters || { q: '', category: '', color: '', size: '' }) as Record<string, string>
	);
	let totalProducts = $derived(Number(data.totalProducts || products.length));
	let visiblePages = $derived(
		buildVisiblePages(Number(pagination.page), Number(pagination.totalPages))
	);
	let isGridView = $state(true);
	let searchQuery = $state('');
	let selectedCategory = $state('');
	let selectedColor = $state('');
	let selectedSize = $state('');
	let shopTitle = $derived(
		filters.category
			? `${collections.find((collection) => collection.slug === filters.category)?.name || 'Collection'} | ${SITE_NAME}`
			: `Shop All | ${SITE_NAME}`
	);
	let shopDescription = $derived(
		metaDescription(
			filters.category
				? `Browse ${collections.find((collection) => collection.slug === filters.category)?.name || 'our collection'} at Abayiza with premium abayas, nida essentials, and modest occasion wear.`
				: 'Shop Abayiza premium abayas, soft nida essentials, black abayas, Eid edits, and occasion modestwear pieces.'
		)
	);
	let shopSocialImage = $derived(
		absoluteUrl(products[0]?.images?.[0]?.url || SITE_IMAGE, page.url.origin)
	);
	let shopJsonLd = $derived(
		jsonLdScript({
			'@context': 'https://schema.org',
			'@type': 'CollectionPage',
			name: shopTitle,
			description: shopDescription,
			url: absoluteUrl(`/shop${page.url.search}`, page.url.origin),
			mainEntity: {
				'@type': 'ItemList',
				itemListElement: products.map((item: any, index: number) => ({
					'@type': 'ListItem',
					position: index + 1,
					url: absoluteUrl(`/shop/${item.slug}`, page.url.origin),
					name: item.name
				}))
			}
		})
	);

	$effect(() => {
		searchQuery = filters.q || '';
		selectedCategory = filters.category || '';
		selectedColor = filters.color || '';
		selectedSize = filters.size || '';
	});

	const colorHex: Record<string, string> = {
		Black: '#101411',
		White: '#ffffff',
		Ivory: '#fff7ed',
		Emerald: '#047857',
		Midnight: '#111827',
		Sage: '#8fa99a',
		Olive: '#64763c',
		Charcoal: '#374151',
		Navy: '#172554',
		Mocha: '#7b5142'
	};

	function productImage(item: any) {
		return item.images && item.images.length > 0 ? item.images[0].url : '';
	}

	function primaryVariant(item: any) {
		return (
			item.variants?.find((variant: any) => Number(variant.stockCount || 0) > 0) ||
			item.variants?.[0]
		);
	}

	function isOutOfStock(item: any) {
		return !item.variants?.some((variant: any) => Number(variant.stockCount || 0) > 0);
	}

	function productPrice(item: any) {
		return Number(item.salePrice || item.price);
	}

	function addProductToCart(item: any) {
		if (isOutOfStock(item)) return;
		const variant = primaryVariant(item);

		cart.addItem({
			id: variant ? variant.id : item.id,
			productId: item.id,
			variantId: variant?.id,
			name: item.name,
			price: productPrice(item),
			quantity: 1,
			image: productImage(item),
			color: variant?.color,
			size: variant?.size
		});
	}

	function pageHref(page: number) {
		const params = new URLSearchParams();
		params.set('page', String(page));
		if (filters.q) params.set('q', filters.q);
		if (filters.category) params.set('category', filters.category);
		if (filters.color) params.set('color', filters.color);
		if (filters.size) params.set('size', filters.size);

		return `/shop?${params.toString()}`;
	}

	function buildVisiblePages(currentPage: number, totalPages: number) {
		return Array.from(
			new Set([1, currentPage - 1, currentPage, currentPage + 1, totalPages])
		).filter((page) => page >= 1 && page <= totalPages);
	}

	import { goto } from '$app/navigation';
	function updateFilter() {
		const params = new URLSearchParams();
		if (searchQuery) params.set('q', searchQuery);
		if (selectedCategory) params.set('category', selectedCategory);
		if (selectedColor) params.set('color', selectedColor);
		if (selectedSize) params.set('size', selectedSize);
		goto(`/shop?${params.toString()}`, { keepFocus: true, noScroll: true });
	}

	let searchTimer: any;
	function handleSearchInput() {
		clearTimeout(searchTimer);
		searchTimer = setTimeout(updateFilter, 400);
	}
</script>

<svelte:head>
	<title>{shopTitle}</title>
	<meta name="description" content={shopDescription} />
	<meta
		name="keywords"
		content="shop abayas, premium abaya Pakistan, nida abaya, black abaya, modest dresses, online abaya shopping"
	/>
	<meta property="og:type" content="website" />
	<meta property="og:title" content={shopTitle} />
	<meta property="og:description" content={shopDescription} />
	<meta property="og:image" content={shopSocialImage} />
	<meta name="twitter:title" content={shopTitle} />
	<meta name="twitter:description" content={shopDescription} />
	{@html shopJsonLd}
</svelte:head>

<section class="bg-[#fbf9f2] px-4 py-10 text-[#14352d] sm:px-6 lg:px-8">
	<div class="mx-auto max-w-7xl">
		<div class="mb-8 border-b border-[#14352d]/10 pb-8">
			<p class="mb-3 text-xs font-black tracking-[0.2em] text-[#b58b2b] uppercase">Shop Abayiza</p>
			<div class="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
				<div>
					<h1 class="font-serif text-4xl leading-tight uppercase sm:text-5xl">The Collection</h1>
					<p class="mt-4 max-w-2xl text-sm leading-6 font-medium text-[#596c62] sm:text-base">
						Explore premium abayas for daily wear, occasion styling, and refined modest wardrobes.
					</p>
				</div>
				<div class="flex flex-wrap gap-2">
					<span
						class="rounded-full border border-[#14352d]/10 bg-white px-4 py-2 text-xs font-bold text-[#14352d]"
					>
						{pagination.total} Matching
					</span>
					<span
						class="rounded-full border border-[#14352d]/10 bg-white px-4 py-2 text-xs font-bold text-[#14352d]"
					>
						{totalProducts} Total
					</span>
				</div>
			</div>
		</div>

		<div
			class="mb-8 flex flex-col gap-4 rounded-md border border-[#14352d]/10 bg-white/86 p-4 shadow-[0_18px_45px_rgba(20,53,45,0.08)] md:flex-row md:items-center md:justify-between"
		>
			<div class="flex items-center justify-between gap-3">
				<p class="text-sm font-bold text-[#596c62]">
					Showing {products.length} of {pagination.total} matching products
				</p>
			</div>

			<div class="flex flex-wrap items-center justify-between gap-4 md:justify-end">
				<label class="flex items-center gap-2 text-sm font-medium text-[#596c62]">
					<span>Sort by</span>
					<select
						class="rounded-full border border-[#14352d]/10 bg-[#fbf9f2] px-4 py-2 text-sm font-bold text-[#14352d] focus:border-[#14352d] focus:ring-[#14352d]"
					>
						<option>Featured</option>
						<option>New Arrivals</option>
						<option>Price: Low to High</option>
						<option>Price: High to Low</option>
					</select>
				</label>

				<div
					class="hidden items-center gap-2 rounded-full border border-[#14352d]/10 bg-[#fbf9f2] p-1 md:flex"
				>
					<button
						type="button"
						aria-label="Grid view"
						class="inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors {isGridView
							? 'bg-[#14352d] text-white'
							: 'text-[#596c62] hover:bg-white'}"
						onclick={() => (isGridView = true)}
					>
						<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
							<path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z" />
						</svg>
					</button>
					<button
						type="button"
						aria-label="List view"
						class="inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors {!isGridView
							? 'bg-[#14352d] text-white'
							: 'text-[#596c62] hover:bg-white'}"
						onclick={() => (isGridView = false)}
					>
						<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
							<path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z" />
						</svg>
					</button>
				</div>
			</div>
		</div>

		<div class="flex flex-col gap-8 md:flex-row md:items-start">
			<aside class="w-full shrink-0 md:block md:w-72 lg:w-80">
				<form
					method="GET"
					action="/shop"
					class="sticky top-28 rounded-md border border-[#14352d]/10 bg-white/92 p-3 shadow-[0_18px_45px_rgba(20,53,45,0.08)]"
				>
					<div class="mb-3 flex items-center justify-between gap-3">
						<h2 class="text-sm font-black tracking-[0.14em] text-[#b58b2b] uppercase">
							Filter Search
						</h2>
						<a
							href="/shop"
							class="rounded-full border border-[#14352d]/10 px-2.5 py-1 text-[0.65rem] font-black tracking-[0.1em] text-[#14352d] uppercase transition-colors hover:bg-[#fbf9f2]"
						>
							Clear
						</a>
					</div>

					<div class="space-y-3">
						<div>
							<label
								for="shop-sidebar-q"
								class="mb-1 block text-[0.68rem] font-black tracking-[0.12em] uppercase"
							>
								Search
							</label>
							<input
								id="shop-sidebar-q"
								name="q"
								type="search"
								bind:value={searchQuery}
								oninput={handleSearchInput}
								placeholder="Search by name, color..."
								class="h-9 w-full rounded-md border-[#14352d]/15 bg-[#fbf9f2] text-xs font-semibold text-[#14352d] placeholder:text-[#596c62]/70 focus:border-[#14352d] focus:ring-[#14352d]"
							/>
						</div>

						<div class="border-t border-[#14352d]/10 pt-3">
							<h3 class="mb-2 text-[0.68rem] font-black tracking-[0.14em] uppercase">Category</h3>
							<div class="grid gap-1.5">
								<label
									class="flex min-h-8 cursor-pointer items-center justify-between rounded-md border px-2.5 text-xs font-bold transition-colors {selectedCategory ===
									''
										? 'border-[#14352d] bg-[#14352d] text-white'
										: 'border-[#14352d]/10 bg-[#fbf9f2] text-[#596c62] hover:border-[#14352d]/30 hover:text-[#14352d]'}"
								>
									<span>All categories</span>
									<input
										class="sr-only"
										type="radio"
										name="category"
										value=""
										bind:group={selectedCategory}
										onchange={updateFilter}
									/>
								</label>
								{#each collections as collection}
									<label
										class="flex min-h-8 cursor-pointer items-center justify-between gap-2 rounded-md border px-2.5 text-xs font-bold transition-colors {selectedCategory ===
										collection.slug
											? 'border-[#14352d] bg-[#14352d] text-white'
											: 'border-[#14352d]/10 bg-[#fbf9f2] text-[#596c62] hover:border-[#14352d]/30 hover:text-[#14352d]'}"
									>
										<span>{collection.name}</span>
										<input
											class="sr-only"
											type="radio"
											name="category"
											value={collection.slug}
											bind:group={selectedCategory}
											onchange={updateFilter}
										/>
									</label>
								{/each}
							</div>
						</div>

						<div class="border-t border-[#14352d]/10 pt-3">
							<h3 class="mb-2 text-[0.68rem] font-black tracking-[0.14em] uppercase">Color</h3>
							<div class="grid grid-cols-2 gap-1.5">
								<label
									class="flex min-h-8 cursor-pointer items-center gap-2 rounded-md border px-2.5 text-xs font-bold transition-colors {selectedColor ===
									''
										? 'border-[#14352d] bg-[#14352d] text-white'
										: 'border-[#14352d]/10 bg-[#fbf9f2] text-[#596c62] hover:border-[#14352d]/30 hover:text-[#14352d]'}"
								>
									<span
										class="h-3.5 w-3.5 rounded-full border border-current bg-white"
										aria-hidden="true"
									></span>
									<span>All</span>
									<input
										class="sr-only"
										type="radio"
										name="color"
										value=""
										bind:group={selectedColor}
										onchange={updateFilter}
									/>
								</label>
								{#each colors as color}
									<label
										class="flex min-h-8 cursor-pointer items-center gap-2 rounded-md border px-2.5 text-xs font-bold transition-colors {selectedColor ===
										color
											? 'border-[#14352d] bg-[#14352d] text-white'
											: 'border-[#14352d]/10 bg-[#fbf9f2] text-[#596c62] hover:border-[#14352d]/30 hover:text-[#14352d]'}"
									>
										<span
											class="h-3.5 w-3.5 rounded-full border border-[#14352d]/20 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.35)]"
											style={`background-color: ${colorHex[color] || '#d9d0bd'}`}
											aria-hidden="true"
										></span>
										<span>{color}</span>
										<input
											class="sr-only"
											type="radio"
											name="color"
											value={color}
											bind:group={selectedColor}
											onchange={updateFilter}
										/>
									</label>
								{/each}
							</div>
						</div>

						<div class="border-t border-[#14352d]/10 pt-3">
							<h3 class="mb-2 text-[0.68rem] font-black tracking-[0.14em] uppercase">Size</h3>
							<div class="flex flex-wrap gap-1.5">
								<label
									class="inline-flex min-h-8 cursor-pointer items-center rounded-full border px-3 text-xs font-black transition-colors {selectedSize ===
									''
										? 'border-[#14352d] bg-[#14352d] text-white'
										: 'border-[#14352d]/10 bg-[#fbf9f2] text-[#596c62] hover:border-[#14352d]/30 hover:text-[#14352d]'}"
								>
									All
									<input
										class="sr-only"
										type="radio"
										name="size"
										value=""
										bind:group={selectedSize}
										onchange={updateFilter}
									/>
								</label>
								{#each sizes as size}
									<label
										class="inline-flex min-h-8 cursor-pointer items-center rounded-full border px-3 text-xs font-black transition-colors {selectedSize ===
										size
											? 'border-[#14352d] bg-[#14352d] text-white'
											: 'border-[#14352d]/10 bg-[#fbf9f2] text-[#596c62] hover:border-[#14352d]/30 hover:text-[#14352d]'}"
									>
										{size}
										<input
											class="sr-only"
											type="radio"
											name="size"
											value={size}
											bind:group={selectedSize}
											onchange={updateFilter}
										/>
									</label>
								{/each}
							</div>
						</div>
					</div>
				</form>
			</aside>

			<div class="min-w-0 flex-1">
				{#if products.length}
					<div
						class="grid {isGridView
							? 'auto-rows-fr grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3'
							: 'grid-cols-1 gap-6'}"
					>
						{#each products as item}
							<ProductCard product={item} layout={isGridView ? 'grid' : 'list'} aspectRatio="aspect-[5/6]" />
						{/each}
					</div>
				{:else}
					<div
						class="rounded-md border border-dashed border-[#14352d]/18 bg-white/80 px-5 py-16 text-center shadow-[0_16px_38px_rgba(20,53,45,0.06)]"
					>
						<p class="font-serif text-2xl text-[#14352d]">No abayas found</p>
						<p class="mx-auto mt-3 max-w-md text-sm leading-6 font-medium text-[#596c62]">
							Try another search, category, color, or size.
						</p>
						<a
							href="/shop"
							class="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-[#14352d] px-6 text-sm font-bold text-white transition-colors hover:bg-[#e4b43d] hover:text-[#14352d]"
						>
							Clear Filters
						</a>
					</div>
				{/if}

				<div
					class="mt-14 border-t border-[#14352d]/10 pt-8 text-center text-sm font-bold text-[#596c62]"
				>
					Page {pagination.page} of {pagination.totalPages} · {pagination.pageSize} per page
				</div>

				{#if pagination.totalPages > 1}
					<nav
						class="mt-8 flex flex-col items-center justify-between gap-4 text-sm font-bold text-[#14352d] sm:flex-row"
						aria-label="Shop pagination"
					>
						{#if pagination.hasPrevious}
							<a
								href={pageHref(Number(pagination.previousPage))}
								class="inline-flex min-h-10 items-center justify-center rounded-full border border-[#14352d]/12 bg-white px-5 transition-colors hover:border-[#e4b43d] hover:bg-[#e4b43d] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14352d]"
							>
								Previous
							</a>
						{:else}
							<span
								class="inline-flex min-h-10 cursor-not-allowed items-center justify-center rounded-full border border-[#14352d]/8 bg-white/50 px-5 text-[#596c62]/55"
							>
								Previous
							</span>
						{/if}

						<div class="flex flex-wrap items-center justify-center gap-2">
							{#each visiblePages as page, index}
								{#if index > 0 && page - visiblePages[index - 1] > 1}
									<span class="px-1 text-[#596c62]">...</span>
								{/if}
								{#if page === pagination.page}
									<span
										aria-current="page"
										class="inline-flex h-10 min-w-10 items-center justify-center rounded-full bg-[#14352d] px-3 text-white"
									>
										{page}
									</span>
								{:else}
									<a
										href={pageHref(page)}
										class="inline-flex h-10 min-w-10 items-center justify-center rounded-full border border-[#14352d]/12 bg-white px-3 transition-colors hover:border-[#e4b43d] hover:bg-[#e4b43d] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14352d]"
									>
										{page}
									</a>
								{/if}
							{/each}
						</div>

						{#if pagination.hasNext}
							<a
								href={pageHref(Number(pagination.nextPage))}
								class="inline-flex min-h-10 items-center justify-center rounded-full border border-[#14352d]/12 bg-white px-5 transition-colors hover:border-[#e4b43d] hover:bg-[#e4b43d] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14352d]"
							>
								Next
							</a>
						{:else}
							<span
								class="inline-flex min-h-10 cursor-not-allowed items-center justify-center rounded-full border border-[#14352d]/8 bg-white/50 px-5 text-[#596c62]/55"
							>
								Next
							</span>
						{/if}
					</nav>
				{/if}
			</div>
		</div>
	</div>
</section>
