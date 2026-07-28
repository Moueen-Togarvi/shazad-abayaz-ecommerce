<script lang="ts">
	import { onMount } from 'svelte';

	let { settings = {} } = $props();

	let activeSlide = $state(0);
	let sliderHovered = $state(false);

	const defaultSliderItems = [
		{
			title: 'Premium Nida Essentials',
			tagline: 'EVERYDAY COMFORT',
			description:
				'Double-stitched durability and flowy silhouettes in authentic premium Nida fabric. Styled for standard modest daily wear.',
			link: '/shop?category=nida-essentials',
			image: '/abaya_banner_nida.png',
			bgClass: 'bg-gradient-to-br from-[#0c221a] via-[#14352d] to-[#0a1c15]',
			accentText: 'text-[#e4b43d]',
			badge: 'Bestseller Edit',
			promoBadge: '40% OFF',
			descColor: 'text-white/70',
			details: [
				{ label: 'Premium Nida Fabric', desc: 'Breathable & Ultra Soft' },
				{ label: 'Double Stitched', desc: 'Long-lasting Durability' }
			]
		},
		{
			title: 'Luxury Occasion Wear',
			tagline: 'ELEGANT LAYERS',
			description:
				'Featuring intricate hand-stitched beadwork and premium drapes on soft premium flowy georgette edits.',
			link: '/shop?category=occasion',
			image: '/abaya_banner_nida.png',
			bgClass: 'bg-gradient-to-br from-[#121110] via-[#23201a] to-[#0e0e0d]',
			accentText: 'text-[#e4b43d]',
			badge: 'New Season',
			promoBadge: '50% OFF',
			descColor: 'text-white/70',
			details: [
				{ label: 'Hand Stitched Beads', desc: 'Exquisite Artisanship' },
				{ label: 'Premium Georgette', desc: 'Flowy & Elegant Drapes' }
			]
		},
		{
			title: 'Eid Signature Edit',
			tagline: 'LIMITED EMBROIDERY',
			description:
				'Sophisticated dark cuts with delicate gold-lace details, designed to leave a quiet, modest presence.',
			link: '/shop?category=eid-edit',
			image: '/ChatGPT%20Image%20May%2024,%202026,%2002_01_35%20AM.png',
			bgClass: 'bg-gradient-to-br from-[#0d161a] via-[#122329] to-[#091013]',
			accentText: 'text-[#e4b43d]',
			badge: 'Eid Special',
			promoBadge: '30% OFF',
			descColor: 'text-white/70',
			details: [
				{ label: 'Gold Lace Accents', desc: 'Royal Signature Trim' },
				{ label: 'Limited Release', desc: 'Exclusive Custom Cut' }
			]
		}
	];

	let sliderItems = $derived([
		{
			...defaultSliderItems[0],
			title: settings.slide1Title || defaultSliderItems[0].title,
			tagline: settings.slide1Tagline || defaultSliderItems[0].tagline,
			description: settings.slide1Description || defaultSliderItems[0].description,
			link: settings.slide1Link || defaultSliderItems[0].link,
			image: settings.slide1Image || defaultSliderItems[0].image,
			promoBadge: settings.slide1Promo || defaultSliderItems[0].promoBadge
		},
		{
			...defaultSliderItems[1],
			title: settings.slide2Title || defaultSliderItems[1].title,
			tagline: settings.slide2Tagline || defaultSliderItems[1].tagline,
			description: settings.slide2Description || defaultSliderItems[1].description,
			link: settings.slide2Link || defaultSliderItems[1].link,
			image: settings.slide2Image || defaultSliderItems[1].image,
			promoBadge: settings.slide2Promo || defaultSliderItems[1].promoBadge
		},
		{
			...defaultSliderItems[2],
			title: settings.slide3Title || defaultSliderItems[2].title,
			tagline: settings.slide3Tagline || defaultSliderItems[2].tagline,
			description: settings.slide3Description || defaultSliderItems[2].description,
			link: settings.slide3Link || defaultSliderItems[2].link,
			image: settings.slide3Image || defaultSliderItems[2].image,
			promoBadge: settings.slide3Promo || defaultSliderItems[2].promoBadge
		}
	]);

	let slideInterval: ReturnType<typeof setInterval>;

	function startSlider() {
		stopSlider();
		slideInterval = setInterval(() => {
			if (!sliderHovered) {
				activeSlide = (activeSlide + 1) % sliderItems.length;
			}
		}, 5500);
	}

	function stopSlider() {
		if (slideInterval) clearInterval(slideInterval);
	}

	function handlePrev() {
		activeSlide = (activeSlide - 1 + sliderItems.length) % sliderItems.length;
		startSlider();
	}

	function handleNext() {
		activeSlide = (activeSlide + 1) % sliderItems.length;
		startSlider();
	}

	onMount(() => {
		startSlider();
		return stopSlider;
	});
</script>

<section
	class="relative overflow-hidden border-y border-[#14352d]/8 bg-[#fbf9f2]"
	onmouseenter={() => (sliderHovered = true)}
	onmouseleave={() => (sliderHovered = false)}
>
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div
			class="relative my-6 h-[440px] sm:h-[360px] md:h-[390px] w-full overflow-hidden rounded-2xl border border-[#14352d]/10 shadow-[0_20px_50px_rgba(20,53,45,0.05)]"
		>
			{#each sliderItems as item, index}
				<!-- GPU Accelerated Horizontal sliding container -->
				<div
					class="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-2xl transition-transform duration-[800ms] ease-in-out sm:flex-row {item.bgClass}"
					style="transform: translateX({(index - activeSlide) * 100}%);"
				>
					<!-- Spotlight Glow Effects -->
					<div class="pointer-events-none absolute top-0 left-0 z-0 h-full w-full bg-[radial-gradient(circle_at_top_left,rgba(228,180,61,0.08),transparent_45%)]"></div>
					<div class="pointer-events-none absolute top-0 right-0 z-0 h-full w-full bg-[radial-gradient(circle_at_top_right,rgba(228,180,61,0.08),transparent_45%)]"></div>

					<!-- Content Container -->
					<div class="relative z-10 flex flex-col justify-between w-full h-full p-5 sm:p-7 md:p-8">
						<!-- Main Slide Content: Grid Layout -->
						<div class="grid grid-cols-1 gap-6 sm:grid-cols-12 items-center flex-1 w-full">
							
							<!-- Left Column: Floating Detail Cards -->
							<div class="hidden sm:flex sm:col-span-3 flex-col gap-3 transform transition-all duration-700 ease-out {activeSlide === index ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'} delay-[100ms]">
								{#each item.details as detail, dIdx}
									<div class="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-2 shadow-[0_8px_32px_rgba(0,0,0,0.15)] backdrop-blur-md transition-all duration-300 hover:scale-[1.03] hover:border-[#e4b43d]/30">
										<div class="h-9 w-9 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/5">
											<img src={item.image} alt="Detail" class="h-full w-full object-cover object-top scale-[1.6] origin-top" />
										</div>
										<div class="text-left min-w-0">
											<span class="block text-[0.52rem] font-bold tracking-wider text-[#e4b43d] uppercase">Detail {dIdx + 1}</span>
											<span class="block text-[0.65rem] font-black text-white truncate uppercase mt-0.5">{detail.label}</span>
											<span class="block text-[0.52rem] text-white/50 truncate mt-0.5">{detail.desc}</span>
										</div>
									</div>
								{/each}
							</div>

							<!-- Center Column: Model & Glowing Arch -->
							<div class="col-span-12 sm:col-span-5 flex items-end justify-center h-full relative">
								<!-- Glowing Arch Background Frame -->
								<div class="absolute bottom-0 w-[180px] sm:w-[230px] h-[78%] rounded-t-full bg-gradient-to-t from-white/5 to-white/10 border-t border-x border-white/10 shadow-[0_0_60px_rgba(228,180,61,0.1)] z-0"></div>
								<div class="absolute bottom-0 w-[160px] sm:w-[200px] h-[70%] rounded-t-full bg-[#14352d]/10 z-0"></div>

								<!-- Spotlight beam overlay -->
								<div class="absolute -top-12 left-1/2 -translate-x-1/2 w-[260px] h-[260px] bg-[radial-gradient(circle_at_center,rgba(228,180,61,0.12),transparent_60%)] pointer-events-none blur-xl z-0"></div>

								<!-- Model Image -->
								<img
									src={item.image}
									alt={item.title}
									class="relative z-10 h-[190px] sm:h-[250px] md:h-[300px] w-auto object-contain object-bottom drop-shadow-[0_20px_40px_rgba(0,0,0,0.4)] filter transition-transform duration-[1500ms] ease-out"
									style="transform: scale({activeSlide === index ? '1.04' : '1.01'});"
								/>
							</div>

							<!-- Right Column: Luxury Text Content -->
							<div class="col-span-12 sm:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left justify-center transform transition-all duration-700 ease-out {activeSlide === index ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'} delay-[250ms]">
								<!-- Logo / Small Badge -->
								<div class="mb-2.5 flex items-center gap-2">
									<span class="inline-flex rounded-full bg-white/10 border border-white/10 px-3 py-0.5 text-[0.55rem] font-bold tracking-[0.12em] text-[#e4b43d] uppercase sm:text-[0.58rem]">
										{item.badge}
									</span>
									<span class="text-[0.58rem] font-bold tracking-[0.2em] text-white/60 uppercase hidden lg:inline-block">
										{item.tagline}
									</span>
								</div>

								<!-- Title with Glow Shadow -->
								<h3 class="font-serif text-xl sm:text-2xl md:text-3xl lg:text-[2.2rem] font-black tracking-wide uppercase leading-tight text-white drop-shadow-[0_2px_10px_rgba(228,180,61,0.25)]">
									{item.title}
								</h3>
								<div class="h-[2.5px] w-10 mt-2.5 mb-3 rounded bg-[#e4b43d]"></div>

								<!-- Description -->
								<p class="text-[0.68rem] sm:text-[0.75rem] leading-relaxed text-white/70 max-w-sm">
									{item.description}
								</p>

								<!-- Bottom Promo & CTA Row -->
								<div class="mt-4 sm:mt-5 flex items-center gap-3">
									<!-- Save Box (Glassmorphism Pill) -->
									<div class="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3.5 py-1 shadow-md backdrop-blur-md">
										<span class="text-[0.52rem] font-bold tracking-[0.1em] text-white/50 uppercase">SAVE</span>
										<span class="text-xs sm:text-sm font-black text-white">{item.promoBadge}</span>
									</div>

									<!-- Shop Now Button -->
									<a
										href={item.link}
										class="inline-flex min-h-8 sm:min-h-9.5 items-center justify-center gap-2 rounded-full bg-white text-[#14352d] px-4.5 text-[0.62rem] font-black uppercase shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#e4b43d] hover:text-[#14352d] hover:shadow-xl sm:px-5.5 sm:text-[0.68rem]"
									>
										Shop Now
										<svg class="h-3 w-3 sm:h-3.5 sm:w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
										</svg>
									</a>
								</div>
							</div>
						</div>

						<!-- Bottom Row: Information Details Row -->
						<div class="hidden sm:flex items-center justify-between border-t border-white/10 pt-4.5 mt-4 text-white/60 text-[0.62rem] sm:text-[0.68rem] tracking-wider uppercase font-bold transform transition-all duration-700 ease-out {activeSlide === index ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} delay-[350ms]">
							<div class="flex items-center gap-1.5">
								<svg class="h-4 w-4 text-[#e4b43d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
								</svg>
								100% Modest Cut
							</div>
							<div class="flex items-center gap-1.5">
								<svg class="h-4 w-4 text-[#e4b43d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
								</svg>
								Premium Quality Edits
							</div>
							<div class="flex items-center gap-1.5">
								<svg class="h-4 w-4 text-[#e4b43d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
								</svg>
								Free Shipping Worldwide
							</div>
						</div>
					</div>
				</div>
			{/each}

			<!-- Slider Controls: Arrows -->
			<div class="absolute inset-y-0 left-2 z-20 flex items-center sm:left-4">
				<button
					onclick={handlePrev}
					class="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white shadow-md backdrop-blur-sm transition-all hover:bg-white hover:text-[#14352d] sm:h-9 sm:w-9"
					aria-label="Previous slide"
				>
					<svg class="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2.5"
							d="M15 19l-7-7 7-7"
						/>
					</svg>
				</button>
			</div>
			<div class="absolute inset-y-0 right-2 z-20 flex items-center sm:right-4">
				<button
					onclick={handleNext}
					class="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white shadow-md backdrop-blur-sm transition-all hover:bg-white hover:text-[#14352d] sm:h-9 sm:w-9"
					aria-label="Next slide"
				>
					<svg class="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2.5"
							d="M9 5l7 7-7 7"
						/>
					</svg>
				</button>
			</div>

			<!-- Slider Indicators (Dots) -->
			<div class="absolute inset-x-0 bottom-3 z-20 flex justify-center gap-1.5 sm:gap-2">
				{#each sliderItems as _, idx}
					<button
						onclick={() => {
							activeSlide = idx;
							startSlider();
						}}
						class="h-1.5 rounded-full transition-all duration-300 {activeSlide === idx
							? 'w-6 bg-[#e4b43d]'
							: 'w-1.5 bg-white/30'}"
						aria-label={`Go to slide ${idx + 1}`}
					></button>
				{/each}
			</div>
		</div>
	</div>
</section>
