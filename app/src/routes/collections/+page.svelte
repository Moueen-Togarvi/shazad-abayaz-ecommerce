<script lang="ts">
	import { page } from '$app/state';
	import { SITE_NAME, absoluteUrl, jsonLdScript } from '$lib/shared/seo';

	let { data } = $props();
	let collections = $derived((data.collections || []) as Array<any>);
	let categorySearch = $state('');
	const collectionsDescription =
		'Browse Abayiza collections by modest edit, including everyday nida abayas, occasion layers, Eid pieces, and premium black abayas.';
	let collectionsJsonLd = $derived(
		jsonLdScript({
			'@context': 'https://schema.org',
			'@type': 'CollectionPage',
			name: `Collections | ${SITE_NAME}`,
			description: collectionsDescription,
			url: absoluteUrl('/collections', page.url.origin),
			mainEntity: {
				'@type': 'ItemList',
				itemListElement: collections.map((collection, index) => ({
					'@type': 'ListItem',
					position: index + 1,
					name: collection.name,
					url: absoluteUrl(`/shop?category=${collection.slug}`, page.url.origin)
				}))
			}
		})
	);

	const fallbackImages = [
		'/ChatGPT%20Image%20May%2025,%202026,%2006_25_42%20PM.png',
		'/abaya22.png',
		'/abaya11.png',
		'/ChatGPT%20Image%20May%2025,%202026,%2006_25_51%20PM.png',
		'/ChatGPT%20Image%20May%2025,%202026,%2006_25_13%20PM.png',
		'/ChatGPT%20Image%20May%2025,%202026,%2006_07_28%20PM.png'
	];

	const slugImages: Record<string, string> = {
		'nida-essentials': '/ChatGPT%20Image%20May%2025,%202026,%2006_25_42%20PM.png',
		occasion: '/abaya22.png',
		'daily-wear': '/abaya11.png',
		'premium-nida': '/ChatGPT%20Image%20May%2025,%202026,%2006_25_13%20PM.png',
		'eid-edit': '/ChatGPT%20Image%20May%2025,%202026,%2006_25_51%20PM.png'
	};

	let filteredCollections = $derived(
		collections.filter((collection) => {
			const query = categorySearch.trim().toLowerCase();
			if (!query) return true;

			return [collection.name]
				.filter(Boolean)
				.some((value) => String(value).toLowerCase().includes(query));
		})
	);

	function collectionImage(collection: any, index: number) {
		return (
			collection.imageUrl ||
			slugImages[collection.slug] ||
			fallbackImages[index % fallbackImages.length]
		);
	}

	function productCount(collection: any) {
		return Number(collection._count?.products || 0);
	}
</script>

<svelte:head>
	<title>Collections | Abayiza</title>
	<meta name="description" content={collectionsDescription} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={`Collections | ${SITE_NAME}`} />
	<meta property="og:description" content={collectionsDescription} />
	<meta name="twitter:title" content={`Collections | ${SITE_NAME}`} />
	<meta name="twitter:description" content={collectionsDescription} />
	{@html collectionsJsonLd}
</svelte:head>

<section class="bg-[#fbf9f2] px-4 py-10 text-[#14352d] sm:px-6 lg:px-8">
	<div class="mx-auto max-w-7xl">
		<div class="mb-8 border-b border-[#14352d]/10 pb-8">
			<p class="mb-3 text-xs font-black tracking-[0.2em] text-[#b58b2b] uppercase">
				Shop By Category
			</p>
			<div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
				<div>
					<h1 class="font-serif text-4xl leading-tight uppercase sm:text-5xl">Collections</h1>
					<p class="mt-4 max-w-2xl text-sm leading-6 font-medium text-[#596c62] sm:text-base">
						Browse Abayiza by edit: everyday nida, occasion layers, Eid pieces, and premium black
						abayas.
					</p>
				</div>

				<label class="relative block w-full max-w-lg">
					<span class="sr-only">Search categories</span>
					<span class="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[#596c62]">
						<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.8"
								d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
							/>
						</svg>
					</span>
					<input
						type="search"
						bind:value={categorySearch}
						placeholder="Search categories"
						class="min-h-12 w-full rounded-full border border-[#14352d]/10 bg-white pr-4 pl-11 text-sm font-bold text-[#14352d] shadow-[0_14px_34px_rgba(20,53,45,0.07)] placeholder:text-[#596c62]/60 focus:border-[#14352d] focus:ring-[#14352d]"
					/>
				</label>
			</div>
		</div>

		<div class="mb-6 flex flex-wrap items-center justify-between gap-3">
			<p class="text-sm font-bold text-[#596c62]">
				Showing {filteredCollections.length} categories
			</p>
			{#if categorySearch}
				<button
					type="button"
					class="rounded-full border border-[#14352d]/10 bg-white px-4 py-2 text-xs font-black tracking-[0.12em] text-[#14352d] uppercase transition-colors hover:bg-[#14352d] hover:text-white"
					onclick={() => (categorySearch = '')}
				>
					Clear Search
				</button>
			{/if}
		</div>

		{#if filteredCollections.length}
			<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
				{#each filteredCollections as collection, index}
					<a
						href={`/shop?collection=${collection.slug}`}
						class="group overflow-hidden rounded-md border border-[#14352d]/10 bg-white shadow-[0_18px_42px_rgba(20,53,45,0.1)] transition-transform duration-300 hover:-translate-y-1"
					>
						<div class="relative aspect-[4/3] overflow-hidden bg-[#e4eee9]">
							<img
								src={collectionImage(collection, index)}
								alt={collection.name}
								width="1200"
								height="900"
								class="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]"
							/>
							<div
								class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#14352d]/82 to-transparent p-4"
							>
								<span
									class="inline-flex rounded-full bg-white/92 px-3 py-1 text-[0.66rem] font-black tracking-[0.12em] text-[#14352d] uppercase"
								>
									{productCount(collection)} Pieces
								</span>
							</div>
						</div>
						<div class="p-5">
							<div class="flex items-start justify-between gap-4">
								<h2
									class="font-serif text-2xl leading-tight text-[#14352d] transition-colors group-hover:text-[#b58b2b]"
								>
									{collection.name}
								</h2>
								<span
									class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#14352d]/10 bg-[#fbf9f2] text-[#14352d] transition-colors group-hover:bg-[#e4b43d]"
									aria-hidden="true"
								>
									<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="1.8"
											d="M7 17L17 7M9 7h8v8"
										/>
									</svg>
								</span>
							</div>
							<p class="mt-5 text-xs font-black tracking-[0.14em] text-[#b58b2b] uppercase">
								Shop Category
							</p>
						</div>
					</a>
				{/each}
			</div>
		{:else}
			<div
				class="rounded-md border border-[#14352d]/10 bg-white p-10 text-center shadow-[0_16px_38px_rgba(20,53,45,0.08)]"
			>
				<p class="font-serif text-2xl text-[#14352d]">No categories found</p>
				<p class="mt-3 text-sm font-medium text-[#596c62]">Try another category name.</p>
			</div>
		{/if}
	</div>
</section>
