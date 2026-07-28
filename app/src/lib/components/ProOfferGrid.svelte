<script lang="ts">
	import { formatMoney } from '$lib/shared/money';

	let { products = [], onAddToCart } = $props<{
		products?: any[];
		onAddToCart?: (product: any) => void;
	}>();

	let selectedColor = $state('Midnight');
	let selectedSize = $state('M (54)');

	// Try to find Haya Everyday Abaya or Emerald Layered Abaya in products
	let spotlightProduct = $derived(
		products.find((p: any) => p.slug.includes('haya') || p.slug.includes('emerald')) ||
			products[0] || {
				id: 'default-spotlight',
				name: 'Haya Soft Nida Abaya',
				price: 7200,
				salePrice: null,
				description: 'Clean silhouette in deep midnight black, featuring a soft graceful fall.',
				images: [{ url: '/abaya11.png' }]
			}
	);

	function handleSpotlightAddToCart() {
		if (onAddToCart) {
			onAddToCart(spotlightProduct);
		}
	}
</script>

<section class="border-t border-[#14352d]/8 bg-[#fbf9f2] px-4 py-16 sm:px-6 lg:px-8">
	<div class="mx-auto max-w-6xl">
		<!-- Section Header -->
		<div class="mb-12 text-center">
			<p class="mb-2 text-xs font-bold tracking-[0.25em] text-[#8a7444] uppercase">Special Offers</p>
			<h2 class="font-serif text-3xl font-black leading-tight text-[#14352d] uppercase sm:text-4xl">
				Exclusive Deals & Edits
			</h2>
			<div class="h-[3px] w-12 mt-3.5 rounded bg-[#e4b43d] mx-auto"></div>
		</div>

		<div class="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
			<!-- COLUMN 1: LUXURY PRODUCT HERO SPOTLIGHT (7 Cols) -->
			<div
				class="group relative flex flex-col justify-center overflow-hidden rounded-3xl border border-[#14352d]/6 bg-white p-6 shadow-[0_12px_36px_rgba(20,53,45,0.015)] sm:p-8 lg:col-span-7"
			>
				<!-- Subtle radial gradient glow behind model -->
				<div class="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_70%_50%,rgba(228,180,61,0.08),transparent_55%)]"></div>

				<div class="z-10 grid w-full grid-cols-1 items-center gap-6 md:grid-cols-12">
					<!-- Left Half: Content & Actions (5 cols) -->
					<div
						class="order-2 flex flex-col items-center justify-center space-y-5 text-center md:order-1 md:col-span-5 md:items-start md:text-left"
					>
						<div>
							<p
								class="text-[0.62rem] font-bold tracking-[0.16em] text-[#8a7444] uppercase sm:text-[0.72rem]"
							>
								New Arrival Offer
							</p>
							<h3
								class="mt-1 font-serif text-xl font-black leading-snug text-[#14352d] uppercase sm:text-2xl"
							>
								{spotlightProduct.name}
							</h3>
						</div>

						<div class="flex items-baseline justify-center gap-2.5 md:justify-start">
							<span class="text-2xl sm:text-3xl font-black text-[#14352d] tracking-tight">
								{spotlightProduct.salePrice
									? formatMoney(spotlightProduct.salePrice)
									: formatMoney(spotlightProduct.price * 0.7)}
							</span>
							<span class="text-sm font-semibold text-red-600 line-through">
								{formatMoney(spotlightProduct.price)}
							</span>
						</div>

						<!-- Color Selector -->
						<div class="flex w-full flex-col items-center md:items-start">
							<span
								class="mb-2 block font-sans text-[0.62rem] font-bold tracking-wider text-[#596c62] uppercase"
								>Color: <span class="font-black text-[#14352d]">{selectedColor}</span></span
							>
							<div class="flex justify-center gap-2.5 md:justify-start">
								{#each ['Midnight', 'Sage', 'Mocha'] as color}
									<button
										onclick={() => (selectedColor = color)}
										class="relative flex h-6.5 w-6.5 items-center justify-center rounded-full border transition-all duration-300 {selectedColor === color ? 'border-[#e4b43d] ring-2 ring-[#e4b43d]/30' : 'border-gray-200'}"
										aria-label={color}
									>
										<span
											class="h-4.5 w-4.5 rounded-full shadow-sm"
											style="background-color: {color === 'Midnight'
												? '#101411'
												: color === 'Sage'
													? '#8fa99a'
													: '#7b5142'};"
										></span>
									</button>
								{/each}
							</div>
						</div>

						<!-- Size Selector -->
						<div class="flex w-full flex-col items-center md:items-start">
							<span
								class="mb-2 block font-sans text-[0.62rem] font-bold tracking-wider text-[#596c62] uppercase"
								>Size: <span class="font-black text-[#14352d]">{selectedSize}</span></span
							>
							<div class="flex justify-center gap-2 md:justify-start">
								{#each ['S (52)', 'M (54)', 'L (56)'] as size}
									<button
										onclick={() => (selectedSize = size)}
										class="rounded-xl border px-3.5 py-1.5 text-[0.62rem] font-black transition-all duration-300 {selectedSize === size ? 'border-[#14352d] bg-[#14352d] text-white' : 'border-gray-200 bg-[#fbf9f2] text-[#596c62] hover:border-gray-400'}"
									>
										{size.split(' ')[0]}
									</button>
								{/each}
							</div>
						</div>

						<!-- CTA Button -->
						<div class="w-full pt-2">
							<button
								onclick={handleSpotlightAddToCart}
								class="inline-flex min-h-[2.75rem] w-full items-center justify-center gap-2 rounded-2xl bg-[#e4b43d] px-5 text-xs font-black tracking-wider text-[#14352d] uppercase shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#14352d] hover:text-white"
							>
								<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2.2"
										d="M3 3h2l2.4 12.2a2 2 0 002 1.6h7.4a2 2 0 001.9-1.4L21 7H6"
									/>
								</svg>
								Add to Cart
							</button>
						</div>
					</div>

					<!-- Right Half: Big Image & Arch Glow Overlay (7 cols) -->
					<div
						class="relative order-1 flex h-[310px] items-center justify-center overflow-visible md:order-2 md:col-span-7 md:h-[400px]"
					>
						<!-- Image Frame with elegant border & shadow -->
						<div
							class="relative z-10 h-[290px] w-[230px] overflow-hidden rounded-2xl border border-[#14352d]/6 shadow-[0_15px_35px_rgba(20,53,45,0.08)] transition-transform duration-700 group-hover:scale-[1.02] md:h-[380px] md:w-[300px]"
						>
							<img
								src={spotlightProduct.images?.[0]?.url || '/abaya11.png'}
								alt={spotlightProduct.name}
								class="h-full w-full object-cover"
							/>
						</div>

						<!-- Luxury Seal Badge -->
						<div
							class="absolute top-2 right-4 z-20 flex h-16 w-16 rotate-12 flex-col items-center justify-center rounded-full bg-[#e4b43d] text-[#14352d] shadow-lg outline outline-1 outline-offset-2 outline-[#e4b43d]/30 transition-transform duration-500 group-hover:scale-110 md:h-18 md:w-18"
						>
							<span class="text-[0.55rem] font-bold uppercase">Save</span>
							<span class="text-base font-black leading-none md:text-lg">30%</span>
							<span class="text-[0.45rem] font-bold uppercase">Off</span>
						</div>

						<div
							class="absolute bottom-4 left-4 z-20 rounded bg-[#14352d] px-3 py-1 text-[0.55rem] font-bold tracking-wider text-white uppercase shadow-md"
						>
							Online Exclusive
						</div>
					</div>
				</div>
			</div>

			<!-- COLUMN 2: EDITORIAL CATEGORY CARDS (5 Cols) -->
			<div class="flex flex-col justify-between gap-4 lg:col-span-5">
				<!-- CARD 1: CHIFFON HIJABS -->
				<a
					href="/shop?q=hijab"
					class="group flex flex-1 items-center justify-between overflow-hidden rounded-2xl border border-[#14352d]/6 bg-white p-4.5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#e4b43d]/30 hover:shadow-md"
				>
					<div class="flex items-center gap-4 pr-2">
						<!-- Rounded Square Thumbnail -->
						<div
							class="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-[#14352d]/6 bg-[#e4eee9] sm:h-24 sm:w-24 relative shadow-inner"
						>
							<img
								src="/ChatGPT Image May 25, 2026, 06_25_13 PM.png"
								alt="Premium Hijabs"
								class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
							/>
						</div>
						<div class="text-left">
							<span
								class="mb-1 inline-flex rounded-full border border-[#e4b43d]/20 bg-[#e4b43d]/10 px-2.5 py-0.5 text-[0.52rem] font-bold tracking-wide text-[#8a7444] uppercase"
							>
								Essential Match
							</span>
							<h4 class="font-serif text-sm sm:text-base font-black text-[#14352d] uppercase">
								Premium Hijabs
							</h4>
							<p class="mt-0.5 text-[0.68rem] font-medium text-[#596c62] leading-tight">
								Soft Georgette & Chiffon, 12 colors.
							</p>
							<span class="mt-2 block text-xs font-black text-[#8a7444]">From {formatMoney(1490)}</span>
						</div>
					</div>
					<div
						class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#14352d]/5 text-[#14352d] transition-all duration-300 group-hover:bg-[#14352d] group-hover:text-white group-hover:translate-x-1"
					>
						<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2.5"
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</div>
				</a>

				<!-- CARD 2: EVERYDAY CREPE -->
				<a
					href="/shop?category=daily-wear"
					class="group flex flex-1 items-center justify-between overflow-hidden rounded-2xl border border-[#14352d]/6 bg-white p-4.5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#e4b43d]/30 hover:shadow-md"
				>
					<div class="flex items-center gap-4 pr-2">
						<!-- Rounded Square Thumbnail -->
						<div
							class="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-[#14352d]/6 bg-[#e4eee9] sm:h-24 sm:w-24 relative shadow-inner"
						>
							<img
								src="/abaya11.png"
								alt="Everyday wear"
								class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
							/>
						</div>
						<div class="text-left">
							<span
								class="mb-1 inline-flex rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-[0.52rem] font-bold tracking-wide text-red-600 uppercase"
							>
								Free Shipping
							</span>
							<h4 class="font-serif text-sm sm:text-base font-black text-[#14352d] uppercase">
								Daily Crepe Cuts
							</h4>
							<p class="mt-0.5 text-[0.68rem] font-medium text-[#596c62] leading-tight">
								Minimalist cuts for all-day comfort.
							</p>
							<span class="mt-2 block text-xs font-black text-[#8a7444]">From {formatMoney(4990)}</span>
						</div>
					</div>
					<div
						class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#14352d]/5 text-[#14352d] transition-all duration-300 group-hover:bg-[#14352d] group-hover:text-white group-hover:translate-x-1"
					>
						<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2.5"
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</div>
				</a>

				<!-- CARD 3: LUXURY EMBROIDERY -->
				<a
					href="/shop?category=occasion"
					class="group flex flex-1 items-center justify-between overflow-hidden rounded-2xl border border-[#14352d]/6 bg-white p-4.5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#e4b43d]/30 hover:shadow-md"
				>
					<div class="flex items-center gap-4 pr-2">
						<!-- Rounded Square Thumbnail -->
						<div
							class="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-[#14352d]/6 bg-[#e4eee9] sm:h-24 sm:w-24 relative shadow-inner"
						>
							<img
								src="/abaya22.png"
								alt="Luxe stonework"
								class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
							/>
						</div>
						<div class="text-left">
							<span
								class="mb-1 inline-flex rounded-full border border-[#14352d]/10 bg-[#14352d]/5 px-2.5 py-0.5 text-[0.52rem] font-bold tracking-wide text-[#14352d] uppercase"
							>
								Limited Edition
							</span>
							<h4 class="font-serif text-sm sm:text-base font-black text-[#14352d] uppercase">
								Luxe Stonework
							</h4>
							<p class="mt-0.5 text-[0.68rem] font-medium text-[#596c62] leading-tight">
								Intricate hand-stitched sleeve detailing.
							</p>
							<span class="mt-2 block text-xs font-black text-[#8a7444]">From {formatMoney(7490)}</span>
						</div>
					</div>
					<div
						class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#14352d]/5 text-[#14352d] transition-all duration-300 group-hover:bg-[#14352d] group-hover:text-white group-hover:translate-x-1"
					>
						<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2.5"
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</div>
				</a>
			</div>
		</div>
	</div>
</section>
