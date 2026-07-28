<script lang="ts">
	import { page } from '$app/state';
	import { cart } from '$lib/client/cart.svelte';
	import { formatMoney } from '$lib/shared/money';
	import { SITE_NAME, absoluteUrl, jsonLdScript, metaDescription } from '$lib/shared/seo';
	import ProductCard from '$lib/components/ProductCard.svelte';

	let { data } = $props();
	let section = $derived(data.section);
	let products = $derived((data.products || []) as Array<any>);
	let pagination = $derived(data.pagination);
	let filters = $derived(
		(data.filters || { q: '', category: '', color: '', size: '' }) as Record<string, string>
	);
	let filterOptions = $derived(
		(data.filterOptions || { categories: [], colors: [], sizes: [] }) as Record<string, any>
	);
	let visiblePages = $derived(buildVisiblePages(pagination.page, pagination.totalPages));
	let searchQuery = $state('');
	let selectedCategory = $state('');
	let selectedColor = $state('');
	let selectedSize = $state('');
	let sectionTitle = $derived(`${section.title} | ${SITE_NAME}`);
	let sectionDescription = $derived(metaDescription(section.description));
	let sectionJsonLd = $derived(
		jsonLdScript([
			{
				'@context': 'https://schema.org',
				'@type': 'CollectionPage',
				name: section.title,
				description: sectionDescription,
				url: absoluteUrl(section.href, page.url.origin)
			},
			{
				'@context': 'https://schema.org',
				'@type': 'BreadcrumbList',
				itemListElement: [
					{
						'@type': 'ListItem',
						position: 1,
						name: 'Home',
						item: absoluteUrl('/', page.url.origin)
					},
					{
						'@type': 'ListItem',
						position: 2,
						name: section.title,
						item: absoluteUrl(section.href, page.url.origin)
					}
				]
			}
		])
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
		return item.images?.[0]?.url || '/image.png';
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

	function productCategory(item: any) {
		return item.collections?.[0]?.name || 'Abayiza';
	}

	function productHref(item: any) {
		return `/shop/${item.slug}`;
	}

	function pageHref(page: number) {
		const params = new URLSearchParams();
		params.set('page', String(page));
		if (filters.q) params.set('q', filters.q);
		if (filters.category) params.set('category', filters.category);
		if (filters.color) params.set('color', filters.color);
		if (filters.size) params.set('size', filters.size);

		return `${section.href}?${params.toString()}`;
	}

	function buildVisiblePages(currentPage: number, totalPages: number) {
		return Array.from(
			new Set([1, currentPage - 1, currentPage, currentPage + 1, totalPages])
		).filter((page) => page >= 1 && page <= totalPages);
	}

	function addProductToCart(item: any) {
		if (isOutOfStock(item)) return;
		const variant = primaryVariant(item);

		cart.addItem({
			id: variant?.id || item.id,
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
</script>

<svelte:head>
	<title>{sectionTitle}</title>
	<meta name="description" content={sectionDescription} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={sectionTitle} />
	<meta property="og:description" content={sectionDescription} />
	<meta name="twitter:title" content={sectionTitle} />
	<meta name="twitter:description" content={sectionDescription} />
	{@html sectionJsonLd}
</svelte:head>

<section class="bg-[#fbf9f2] px-4 py-10 text-[#0a0a0a] sm:px-6 lg:px-8">
	<div class="mx-auto max-w-7xl">
		<div class="mb-8 border-b border-[#0a0a0a]/10 pb-8">
			<a
				href="/"
				class="mb-6 inline-flex min-h-10 items-center justify-center rounded-full border border-[#0a0a0a]/12 bg-white px-4 text-xs font-black tracking-[0.12em] text-[#0a0a0a] uppercase shadow-[0_12px_28px_rgba(20,53,45,0.08)] transition-colors hover:border-[#c5a880] hover:bg-[#c5a880] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0a0a0a]"
			>
				Back Home
			</a>
			<div class="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
				<div>
					<p class="mb-3 text-xs font-black tracking-[0.2em] text-[#a8895f] uppercase">
						{section.eyebrow}
					</p>
					<h1 class="font-serif text-4xl leading-tight uppercase sm:text-5xl">
						{section.title}
					</h1>
					<p class="mt-4 max-w-2xl text-sm leading-6 font-medium text-[#52524f] sm:text-base">
						{section.description}
					</p>
				</div>
				<div class="flex flex-wrap gap-2">
					<span
						class="rounded-full border border-[#0a0a0a]/10 bg-white px-4 py-2 text-xs font-bold text-[#0a0a0a]"
					>
						{pagination.total} Pieces
					</span>
					<span
						class="rounded-full border border-[#0a0a0a]/10 bg-white px-4 py-2 text-xs font-bold text-[#0a0a0a]"
					>
						Page {pagination.page} of {pagination.totalPages}
					</span>
				</div>
			</div>
		</div>

		<div
			class="mb-8 flex flex-col gap-4 rounded-md border border-[#0a0a0a]/10 bg-white/86 p-4 shadow-[0_18px_45px_rgba(20,53,45,0.08)] md:flex-row md:items-center md:justify-between"
		>
			<div class="flex items-center justify-between gap-3">
				<p class="text-sm font-bold text-[#52524f]">
					Showing {products.length} of {pagination.total} matching products
				</p>
			</div>
			<p class="text-sm font-bold text-[#52524f]">
				Page {pagination.page} of {pagination.totalPages} · {pagination.pageSize} per page
			</p>
		</div>

		<div class="flex flex-col gap-8 md:flex-row md:items-start">
			<aside class="w-full shrink-0 md:block md:w-72 lg:w-80">
				<form
					method="GET"
					action={section.href}
					class="sticky top-28 rounded-md border border-[#0a0a0a]/10 bg-white/92 p-3 shadow-[0_18px_45px_rgba(20,53,45,0.08)]"
				>
					<div class="mb-3 flex items-center justify-between gap-3">
						<h2 class="text-sm font-black tracking-[0.14em] text-[#a8895f] uppercase">
							Filter Search
						</h2>
						<a
							href={section.href}
							class="rounded-full border border-[#0a0a0a]/10 px-2.5 py-1 text-[0.65rem] font-black tracking-[0.1em] text-[#0a0a0a] uppercase transition-colors hover:bg-[#fbf9f2]"
						>
							Clear
						</a>
					</div>

					<div class="space-y-3">
						<div>
							<label
								for="section-sidebar-q"
								class="mb-1 block text-[0.68rem] font-black tracking-[0.12em] uppercase"
							>
								Search
							</label>
							<input
								id="section-sidebar-q"
								name="q"
								type="search"
								bind:value={searchQuery}
								placeholder="Search by name, color..."
								class="h-9 w-full rounded-md border-[#0a0a0a]/15 bg-[#fbf9f2] text-xs font-semibold text-[#0a0a0a] placeholder:text-[#52524f]/70 focus:border-[#0a0a0a] focus:ring-[#0a0a0a]"
							/>
						</div>

						<div class="border-t border-[#0a0a0a]/10 pt-3">
							<h3 class="mb-2 text-[0.68rem] font-black tracking-[0.14em] uppercase">Category</h3>
							<div class="grid gap-1.5">
								<label
									class="flex min-h-8 cursor-pointer items-center justify-between rounded-md border px-2.5 text-xs font-bold transition-colors {selectedCategory ===
									''
										? 'border-[#0a0a0a] bg-[#0a0a0a] text-white'
										: 'border-[#0a0a0a]/10 bg-[#fbf9f2] text-[#52524f] hover:border-[#0a0a0a]/30 hover:text-[#0a0a0a]'}"
								>
									<span>All categories</span>
									<input
										class="sr-only"
										type="radio"
										name="category"
										value=""
										bind:group={selectedCategory}
									/>
								</label>
								{#each filterOptions.categories as category}
									<label
										class="flex min-h-8 cursor-pointer items-center justify-between gap-2 rounded-md border px-2.5 text-xs font-bold transition-colors {selectedCategory ===
										category.slug
											? 'border-[#0a0a0a] bg-[#0a0a0a] text-white'
											: 'border-[#0a0a0a]/10 bg-[#fbf9f2] text-[#52524f] hover:border-[#0a0a0a]/30 hover:text-[#0a0a0a]'}"
									>
										<span>{category.name}</span>
										<input
											class="sr-only"
											type="radio"
											name="category"
											value={category.slug}
											bind:group={selectedCategory}
										/>
									</label>
								{/each}
							</div>
						</div>

						<div class="border-t border-[#0a0a0a]/10 pt-3">
							<h3 class="mb-2 text-[0.68rem] font-black tracking-[0.14em] uppercase">Color</h3>
							<div class="grid grid-cols-2 gap-1.5">
								<label
									class="flex min-h-8 cursor-pointer items-center gap-2 rounded-md border px-2.5 text-xs font-bold transition-colors {selectedColor ===
									''
										? 'border-[#0a0a0a] bg-[#0a0a0a] text-white'
										: 'border-[#0a0a0a]/10 bg-[#fbf9f2] text-[#52524f] hover:border-[#0a0a0a]/30 hover:text-[#0a0a0a]'}"
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
									/>
								</label>
								{#each filterOptions.colors as color}
									<label
										class="flex min-h-8 cursor-pointer items-center gap-2 rounded-md border px-2.5 text-xs font-bold transition-colors {selectedColor ===
										color
											? 'border-[#0a0a0a] bg-[#0a0a0a] text-white'
											: 'border-[#0a0a0a]/10 bg-[#fbf9f2] text-[#52524f] hover:border-[#0a0a0a]/30 hover:text-[#0a0a0a]'}"
									>
										<span
											class="h-3.5 w-3.5 rounded-full border border-[#0a0a0a]/20 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.35)]"
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
										/>
									</label>
								{/each}
							</div>
						</div>

						<div class="border-t border-[#0a0a0a]/10 pt-3">
							<h3 class="mb-2 text-[0.68rem] font-black tracking-[0.14em] uppercase">Size</h3>
							<div class="flex flex-wrap gap-1.5">
								<label
									class="inline-flex min-h-8 cursor-pointer items-center rounded-full border px-3 text-xs font-black transition-colors {selectedSize ===
									''
										? 'border-[#0a0a0a] bg-[#0a0a0a] text-white'
										: 'border-[#0a0a0a]/10 bg-[#fbf9f2] text-[#52524f] hover:border-[#0a0a0a]/30 hover:text-[#0a0a0a]'}"
								>
									All
									<input
										class="sr-only"
										type="radio"
										name="size"
										value=""
										bind:group={selectedSize}
									/>
								</label>
								{#each filterOptions.sizes as size}
									<label
										class="inline-flex min-h-8 cursor-pointer items-center rounded-full border px-3 text-xs font-black transition-colors {selectedSize ===
										size
											? 'border-[#0a0a0a] bg-[#0a0a0a] text-white'
											: 'border-[#0a0a0a]/10 bg-[#fbf9f2] text-[#52524f] hover:border-[#0a0a0a]/30 hover:text-[#0a0a0a]'}"
									>
										{size}
										<input
											class="sr-only"
											type="radio"
											name="size"
											value={size}
											bind:group={selectedSize}
										/>
									</label>
								{/each}
							</div>
						</div>
					</div>

					<button
						type="submit"
						class="mt-4 inline-flex min-h-9 w-full items-center justify-center rounded-full bg-[#0a0a0a] px-4 text-xs font-black tracking-[0.1em] text-white uppercase transition-colors hover:bg-[#c5a880] hover:text-[#0a0a0a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0a0a0a]"
					>
						Apply Filters
					</button>
				</form>
			</aside>

			<div class="min-w-0 flex-1">
				{#if products.length}
					<div class="grid auto-rows-fr grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
						{#each products as item}
							<ProductCard product={item} aspectRatio="aspect-[5/6]" />
						{/each}
					</div>
				{:else}
					<div
						class="rounded-md border border-dashed border-[#0a0a0a]/18 bg-white/80 px-5 py-16 text-center shadow-[0_16px_38px_rgba(20,53,45,0.06)]"
					>
						<p class="font-serif text-2xl text-[#0a0a0a]">No abayas found</p>
						<p class="mx-auto mt-3 max-w-md text-sm leading-6 font-medium text-[#52524f]">
							This section has no active products right now.
						</p>
						<a
							href="/shop"
							class="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-[#0a0a0a] px-6 text-sm font-bold text-white transition-colors hover:bg-[#c5a880] hover:text-[#0a0a0a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0a0a0a]"
						>
							View Shop
						</a>
					</div>
				{/if}

				{#if pagination.totalPages > 1}
					<nav
						class="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#0a0a0a]/10 pt-8 text-sm font-bold text-[#0a0a0a] sm:flex-row"
						aria-label={`${section.title} pagination`}
					>
						{#if pagination.hasPrevious}
							<a
								href={pageHref(pagination.previousPage)}
								class="inline-flex min-h-10 items-center justify-center rounded-full border border-[#0a0a0a]/12 bg-white px-5 transition-colors hover:border-[#c5a880] hover:bg-[#c5a880] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0a0a0a]"
							>
								Previous
							</a>
						{:else}
							<span
								class="inline-flex min-h-10 cursor-not-allowed items-center justify-center rounded-full border border-[#0a0a0a]/8 bg-white/50 px-5 text-[#52524f]/55"
							>
								Previous
							</span>
						{/if}

						<div class="flex flex-wrap items-center justify-center gap-2">
							{#each visiblePages as page, index}
								{#if index > 0 && page - visiblePages[index - 1] > 1}
									<span class="px-1 text-[#52524f]">...</span>
								{/if}
								{#if page === pagination.page}
									<span
										aria-current="page"
										class="inline-flex h-10 min-w-10 items-center justify-center rounded-full bg-[#0a0a0a] px-3 text-white"
									>
										{page}
									</span>
								{:else}
									<a
										href={pageHref(page)}
										class="inline-flex h-10 min-w-10 items-center justify-center rounded-full border border-[#0a0a0a]/12 bg-white px-3 transition-colors hover:border-[#c5a880] hover:bg-[#c5a880] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0a0a0a]"
									>
										{page}
									</a>
								{/if}
							{/each}
						</div>

						{#if pagination.hasNext}
							<a
								href={pageHref(pagination.nextPage)}
								class="inline-flex min-h-10 items-center justify-center rounded-full border border-[#0a0a0a]/12 bg-white px-5 transition-colors hover:border-[#c5a880] hover:bg-[#c5a880] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0a0a0a]"
							>
								Next
							</a>
						{:else}
							<span
								class="inline-flex min-h-10 cursor-not-allowed items-center justify-center rounded-full border border-[#0a0a0a]/8 bg-white/50 px-5 text-[#52524f]/55"
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
