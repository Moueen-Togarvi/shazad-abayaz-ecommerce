<script lang="ts">
	import { cart } from '$lib/client/cart.svelte';
	import { productPixelPayload, trackAddToCart } from '$lib/client/pixels';
	import WishlistButton from '$lib/components/WishlistButton.svelte';
	import { cloudinaryUrl } from '$lib/shared/cloudinary-image';
	import { formatMoney } from '$lib/shared/money';

	let {
		product,
		layout = 'grid',
		aspectRatio = 'aspect-[3/4]',
		class: className = ''
	} = $props<{
		product: any;
		layout?: 'grid' | 'list';
		aspectRatio?: string;
		class?: string;
	}>();

	let href = $derived(`/shop/${product.slug}`);

	let image = $derived(product.images?.[0]?.url || '/image.png');
	let cardImage = $derived(cloudinaryUrl(image, 480));

	let isOutOfStock = $derived(
		!product.variants?.some((variant: any) => Number(variant.stockCount || 0) > 0)
	);

	function primaryVariant(item: any) {
		return (
			item.variants?.find((variant: any) => Number(variant.stockCount || 0) > 0) ||
			item.variants?.[0]
		);
	}

	let variant = $derived(primaryVariant(product));

	function productPrice(item: any) {
		return Number(item.salePrice || item.price);
	}

	function handleAddToCart(event: MouseEvent) {
		event.preventDefault();
		event.stopPropagation();

		if (isOutOfStock) return;

		cart.addItem({
			id: variant?.id || product.id,
			productId: product.id,
			variantId: variant?.id,
			name: product.name,
			price: productPrice(product),
			quantity: 1,
			image: image,
			color: variant?.color,
			size: variant?.size
		});

		trackAddToCart(productPixelPayload(product));
	}

	let colors = $derived([
		...new Set(
			product.variants
				?.map((v: any) => v.color as string)
				.filter((c: any) => c && c.toLowerCase() !== 'default')
		)
	] as string[]);

	let variantColorHexes = $derived(
		(product.variants || []).reduce((map: Record<string, string>, v: any) => {
			if (v.color && v.colorHex) map[v.color.toLowerCase().trim()] = v.colorHex;
			return map;
		}, {})
	);

	let discountPercent = $derived(
		product.salePrice && product.price
			? Math.round(
					((Number(product.price) - Number(product.salePrice)) / Number(product.price)) * 100
				)
			: 0
	);

	function getColorHex(colorName: string) {
		const colorsMap: Record<string, string> = {
			black: '#000000',
			white: '#ffffff',
			red: '#ef4444',
			blue: '#3b82f6',
			green: '#22c55e',
			yellow: '#eab308',
			purple: '#a855f7',
			pink: '#ec4899',
			orange: '#f97316',
			gray: '#6b7280',
			grey: '#6b7280',
			cream: '#fbf9f2',
			gold: '#c5a880',
			emerald: '#0f766e',
			navy: '#1e3a8a',
			beige: '#e1c699',
			maroon: '#800000',
			plum: '#dddae8',
			lavender: '#e6e6fa',
			olive: '#808000',
			indigo: '#4b0082'
		};
		const key = colorName.toLowerCase().trim();
		return variantColorHexes[key] || colorsMap[key] || '#d1d5db';
	}
</script>

<article
	class="group flex h-full overflow-hidden rounded-xl border border-[#0a0a0a]/6 bg-white shadow-[0_8px_24px_rgba(20,53,45,0.01)] transition-all duration-300 hover:-translate-y-1 hover:border-[#0a0a0a]/12 hover:shadow-[0_16px_36px_rgba(20,53,45,0.04)] {layout ===
	'list'
		? 'flex-col sm:flex-row'
		: 'flex-col'} {className}"
>
	<!-- Image Container -->
	<div
		class="relative block overflow-hidden bg-[#d8c3b6] {layout === 'list'
			? `w-full sm:w-64 sm:shrink-0 ${aspectRatio}`
			: `w-full ${aspectRatio}`}"
	>
		<a {href} class="block h-full w-full" aria-label={`View ${product.name}`}>
			<img
				src={cardImage}
				alt={product.name}
				width="480"
				height="640"
				loading="lazy"
				decoding="async"
				style="height: 100%; width: auto; max-width: 100%; margin-inline: auto; object-fit: contain; object-position: center;"
			/>
		</a>

		<!-- Red Sale Badge on top-left of image -->
		{#if product.salePrice}
			<span
				class="absolute top-3 left-3 z-10 rounded bg-red-600 px-2 py-0.5 text-[0.55rem] font-bold tracking-[0.1em] text-white uppercase shadow-sm sm:text-[0.6rem]"
			>
				Sale
			</span>
		{/if}

		<!-- Wishlist Floating Button -->
		<WishlistButton
			{product}
			class="absolute top-3 right-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#0a0a0a] shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-[#0a0a0a] hover:text-white"
			savedClass="bg-[#c5a880] border-[#c5a880] text-[#0a0a0a]"
			iconClass="h-4 w-4"
		/>

		<!-- Quick Add Cart Button on bottom-right of image -->
		{#if !isOutOfStock}
			<button
				type="button"
				onclick={handleAddToCart}
				class="absolute right-3 bottom-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#0a0a0a] shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-[#c5a880] hover:text-[#0a0a0a]"
				aria-label="Add to cart"
			>
				<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.8"
						d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
					/>
				</svg>
			</button>
		{/if}

		<!-- Out of stock overlay -->
		{#if isOutOfStock}
			<div
				class="absolute inset-0 z-10 flex items-center justify-center bg-[#0a0a0a]/40 backdrop-blur-[1px]"
			>
				<span
					class="rounded-full bg-white/95 px-3 py-1 text-[0.62rem] font-bold tracking-[0.15em] text-red-600 uppercase shadow-sm"
				>
					Sold Out
				</span>
			</div>
		{/if}

		<svg
			class="pointer-events-none absolute right-0 bottom-0 left-0 z-20 h-[10px] w-full text-white"
			viewBox="0 0 360 20"
			preserveAspectRatio="none"
			aria-hidden="true"
		>
			<path
				d="M0 20V9.3C64-2.7 112 12 174 7 242.5 1.3 296 2.7 360 11.7V20H0Z"
				fill="currentColor"
			/>
		</svg>
	</div>

	<!-- Info Container -->
	<div
		class="relative z-10 flex flex-1 flex-col justify-between bg-white p-2.5 pt-2 text-left shadow-[inset_0_1px_0_rgba(0,0,0,0.08)] sm:p-3 sm:pt-2.5"
	>
		<svg
			class="pointer-events-none absolute top-2 right-0 size-28 text-black/16 sm:size-36"
			fill="none"
			viewBox="0 0 120 120"
			aria-hidden="true"
		>
			<path
				d="M86 8c-10 18-13 36-8 54 4 16 2 30-8 42"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
			/>
			<path
				d="M78 36c18-5 27-15 29-30-18 3-28 13-29 30ZM76 58c18 1 30-6 37-20-18-2-31 5-37 20ZM69 82c15 6 28 3 39-8-15-7-29-4-39 8ZM82 28c-15 1-26-5-33-18 16-2 28 5 33 18ZM77 52c-14-2-24-11-29-26 16 1 26 10 29 26Z"
				stroke="currentColor"
				stroke-width="1.8"
				stroke-linejoin="round"
			/>
			<circle cx="87" cy="66" r="2" fill="currentColor" />
			<circle cx="78" cy="76" r="1.5" fill="currentColor" />
			<circle cx="94" cy="78" r="1.5" fill="currentColor" />
		</svg>

		<div class="relative z-10 space-y-2">
			<div class="flex items-center justify-between gap-2">
				<span
					class="inline-flex items-center gap-1 rounded bg-[#0a0a0a] px-1.5 py-0.5 text-[0.42rem] font-black text-white uppercase shadow-[0_6px_14px_rgba(0,0,0,0.2)] sm:text-[0.48rem]"
				>
					<svg class="size-2.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
						<path
							d="M10 1.8 12.7 7.3l6.1.9-4.4 4.3 1 6.1L10 15.7l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L10 1.8Z"
						/>
					</svg>
					Premium
				</span>

				{#if colors.length > 0}
					<div class="flex shrink-0 items-center gap-1">
						{#each colors.slice(0, 3) as color}
							<span
								class="size-2 rounded-full border border-black/10 shadow-sm sm:size-2.5"
								style="background-color: {getColorHex(color)}"
								title={color}
							></span>
						{/each}
					</div>
				{/if}
			</div>

			<a
				{href}
				class="relative block font-serif text-[0.78rem] leading-tight font-black text-[#1a1a1a] uppercase transition-colors hover:text-black sm:line-clamp-2 sm:text-[0.95rem]"
			>
				{product.name}
			</a>

			<div
				class="relative grid grid-cols-2 overflow-hidden rounded-lg border border-[#e5e5e5] bg-gray-50/95 text-[#4a4a4a] shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
			>
				<svg
					class="pointer-events-none absolute inset-y-2 left-1/2 h-auto w-1 -translate-x-1/2 text-black/45"
					viewBox="0 0 4 48"
					preserveAspectRatio="none"
					aria-hidden="true"
				>
					<path
						d="M2 2v44"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-dasharray="1 7"
					/>
				</svg>

				<div class="flex min-w-0 items-center justify-center gap-1 px-1 py-1">
					<svg class="size-4 shrink-0 text-[#0a0a0a]" fill="currentColor" viewBox="0 0 20 20">
						<path
							d="M17.7 9.3 10.7 2.3A1 1 0 0 0 10 2H3a1 1 0 0 0-1 1v7c0 .3.1.5.3.7l7 7a1 1 0 0 0 1.4 0l7-7a1 1 0 0 0 0-1.4ZM6 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"
						/>
					</svg>
					<span class="text-[0.46rem] leading-tight font-black uppercase sm:text-[0.54rem]">
						{discountPercent || 20}% Off Sale
					</span>
				</div>

				<div class="flex min-w-0 items-center justify-center gap-1 px-1 py-1">
					<svg class="size-4 shrink-0 text-[#2a2a2a]" fill="currentColor" viewBox="0 0 20 20">
						<path
							d="M5 5a3 3 0 1 1 5 2.2A3 3 0 1 1 15 5h1a1 1 0 0 1 1 1v3H3V6a1 1 0 0 1 1-1h1Zm2 0h2a1 1 0 1 0-1-1 1 1 0 0 0-1 1Zm4 0h2a1 1 0 1 0-1-1 1 1 0 0 0-1 1ZM3 11h6v7H5a2 2 0 0 1-2-2v-5Zm8 7v-7h6v5a2 2 0 0 1-2 2h-4Z"
						/>
					</svg>
					<span class="text-[0.46rem] leading-tight font-black uppercase sm:text-[0.54rem]">
						Limited Offer
					</span>
				</div>
			</div>
		</div>

		<div class="relative z-10 mt-2 pt-1.5">
			<svg
				class="absolute top-0 left-0 h-3 w-full text-[#d9d9d9]"
				viewBox="0 0 320 16"
				preserveAspectRatio="none"
				aria-hidden="true"
			>
				<path
					d="M0 9c24-8 45 8 69 0s45-8 69 0 45 8 69 0 45-8 69 0 30 4 44 0"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
				/>
			</svg>

			<div class="flex items-center justify-between gap-1 pt-1.5 sm:gap-2">
				<div class="w-[3.85rem] min-w-0 sm:w-[5.8rem]">
					<div class="flex items-baseline gap-1 whitespace-nowrap sm:gap-1.5">
						<span class="text-[0.74rem] font-black text-[#0a0a0a] tabular-nums sm:text-[1.08rem]">
							{formatMoney(product.salePrice || product.price)}
						</span>
						{#if product.salePrice}
							<span
								class="text-[0.46rem] font-bold text-red-600 tabular-nums line-through sm:text-[0.68rem]"
							>
								{formatMoney(product.price)}
							</span>
						{/if}
					</div>
				</div>

				{#if isOutOfStock}
					<button
						disabled
						class="inline-flex min-h-7 cursor-not-allowed items-center justify-center rounded-full bg-gray-100 px-2.5 text-[0.56rem] font-black text-gray-400 uppercase sm:min-h-8 sm:px-3 sm:text-[0.68rem]"
					>
						Sold Out
					</button>
				{:else}
					<a
						{href}
						class="inline-flex min-h-6 shrink-0 items-center justify-center gap-0.5 rounded-full bg-[#0a0a0a] px-1.5 text-[0.48rem] font-black text-white shadow-[0_8px_18px_rgba(0,0,0,0.22)] transition-colors duration-200 hover:bg-[#242424] sm:min-h-8 sm:gap-1.5 sm:px-3 sm:text-[0.68rem]"
					>
						<svg class="size-2.5 sm:size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13 5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
							/>
						</svg>
						Buy Now
					</a>
				{/if}
			</div>
		</div>
	</div>
</article>
