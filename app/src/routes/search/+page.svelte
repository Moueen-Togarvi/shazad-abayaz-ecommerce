<script lang="ts">
	import { formatMoney } from '$lib/shared/money';
	import ProductCard from '$lib/components/ProductCard.svelte';
	import { trackSearch } from '$lib/client/pixels';

	let { data } = $props();
	let query = $derived((data.query || '') as string);
	let results = $derived((data.products || []) as Array<any>);
	let collections = $derived((data.collections || []) as Array<any>);
	let hasSearched = $derived(query.length > 0);
	let lastTrackedSearch = '';

	function productImage(product: any) {
		return product.images?.[0]?.url || product.collections?.[0]?.imageUrl || '/image.webp';
	}

	function isOutOfStock(product: any) {
		return !product.variants?.some((variant: any) => Number(variant.stockCount || 0) > 0);
	}

	$effect(() => {
		if (query.length < 2 || lastTrackedSearch === query) return;

		lastTrackedSearch = query;
		trackSearch(query, results.map((product) => String(product.id)).filter(Boolean));
	});
</script>

<svelte:head>
	<title>Search | Shahzad Abaya's</title>
</svelte:head>

<div class="mx-auto max-w-5xl px-4 py-12 sm:px-6 md:py-20 lg:px-8">
	<div class="mb-10 text-center">
		<h1 class="mb-8 font-serif text-3xl tracking-widest text-black uppercase md:text-4xl">
			Search
		</h1>
		<form action="/search" method="GET" class="mx-auto flex max-w-2xl items-stretch">
			<div class="relative flex-1">
				<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
					<svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
				</div>
				<input
					type="search"
					name="q"
					value={query}
					placeholder="Search products or categories..."
					class="h-14 w-full rounded-none border border-r-0 border-gray-300 bg-white pr-4 pl-12 text-sm transition-colors outline-none focus:border-black focus:ring-0"
				/>
			</div>
			<button
				type="submit"
				class="border border-black bg-black px-8 text-sm tracking-widest whitespace-nowrap text-white uppercase transition-colors hover:bg-gold"
			>
				Search
			</button>
		</form>
	</div>

	{#if !hasSearched}
		<div class="text-center">
			<p class="mb-4 text-xs tracking-widest text-gray-400 uppercase">Browse Categories</p>
			<div class="flex flex-wrap justify-center gap-2">
				{#each collections as collection}
					<a
						href={`/shop?collection=${collection.slug}`}
						class="border border-gray-200 px-4 py-2 text-sm text-gray-600 transition-colors hover:border-black hover:text-black"
					>
						{collection.name}
					</a>
				{/each}
			</div>
		</div>
	{:else if query.length < 2}
		<div class="py-16 text-center">
			<h2 class="mb-3 font-serif text-xl text-black">Type at least 2 characters</h2>
			<p class="font-light text-gray-500">
				Use a longer term to browse matching products and categories.
			</p>
		</div>
	{:else if results.length === 0}
		<div class="py-16 text-center">
			<h2 class="mb-3 font-serif text-xl text-black">No results for "{query}"</h2>
			<p class="mb-8 font-light text-gray-500">
				Try a different search term or browse all products.
			</p>
			<a
				href="/shop"
				class="inline-block bg-black px-10 py-4 text-sm tracking-widest text-white uppercase transition-colors hover:bg-gold"
			>
				Browse All Products
			</a>
		</div>
	{:else}
		<div>
			<p class="mb-8 text-sm font-light text-gray-500">
				<span class="font-medium text-black">
					{results.length} result{results.length > 1 ? 's' : ''}
				</span>
				for "{query}"
			</p>
			<div class="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-8 lg:grid-cols-4">
				{#each results as product}
					<ProductCard {product} aspectRatio="aspect-[5/6]" />
				{/each}
			</div>
		</div>
	{/if}
</div>
