<script lang="ts">
	import { formatMoney } from '$lib/shared/money';

	let { products = [], onAddToCart } = $props<{
		products?: any[];
		onAddToCart?: (product: any) => void;
	}>();

	let selectedColor = $state('Midnight');
	let selectedSize = $state('M');

	const spotlightStaticImage = '/products/georgette-abaya/georgette-abaya-charcoal-grey.png';

	let spotlightProduct = $derived(
		products.find((p: any) => p.slug.includes('mauve') || p.slug.includes('nida')) ||
			products[0] || {
				id: 'default-spotlight',
				name: 'Stuff Original Premium Nida Fabric Abaya - Mauve Taupe',
				price: 6500,
				salePrice: 5200
			}
	);

	const offerCards = [
		{
			href: '/shop?category=premium-abayas',
			image: '/products/georgette-abaya/georgette-abaya-blush-pink.png',
			badge: 'Essential Match',
			title: 'Premium Abayas',
			description: 'Soft Nida Fabric | Full Flare, 12 Colors',
			price: 1490,
			badgeClass: 'bg-[#f5f5f5] text-[#3a3a3a]'
		},
		{
			href: '/shop?category=daily-wear',
			image: '/products/nida-cutdana/nida-cutdana-teal-classic.png',
			badge: 'Best Choice',
			title: 'Daily Crepe Cuts',
			description: 'Minimalist Cuts for All-Day Comfort',
			price: 4990,
			badgeClass: 'bg-pink-100 text-pink-600'
		},
		{
			href: '/shop?category=occasion',
			image: '/products/cutdana-lace/cutdana-lace-navy-blue.png',
			badge: 'Limited Edition',
			title: 'Luxe Stonework',
			description: 'Intricate Hand-Embellished Detailing',
			price: 7490,
			badgeClass: 'bg-[#f5f5f5] text-[#3a3a3a]'
		}
	];

	const colors = [
		{ name: 'Midnight', value: '#27252b' },
		{ name: 'Mocha', value: '#8a7668' },
		{ name: 'Stone', value: '#c7beb4' }
	];

	function handleSpotlightAddToCart() {
		onAddToCart?.(spotlightProduct);
	}
</script>

<section class="relative overflow-hidden border-t border-[#0a0a0a]/8 bg-[#fafafa] px-4 py-10 sm:px-6 lg:px-8">
	<div
		class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,#f0f0f0_0%,transparent_44%)]"
	></div>

	<div class="relative mx-auto max-w-7xl">
		<div class="mb-8 text-center">
			<h2 class="font-serif text-3xl font-black leading-tight text-[#0f0f10] uppercase sm:text-4xl lg:text-5xl">
				Exclusive <span class="text-[#0a0a0a]">Deals & Edits</span>
			</h2>
			<div class="mt-4 flex items-center justify-center gap-3 text-[#4a4a4a]">
				<span class="h-px w-10 bg-current"></span>
				<span class="text-sm">◆</span>
				<span class="h-px w-10 bg-current"></span>
			</div>
		</div>

		<div class="grid grid-cols-1 gap-6 lg:grid-cols-[1.12fr_0.74fr]">
			<div
				class="relative overflow-hidden rounded-[1.6rem] border border-[#e5e5e5] bg-white/92 p-5 shadow-[0_18px_48px_rgba(0,0,0,0.12)] sm:p-7 lg:min-h-[500px]"
			>
				<svg
					class="pointer-events-none absolute right-2 bottom-3 size-28 text-[#7a7a7a]/25 sm:size-36"
					fill="none"
					viewBox="0 0 120 120"
					aria-hidden="true"
				>
					<path
						d="M92 10c-16 25-20 48-12 69 4 12 0 22-10 31"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
					/>
					<path
						d="M80 42c18-9 27-20 27-35-17 6-27 18-27 35ZM78 65c18-2 30-12 35-28-18 1-30 12-35 28ZM70 91c16 5 30 1 40-12-17-5-30-1-40 12Z"
						stroke="currentColor"
						stroke-width="1.8"
						stroke-linejoin="round"
					/>
				</svg>

				<div class="grid h-full grid-cols-1 items-center gap-6 md:grid-cols-[0.88fr_1.12fr]">
					<div class="order-2 flex flex-col items-start md:order-1">
						<span
							class="inline-flex items-center gap-2 rounded-full border border-[#dcdcdc] bg-[#f5f5f5] px-4 py-2 text-[0.68rem] font-black text-[#3a3a3a] uppercase"
						>
							<span>✦</span>
							New Arrival Offer
						</span>

						<h3
							class="mt-5 max-w-[18rem] font-serif text-2xl font-black leading-tight text-[#0f0f10] uppercase sm:text-3xl"
						>
							{spotlightProduct.name || 'Stuff Original Premium Nida Fabric Abaya - Mauve Taupe'}
						</h3>

						<div class="mt-7 flex items-baseline gap-4">
							<span class="text-3xl font-black text-[#1a1a1a] tabular-nums sm:text-4xl">
								{formatMoney(spotlightProduct.salePrice || 5200)}
							</span>
							<span class="text-base font-bold text-[#6b7280] line-through tabular-nums">
								{formatMoney(spotlightProduct.price || 6500)}
							</span>
						</div>

						<div class="mt-5 h-px w-full max-w-[16rem] border-t border-dashed border-[#dcdcdc]"></div>

						<div class="mt-4">
							<p class="text-[0.78rem] font-black text-[#0f0f10] uppercase">
								Color: <span>{selectedColor}</span>
							</p>
							<div class="mt-3 flex gap-4">
								{#each colors as color}
									<button
										type="button"
										onclick={() => (selectedColor = color.name)}
										class="flex size-9 items-center justify-center rounded-full border transition-colors duration-200 {selectedColor ===
										color.name
											? 'border-[#1a1a1a] bg-white'
											: 'border-transparent bg-white'}"
										aria-label={`Select ${color.name}`}
									>
										<span
											class="size-7 rounded-full border border-black/10"
											style="background-color: {color.value}"
										></span>
									</button>
								{/each}
							</div>
						</div>

						<div class="mt-5">
							<p class="text-[0.78rem] font-black text-[#0f0f10] uppercase">
								Size: <span>{selectedSize === 'M' ? 'Medium' : selectedSize}</span>
							</p>
							<div class="mt-3 flex gap-4">
								{#each ['S', 'M', 'L'] as size}
									<button
										type="button"
										onclick={() => (selectedSize = size)}
										class="flex size-11 items-center justify-center rounded-xl border text-sm font-black transition-colors duration-200 {selectedSize ===
										size
											? 'border-[#1a1a1a] bg-[#1a1a1a] text-white'
											: 'border-[#e0e0e0] bg-white text-[#3a3a3a]'}"
									>
										{size}
									</button>
								{/each}
							</div>
						</div>

						<button
							type="button"
							onclick={handleSpotlightAddToCart}
							class="mt-7 inline-flex min-h-12 w-full max-w-[16rem] items-center justify-center gap-3 rounded-2xl bg-[#1a1a1a] px-6 text-sm font-black text-white uppercase shadow-[0_14px_30px_rgba(0,0,0,0.28)] transition-colors duration-200 hover:bg-[#242424]"
						>
							<svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9Z"
								/>
							</svg>
							Add to Cart
						</button>
					</div>

					<div class="relative order-1 flex min-h-[330px] items-center justify-center md:order-2">
						<div
							class="absolute inset-x-4 top-3 bottom-3 rounded-t-full border-[10px] border-[#e5e5e5] bg-[#f0f0f0]"
						></div>
						<div
							class="relative z-10 h-[320px] w-[250px] overflow-hidden rounded-t-full rounded-b-2xl border border-[#dcdcdc] shadow-[0_16px_34px_rgba(0,0,0,0.16)] sm:h-[410px] sm:w-[320px]"
						>
							<img
								src={spotlightStaticImage}
								alt={spotlightProduct.name}
								class="h-full w-full object-cover object-top"
							/>
						</div>

						<div
							class="absolute top-8 right-2 z-20 flex size-24 flex-col items-center justify-center rounded-full border-2 border-[#d4d4d4] bg-[#1a1a1a] text-center text-white shadow-[0_10px_24px_rgba(0,0,0,0.24)] sm:size-28"
						>
							<span class="text-sm font-black uppercase">Save</span>
							<span class="text-3xl font-black leading-none">30%</span>
							<span class="text-sm font-black uppercase">Off</span>
						</div>

						<span
							class="absolute bottom-2 left-7 z-20 rounded-md bg-[#1a1a1a] px-4 py-2 text-xs font-black text-white uppercase shadow-[0_10px_22px_rgba(0,0,0,0.28)]"
						>
							Online Exclusive
						</span>
					</div>
				</div>
			</div>

			<div class="grid gap-4">
				{#each offerCards as card}
					<a
						href={card.href}
						class="group grid grid-cols-[6.2rem_1fr_2.5rem] items-center gap-4 rounded-[1.35rem] border border-[#e5e5e5] bg-white/94 p-4 shadow-[0_12px_34px_rgba(0,0,0,0.1)] transition-colors duration-200 hover:border-[#c7c7c7] sm:grid-cols-[7.2rem_1fr_3rem] sm:p-5"
					>
						<div class="h-28 overflow-hidden rounded-xl bg-[#f0f0f0] sm:h-32">
							<img
								src={card.image}
								alt={card.title}
								class="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
							/>
						</div>

						<div class="min-w-0">
							<span
								class="inline-flex rounded-full px-3 py-1 text-[0.68rem] font-black uppercase {card.badgeClass}"
							>
								{card.badge}
								{#if card.badge === 'Best Choice'} ♥{/if}
							</span>
							<h4 class="mt-3 font-serif text-lg font-black leading-tight text-[#0f0f10] uppercase">
								{card.title}
							</h4>
							<p class="mt-1 text-sm leading-snug text-[#4a4a4a]">{card.description}</p>
							<p class="mt-3 text-base font-black text-[#1a1a1a]">From {formatMoney(card.price)}</p>
						</div>

						<span
							class="flex size-10 items-center justify-center rounded-full border border-[#e5e5e5] bg-[#fafafa] text-[#1a1a1a] transition-colors duration-200 group-hover:bg-[#1a1a1a] group-hover:text-white sm:size-12"
							aria-hidden="true"
						>
							<svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.6" d="M9 5l7 7-7 7" />
							</svg>
						</span>
					</a>
				{/each}
			</div>
		</div>
	</div>
</section>
