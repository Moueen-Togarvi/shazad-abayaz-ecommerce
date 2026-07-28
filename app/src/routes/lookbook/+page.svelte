<script lang="ts">
	let { data } = $props();
	let products = $derived((data.products || []) as Array<any>);
	const lookbookDescription =
		'Explore the Abayiza lookbook for premium abaya styling, modest layers, nida essentials, and occasion outfit ideas.';

	function productImage(product: any) {
		return product.images?.[0]?.url || '/image.png';
	}
</script>

<svelte:head>
	<title>Lookbook | Abayiza</title>
	<meta name="description" content={lookbookDescription} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Lookbook | Abayiza" />
	<meta property="og:description" content={lookbookDescription} />
	<meta name="twitter:title" content="Lookbook | Abayiza" />
	<meta name="twitter:description" content={lookbookDescription} />
</svelte:head>

<section
	class="relative flex h-[55vh] min-h-[360px] items-end justify-center overflow-hidden pb-14"
>
	<div class="absolute inset-0 z-10 bg-black/45"></div>
	{#if products[0]}
		<img
			src={productImage(products[0])}
			alt={products[0].name}
			class="absolute inset-0 h-full w-full object-cover object-center"
		/>
	{/if}
	<div class="relative z-20 px-4 text-center">
		<p class="mb-3 text-sm tracking-widest text-white/70 uppercase">Abayiza Catalog</p>
		<h1 class="mb-4 font-serif text-4xl tracking-widest text-white uppercase md:text-6xl">
			The Lookbook
		</h1>
		<div class="mx-auto h-[1px] w-16 bg-white/40"></div>
	</div>
</section>

<div class="mx-auto max-w-2xl px-4 py-16 text-center">
	<h2 class="mb-6 font-serif text-2xl text-black">Style Meets Substance</h2>
	<p class="leading-relaxed font-light text-gray-500">
		Every look below is pulled from the products saved in the database.
	</p>
</div>

<div class="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
	{#if products.length}
		<div class="columns-1 gap-4 space-y-4 sm:columns-2 lg:columns-3">
			{#each products as item, index}
				<div
					class="group relative break-inside-avoid overflow-hidden {index === 1
						? 'mt-16'
						: ''} {index === 3 ? 'mt-8' : ''}"
				>
					<div
						class="overflow-hidden bg-gray-100 {index % 3 === 1 ? 'aspect-[2/3]' : 'aspect-[3/4]'}"
					>
						<img
							src={productImage(item)}
							alt={item.name}
							class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
						/>
					</div>
					<div
						class="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/40"
					>
						<div class="opacity-0 transition-opacity duration-300 group-hover:opacity-100">
							<a
								href={`/shop/${item.slug}`}
								class="inline-block bg-white px-6 py-3 text-xs tracking-widest text-black uppercase transition-colors hover:bg-gold hover:text-white"
							>
								Shop the Look
							</a>
						</div>
					</div>
					<div class="pt-4 pb-2">
						<h3 class="font-serif text-sm text-black">{item.name}</h3>
						<p class="mt-1 text-xs font-light text-gray-400">
							{item.collections?.map((collection: any) => collection.name).join(' / ')}
						</p>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<div class="border border-gray-200 bg-white p-10 text-center">
			<p class="font-serif text-2xl text-black">No catalog products yet</p>
			<a
				href="/abayiza-secure-admin-7k9x2p/products/new"
				class="mt-4 inline-block text-sm font-semibold text-blue-700 underline"
			>
				Add products in admin
			</a>
		</div>
	{/if}
</div>
