<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { cart } from '$lib/client/cart.svelte';
	import { productPixelPayload, trackAddToCart, trackProductView } from '$lib/client/pixels';
	import WishlistButton from '$lib/components/WishlistButton.svelte';
	import { formatMoney } from '$lib/shared/money';
	import { SITE_NAME, absoluteUrl, jsonLdScript, metaDescription } from '$lib/shared/seo';

	let { data } = $props();
	let product = $derived(data.product as any);
	let relatedProducts = $derived((data.relatedProducts || []) as Array<any>);

	let activeImage = $state(0);
	let quantity = $state(1);
	let activeTab = $state('details');

	let images = $derived(product.images?.map((image: any) => image.url) || []);
	let colors = $derived(
		Array.from(
			new Set<string>(
				(product.variants || [])
					.map((variant: any) => String(variant.color || ''))
					.filter((c: string) => c && c.toLowerCase() !== 'default')
			)
		)
	);
	let selectedColor = $state('');
	let selectedSize = $state('');
	let availableSizes = $derived(
		(product.variants || [])
			.filter((variant: any) => !selectedColor || variant.color === selectedColor)
			.map((variant: any) => variant.size)
			.filter(
				(size: string, index: number, list: string[]) =>
					size && size.toLowerCase() !== 'default' && list.indexOf(size) === index
			)
	);
	let selectedVariant = $derived(
		(product.variants || []).find(
			(variant: any) => variant.color === selectedColor && variant.size === selectedSize
		) || product.variants?.[0]
	);
	let productOutOfStock = $derived(
		!product.variants?.some((variant: any) => Number(variant.stockCount || 0) > 0)
	);
	let selectedVariantOutOfStock = $derived(
		productOutOfStock || !selectedVariant || Number(selectedVariant.stockCount || 0) < quantity
	);
	let productTitle = $derived(product.metaTitle || `${product.name} | ${SITE_NAME}`);
	let productDescription = $derived(
		metaDescription(
			product.metaDescription || product.description,
			`${product.name} by ${SITE_NAME}: premium modest abaya with refined finishing and easy styling.`
		)
	);
	let productUrl = $derived(absoluteUrl(`/shop/${product.slug}`, page.url.origin));
	let productSocialImage = $derived(
		absoluteUrl(images[0] || productImage(product), page.url.origin)
	);
	let productJsonLd = $derived(
		jsonLdScript([
			{
				'@context': 'https://schema.org',
				'@type': 'Product',
				name: product.name,
				description: productDescription,
				image: (images.length ? images : [productImage(product)]).map((image: string) =>
					absoluteUrl(image, page.url.origin)
				),
				sku: selectedVariant?.sku || product.slug,
				brand: {
					'@type': 'Brand',
					name: SITE_NAME
				},
				category: product.collections?.map((collection: any) => collection.name).join(', '),
				offers: {
					'@type': 'Offer',
					url: productUrl,
					priceCurrency: 'PKR',
					price: String(Number(product.salePrice || product.price)),
					availability: productOutOfStock
						? 'https://schema.org/OutOfStock'
						: 'https://schema.org/InStock',
					itemCondition: 'https://schema.org/NewCondition'
				}
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
						name: 'Shop',
						item: absoluteUrl('/shop', page.url.origin)
					},
					{
						'@type': 'ListItem',
						position: 3,
						name: product.name,
						item: productUrl
					}
				]
			}
		])
	);

	const colorHex: Record<string, string> = {
		Black: '#101411',
		White: '#ffffff',
		Ivory: '#fff7ed',
		Emerald: '#047857',
		Midnight: '#111827',
		Sage: '#8fa99a',
		Olive: '#64763c',
		Charcoal: '#374151',
		Navy: '#172554'
	};

	function productImage(item: any) {
		return item.images?.[0]?.url || '/image.png';
	}

	$effect(() => {
		if (product.variants?.length) {
			if (!selectedColor) selectedColor = product.variants[0].color || '';
			if (!selectedSize) selectedSize = product.variants[0].size || '';
			if (!availableSizes.includes(selectedSize)) selectedSize = availableSizes[0] || '';
		}
	});

	$effect(() => {
		const stock = Number(selectedVariant?.stockCount || 0);
		if (stock > 0 && quantity > stock) quantity = stock;
		if (quantity < 1) quantity = 1;
	});

	function addToCart() {
		if (selectedVariantOutOfStock) return;

		const trackingPayload = productPixelPayload(product, quantity);

		cart.addItem({
			id: selectedVariant?.id || product.id,
			productId: product.id,
			variantId: selectedVariant?.id,
			name: product.name,
			price: Number(product.salePrice || product.price),
			quantity,
			image: images[0] || '',
			color: selectedColor,
			size: selectedSize
		});

		trackAddToCart(trackingPayload);
	}

	function buyNow() {
		if (selectedVariantOutOfStock) return;

		addToCart();
		goto('/checkout');
	}

	onMount(() => {
		trackProductView(productPixelPayload(product));
	});
</script>

<svelte:head>
	<title>{productTitle}</title>
	<meta name="description" content={productDescription} />
	<meta property="og:type" content="product" />
	<meta property="og:title" content={productTitle} />
	<meta property="og:description" content={productDescription} />
	<meta property="og:image" content={productSocialImage} />
	<meta
		property="product:price:amount"
		content={String(Number(product.salePrice || product.price))}
	/>
	<meta property="product:price:currency" content="PKR" />
	<meta name="twitter:title" content={productTitle} />
	<meta name="twitter:description" content={productDescription} />
	{@html productJsonLd}
</svelte:head>

<div class="border-b border-black/5 bg-cream/50">
	<div class="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
		<nav class="flex flex-wrap text-xs tracking-widest text-gray-500 uppercase">
			<a href="/" class="transition-colors hover:text-black">Home</a>
			<span class="mx-2">/</span>
			<a href="/shop" class="transition-colors hover:text-black">Shop</a>
			{#if product.collections?.[0]}
				<span class="mx-2">/</span>
				<a
					href={`/shop?collection=${product.collections[0].slug}`}
					class="transition-colors hover:text-black"
				>
					{product.collections[0].name}
				</a>
			{/if}
			<span class="mx-2">/</span>
			<span class="text-black">{product.name}</span>
		</nav>
	</div>
</div>

<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
	<div class="flex flex-col gap-12 lg:flex-row lg:gap-20">
		<div class="flex w-full flex-col-reverse gap-4 lg:w-1/2 lg:flex-row">
			<div
				class="flex flex-shrink-0 gap-4 overflow-x-auto pb-2 lg:w-20 lg:flex-col lg:overflow-visible lg:pb-0"
			>
				{#each images as image, index}
					<button
						type="button"
						class="h-20 w-16 flex-shrink-0 border-2 bg-gray-100 transition-colors lg:h-28 lg:w-20 {activeImage ===
						index
							? 'border-black'
							: 'border-transparent hover:border-gray-300'}"
						aria-label={`View product image ${index + 1}`}
						onclick={() => (activeImage = index)}
					>
						<img
							src={image}
							alt={`${product.name} ${index + 1}`}
							class="h-full w-full object-contain object-center"
						/>
					</button>
				{/each}
			</div>

			<div
				class="relative h-[380px] flex-grow overflow-hidden bg-gray-100 sm:h-[440px] lg:h-[480px]"
			>
				{#if product.salePrice}
					<div
						class="absolute top-4 left-4 z-10 bg-white/90 px-3 py-1.5 text-xs font-bold tracking-widest text-black uppercase backdrop-blur"
					>
						Sale
					</div>
				{/if}
				{#if productOutOfStock}
					<div
						class="absolute top-4 right-4 z-10 bg-red-600 px-3 py-1.5 text-xs font-bold tracking-widest text-white uppercase"
					>
						Out of Stock
					</div>
				{/if}
				<img
					src={images[activeImage] || productImage(product)}
					alt={product.name}
					class="h-full w-full object-contain object-center"
				/>
			</div>
		</div>

		<div class="flex w-full flex-col lg:w-1/2">
			<div class="mb-8">
				<p class="mb-3 text-xs font-bold tracking-[0.18em] text-gold uppercase">
					{product.collections?.map((collection: any) => collection.name).join(' / ') || 'Abayiza'}
				</p>
				<h1 class="mb-2 font-serif text-3xl tracking-wide text-black md:text-4xl">
					{product.name}
				</h1>
				<div class="mb-4 flex items-center space-x-4">
					<p class="text-2xl font-light text-black">
						{formatMoney(product.salePrice || product.price)}
					</p>
					{#if product.salePrice}
						<p class="text-xl font-light text-red-600 line-through">{formatMoney(product.price)}</p>
					{/if}
				</div>
				<p class="text-sm leading-relaxed font-light whitespace-pre-wrap text-gray-600">
					{product.description}
				</p>
			</div>

			{#if colors.length > 0}
				<div class="mb-6">
					<div class="mb-3 flex items-end justify-between">
						<span class="text-sm font-medium tracking-widest uppercase">
							Color:
							<span class="ml-1 font-light text-gray-500 normal-case">{selectedColor}</span>
						</span>
					</div>
					<div class="flex flex-wrap gap-3">
						{#each colors as color}
							<button
								type="button"
								onclick={() => (selectedColor = color)}
								class="h-8 w-8 rounded-full border border-gray-200 ring-1 ring-offset-2 transition-all {selectedColor ===
								color
									? 'ring-black'
									: 'ring-transparent hover:ring-gray-300'}"
								style={`background-color: ${colorHex[color] || '#d9d0bd'}`}
								title={color}
								aria-label={`Select ${color}`}
							></button>
						{/each}
					</div>
				</div>
			{/if}

			{#if availableSizes.length > 0}
				<div class="mb-8">
					<div class="mb-3 flex items-end justify-between">
						<span class="text-sm font-medium tracking-widest uppercase">
							Size:
							<span class="ml-1 font-light text-gray-500 normal-case">{selectedSize}</span>
						</span>
						<a
							href="/size-guide"
							class="text-xs text-gray-500 underline transition-colors hover:text-black"
						>
							Size Guide
						</a>
					</div>
					<div class="grid grid-cols-3 gap-3 sm:grid-cols-4">
						{#each availableSizes as size}
							<button
								type="button"
								onclick={() => (selectedSize = size)}
								class="border py-3 text-sm font-medium transition-colors {selectedSize === size
									? 'border-black bg-black text-white'
									: 'border-gray-200 text-black hover:border-black'}"
							>
								{size}
							</button>
						{/each}
					</div>
					{#if selectedVariant}
						<p
							class="mt-2 text-xs font-light {Number(selectedVariant.stockCount || 0) > 0
								? 'text-gray-500'
								: 'text-red-600'}"
						>
							{Number(selectedVariant.stockCount || 0) > 0
								? `${selectedVariant.stockCount} available in this option`
								: 'Out of stock in this option'}
						</p>
					{/if}
				</div>
			{/if}

			<div class="mb-10 flex flex-col gap-4 sm:flex-row">
				<div class="flex h-14 w-full border border-gray-300 sm:w-32">
					<button
						type="button"
						disabled={productOutOfStock}
						class="flex w-10 items-center justify-center text-gray-500 transition-colors hover:bg-gray-50 hover:text-black disabled:cursor-not-allowed disabled:text-gray-300"
						onclick={() => (quantity = quantity > 1 ? quantity - 1 : 1)}
					>
						-
					</button>
					<input
						type="number"
						class="w-full border-none bg-transparent text-center text-sm font-medium focus:ring-0"
						bind:value={quantity}
						min="1"
					/>
					<button
						type="button"
						disabled={productOutOfStock ||
							(selectedVariant && quantity >= Number(selectedVariant.stockCount || 0))}
						class="flex w-10 items-center justify-center text-gray-500 transition-colors hover:bg-gray-50 hover:text-black disabled:cursor-not-allowed disabled:text-gray-300"
						onclick={() => quantity++}
					>
						+
					</button>
				</div>

				<div class="grid flex-1 gap-3 sm:grid-cols-[1fr_1fr_auto]">
					<button
						type="button"
						disabled={selectedVariantOutOfStock}
						class="flex h-14 items-center justify-center gap-2 bg-black px-4 text-sm tracking-widest text-white uppercase transition-colors hover:bg-gold disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600"
						onclick={addToCart}
					>
						<span>{selectedVariantOutOfStock ? 'Out of Stock' : 'Add to Bag'}</span>
					</button>
					<button
						type="button"
						disabled={selectedVariantOutOfStock}
						class="flex h-14 items-center justify-center gap-2 bg-[#c5a880] px-4 text-sm font-bold tracking-widest text-[#0a0a0a] uppercase transition-colors hover:bg-[#0a0a0a] hover:text-white disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600"
						onclick={buyNow}
					>
						<span>{selectedVariantOutOfStock ? 'Unavailable' : 'Buy Now'}</span>
						<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.8"
								d="M5 12h14M13 6l6 6-6 6"
							/>
						</svg>
					</button>
					<WishlistButton
						{product}
						class="flex h-14 w-full items-center justify-center border border-gray-300 bg-white text-black transition-colors hover:border-gold hover:bg-gold sm:w-14"
						iconClass="h-5 w-5"
					/>
				</div>
			</div>

			<div class="mb-10 flex items-start space-x-4 border border-gray-100 bg-gray-50 p-4">
				<div>
					<p class="mb-1 text-sm font-medium">WhatsApp catalog source</p>
					<a
						href={`https://wa.me/923116857822?text=${encodeURIComponent(`I want to ask about ${product.name}`)}`}
						target="_blank"
						rel="noreferrer"
						class="text-xs font-semibold text-green-700 underline"
					>
						Chat with Abayiza on WhatsApp
					</a>
					<a
						href={`https://wa.me/923346657779?text=${encodeURIComponent(`I want to ask about ${product.name}`)}`}
						target="_blank"
						rel="noreferrer"
						class="mt-2 block text-xs font-semibold text-green-700 underline"
					>
						Chat on WhatsApp 2
					</a>
				</div>
			</div>

			<div class="border-t border-gray-200">
				<div class="flex space-x-8 border-b border-gray-200">
					<button
						type="button"
						class="relative py-4 text-sm font-medium tracking-widest uppercase {activeTab ===
						'details'
							? 'text-black'
							: 'text-gray-400 hover:text-black'}"
						onclick={() => (activeTab = 'details')}
					>
						Details
						{#if activeTab === 'details'}
							<span class="absolute bottom-0 left-0 h-[2px] w-full bg-black"></span>
						{/if}
					</button>
					<button
						type="button"
						class="relative py-4 text-sm font-medium tracking-widest uppercase {activeTab ===
						'shipping'
							? 'text-black'
							: 'text-gray-400 hover:text-black'}"
						onclick={() => (activeTab = 'shipping')}
					>
						Shipping & Returns
						{#if activeTab === 'shipping'}
							<span class="absolute bottom-0 left-0 h-[2px] w-full bg-black"></span>
						{/if}
					</button>
				</div>

				<div class="py-6 text-sm leading-relaxed font-light text-gray-600">
					{#if activeTab === 'details'}
						<ul class="space-y-2">
							<li>
								<strong>Fabric:</strong>
								{product.fabricDetails || 'Premium modestwear fabric'}
							</li>
							<li>
								<strong>Categories:</strong>
								{product.collections?.map((collection: any) => collection.name).join(', ')}
							</li>
							<li><strong>SKU:</strong> {selectedVariant?.sku || 'Available on request'}</li>
						</ul>
					{:else}
						<p class="mb-4">
							<strong>Shipping:</strong> Orders are prepared after confirmation on WhatsApp or checkout.
							Delivery charges and timings are confirmed before dispatch.
						</p>
						<p>
							<strong>Returns:</strong> Exchanges are handled according to product condition and availability.
							Please contact Abayiza support for help with sizing before ordering.
						</p>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>

{#if relatedProducts.length}
	<div class="border-t border-gray-100 bg-white py-20">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="mb-12 text-center">
				<h2 class="mb-4 font-serif text-2xl tracking-widest text-black uppercase">
					Related Products
				</h2>
				<div class="mx-auto h-[1px] w-12 bg-gold"></div>
			</div>

			<div class="grid grid-cols-2 gap-6 md:grid-cols-4">
				{#each relatedProducts as item}
					<div class="group">
						<div class="relative mb-4 aspect-[3/4] overflow-hidden bg-gray-100">
							<a href={`/shop/${item.slug}`} class="block h-full" aria-label={`View ${item.name}`}>
								<img
									src={productImage(item)}
									alt={item.name}
									class="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
								/>
							</a>
							<WishlistButton
								product={item}
								class="absolute right-3 bottom-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/80 bg-white/86 text-[#0a0a0a] shadow-[0_10px_22px_rgba(20,53,45,0.16)] backdrop-blur transition-colors hover:bg-[#c5a880]"
								iconClass="h-4 w-4"
							/>
							<a
								href={`/shop/${item.slug}`}
								class="absolute right-14 bottom-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/80 bg-white/86 text-[#0a0a0a] shadow-[0_10px_22px_rgba(20,53,45,0.16)] backdrop-blur transition-colors hover:bg-[#c5a880] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0a0a0a]"
								aria-label={`Open ${item.name} details`}
							>
								<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="1.8"
										d="M7 17L17 7M9 7h8v8"
									/>
								</svg>
							</a>
						</div>
						<a href={`/shop/${item.slug}`} class="block">
							<h3 class="mb-1 font-serif text-sm transition-colors group-hover:text-gold">
								{item.name}
							</h3>
							<p class="text-xs font-medium text-gray-500">
								{formatMoney(item.salePrice || item.price)}
							</p>
						</a>
					</div>
				{/each}
			</div>
		</div>
	</div>
{/if}
