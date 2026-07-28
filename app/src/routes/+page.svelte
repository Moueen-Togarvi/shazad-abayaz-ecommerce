<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { cart } from '$lib/client/cart.svelte';
	import { productPixelPayload, trackAddToCart } from '$lib/client/pixels';
	import AbayizaWordmark from '$lib/components/AbayizaWordmark.svelte';
	import AbayaSlidingBanner from '$lib/components/AbayaSlidingBanner.svelte';
	import ProOfferGrid from '$lib/components/ProOfferGrid.svelte';
	import FlashSaleTimerBanner from '$lib/components/FlashSaleTimerBanner.svelte';
	import CategoryCircleCards from '$lib/components/CategoryCircleCards.svelte';
	import ProductCard from '$lib/components/ProductCard.svelte';

	import { formatMoney } from '$lib/shared/money';
	import {
		SITE_DESCRIPTION,
		SITE_IMAGE,
		SITE_NAME,
		absoluteUrl,
		jsonLdScript,
		metaDescription
	} from '$lib/shared/seo';

	let { data } = $props();
	let products = $derived((data.products || []) as Array<any>);
	let collections = $derived((data.collections || []) as Array<any>);
	let reviewPhotos = $derived((data.reviewPhotos || []) as Array<any>);
	let homeSections = $derived((data.homeSections || {}) as Record<string, any>);
	let storefrontSettings = $derived((data.storefrontSettings || {}) as Record<string, any>);

	let heroRoot: HTMLElement;
	let heroSlideIndex = $state(0);
	let previousHeroSlideIndex = $state<number | null>(null);
	let heroSlideDirection = $state<'next' | 'previous'>('next');
	let previousHeroSlideTimer: ReturnType<typeof setTimeout> | undefined;

	let heroHeadlinePhrases = $derived(
		(storefrontSettings.heroHeadlinePhrases?.length
			? storefrontSettings.heroHeadlinePhrases
			: [
					'Premium\nAbayas',
					'Luxury\nAbayas',
					'Nida\nEssentials',
					'Modest\nLayers',
					"Eid Sale\nShahzad Abaya's"
				]) as string[]
	);
	let heroHeadlineText = $state(storefrontSettings.heroHeadlinePhrases?.[0] || 'Premium\nAbayas');

	const heroSlides = [
		{
			src: '/ChatGPT%20Image%20May%2025,%202026,%2006_25_42%20PM.png',
			alt: "Shahzad Abaya's hero abaya editorial slide one"
		},
		{
			src: '/ChatGPT%20Image%20May%2025,%202026,%2006_25_51%20PM.png',
			alt: "Shahzad Abaya's hero abaya editorial slide two"
		},
		{
			src: '/ChatGPT%20Image%20May%2025,%202026,%2006_25_13%20PM.png',
			alt: "Shahzad Abaya's hero abaya editorial slide three"
		},
		{
			src: '/ChatGPT%20Image%20May%2025,%202026,%2006_07_28%20PM.png',
			alt: "Shahzad Abaya's hero abaya editorial slide four"
		},
		{
			src: '/ChatGPT%20Image%20May%2025,%202026,%2006_25_25%20PM.png',
			alt: "Shahzad Abaya's hero abaya editorial slide five"
		}
	];

	function showHeroSlide(direction: 'next' | 'previous') {
		previousHeroSlideIndex = heroSlideIndex;
		heroSlideDirection = direction;
		heroSlideIndex =
			direction === 'next'
				? (heroSlideIndex + 1) % heroSlides.length
				: (heroSlideIndex - 1 + heroSlides.length) % heroSlides.length;

		if (previousHeroSlideTimer) clearTimeout(previousHeroSlideTimer);
		previousHeroSlideTimer = setTimeout(() => {
			previousHeroSlideIndex = null;
		}, 950);
	}

	function homeSection(key: string, homepageLimit: number) {
		return (
			homeSections[key] || {
				products: products.slice(0, homepageLimit),
				total: products.length,
				homepageLimit,
				viewAllHref: `/sections/${key}`,
				usesFallback: true
			}
		);
	}

	function hasViewAll(section: any) {
		return (
			Number(section.total || 0) > Number(section.homepageLimit || section.products?.length || 0)
		);
	}

	let signatureCollectionsSection = $derived(homeSection('signature-collections', 4));
	let newArrivalsSection = $derived(homeSection('new-arrivals', 4));
	let mostLovedSection = $derived(homeSection('most-loved', 8));
	let curatedEdits = $derived(
		(!signatureCollectionsSection.usesFallback
			? signatureCollectionsSection.products
			: products.slice(0, 4)
		).slice(0, 4) as Array<any>
	);
	let newArrivals = $derived((newArrivalsSection.products || []) as Array<any>);
	let bestsellers = $derived((mostLovedSection.products || []) as Array<any>);
	let bestsellerRows = $derived([
		bestsellers.slice(0, 4),
		bestsellers.slice(4, 8).length ? bestsellers.slice(4, 8) : [...bestsellers].reverse()
	]);
	let bestsellerCategoryTags = $derived(collections.map((collection) => collection.name));
	let shouldAnimateReviewPhotos = $derived(reviewPhotos.length > 2);
	let reviewPhotoLoop = $derived(
		shouldAnimateReviewPhotos ? [...reviewPhotos, ...reviewPhotos] : reviewPhotos
	);

	let saleTapeItems = $derived(
		(storefrontSettings.saleTapeItems?.length
			? storefrontSettings.saleTapeItems
			: ['EID SALE', '30% OFF', "SHAHZAD ABAYA'S"]) as string[]
	);
	let saleTapeLoop = $derived(Array.from({ length: 8 }, () => saleTapeItems).flat());
	let saleTapeEnabled = $derived(storefrontSettings.saleTapeEnabled !== false);
	let homeSocialImage = $derived(absoluteUrl(SITE_IMAGE, page.url.origin));
	let homeDescription = $derived(
		metaDescription(
			storefrontSettings.homeMetaDescription ||
				"Shop Shahzad Abaya's for premium abayas, nida essentials, occasion edits, and refined modest fashion in Pakistan."
		)
	);
	let homeJsonLd = $derived(
		jsonLdScript([
			{
				'@context': 'https://schema.org',
				'@type': 'WebPage',
				name: `${SITE_NAME} | Premium Modest Fashion`,
				description: homeDescription,
				url: absoluteUrl('/', page.url.origin)
			},
			{
				'@context': 'https://schema.org',
				'@type': 'ItemList',
				name: "Featured Shahzad Abaya's Products",
				itemListElement: products.slice(0, 8).map((item: any, index: number) => ({
					'@type': 'ListItem',
					position: index + 1,
					name: item.name,
					url: absoluteUrl(`/shop/${item.slug}`, page.url.origin)
				}))
			}
		])
	);
	const brandPattern = /^(Shahzad Abaya's|SHAHZAD ABAYA'S)$/;

	function textWithBrand(value: string) {
		return value.split(/(Shahzad Abaya's|SHAHZAD ABAYA'S)/g).filter(Boolean);
	}

	function isBrandText(value: string) {
		return brandPattern.test(value);
	}

	function productImage(item: any) {
		return item.images?.[0]?.url || collections[0]?.imageUrl || '/image.png';
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

	function productHref(item: any) {
		return `/shop/${item.slug}`;
	}

	function productCategory(item: any) {
		return item.collections?.[0]?.name || "Shahzad Abaya's";
	}

	function productTags(item: any) {
		return [
			primaryVariant(item)?.color,
			primaryVariant(item)?.size,
			...((item.collections || []).map((collection: any) => collection.name) as string[])
		]
			.filter(Boolean)
			.filter((tag) => typeof tag === 'string' && tag.toLowerCase() !== 'default')
			.slice(0, 3);
	}

	function productPrice(item: any) {
		return Number(item.salePrice || item.price);
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

		trackAddToCart(productPixelPayload(item));
	}

	onMount(() => {
		let active = true;
		let destroyAnimation: (() => void) | undefined;
		let typewriterTimer: ReturnType<typeof setTimeout> | undefined;
		const slideTimer = setInterval(() => {
			showHeroSlide('next');
		}, 3000);

		let phraseIndex = 0;
		let charIndex = 0;
		let isDeleting = false;
		heroHeadlineText = '';

		const typeHeadline = () => {
			if (!heroHeadlinePhrases.length) {
				typewriterTimer = setTimeout(typeHeadline, 1000);
				return;
			}
			if (phraseIndex >= heroHeadlinePhrases.length) {
				phraseIndex = 0;
			}
			const phrase = heroHeadlinePhrases[phraseIndex];
			let delay = isDeleting ? 85 : 130;

			if (isDeleting) {
				charIndex = Math.max(0, charIndex - 1);
				heroHeadlineText = phrase.slice(0, charIndex);

				if (charIndex === 0) {
					isDeleting = false;
					phraseIndex = (phraseIndex + 1) % heroHeadlinePhrases.length;
					delay = 260;
				}
			} else {
				charIndex = Math.min(phrase.length, charIndex + 1);
				heroHeadlineText = phrase.slice(0, charIndex);

				if (charIndex === phrase.length) {
					isDeleting = true;
					delay = 1200;
				}
			}

			typewriterTimer = setTimeout(typeHeadline, delay);
		};

		typewriterTimer = setTimeout(typeHeadline, 120);

		import('gsap').then(({ gsap }) => {
			if (!active || !heroRoot) return;

			const mm = gsap.matchMedia();
			const ctx = gsap.context(() => {
				mm.add(
					{
						reduceMotion: '(prefers-reduced-motion: reduce)'
					},
					(context) => {
						const reduceMotion = Boolean(context.conditions?.reduceMotion);
						const revealItems = gsap.utils.toArray<HTMLElement>('.hero-reveal');
						const bgImage = heroRoot.querySelector('.hero-bg');

						gsap.set(revealItems, { willChange: 'transform, opacity' });

						if (reduceMotion) {
							gsap.set([revealItems, bgImage].flat().filter(Boolean), {
								autoAlpha: 1,
								clearProps: 'transform,filter,willChange'
							});
							return () => {};
						}

						const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

						if (bgImage) {
							tl.fromTo(
								bgImage,
								{ filter: 'blur(4px)' },
								{ filter: 'blur(0px)', duration: 1.3, ease: 'power2.out' },
								0
							);
						}

						tl.fromTo(
							revealItems,
							{ autoAlpha: 0, y: 18 },
							{
								autoAlpha: 1,
								y: 0,
								duration: 0.72,
								stagger: 0.075
							},
							0.2
						);

						return () => {
							gsap.set(revealItems, { clearProps: 'willChange' });
						};
					}
				);
			}, heroRoot);

			destroyAnimation = () => {
				mm.revert();
				ctx.revert();
			};
		});

		return () => {
			active = false;
			clearInterval(slideTimer);
			if (typewriterTimer) clearTimeout(typewriterTimer);
			if (previousHeroSlideTimer) clearTimeout(previousHeroSlideTimer);
			destroyAnimation?.();
		};
	});
</script>

<svelte:head>
	<title>Shahzad Abaya's | Premium Modest Fashion</title>
	<meta name="description" content={homeDescription} />
	<meta
		name="keywords"
		content="premium abayas Pakistan, nida abaya, modest fashion, Eid abaya, black abaya, online abaya store"
	/>
	<meta property="og:type" content="website" />
	<meta property="og:title" content={`${SITE_NAME} | Premium Modest Fashion`} />
	<meta property="og:description" content={homeDescription} />
	<meta property="og:image" content={homeSocialImage} />
	<meta name="twitter:title" content={`${SITE_NAME} | Premium Modest Fashion`} />
	<meta name="twitter:description" content={homeDescription} />
	{@html homeJsonLd}
</svelte:head>

<section
	bind:this={heroRoot}
	class="hero-cinematic relative isolate -mt-[4.25rem] overflow-hidden bg-[#eeece4] text-[#0a0a0a] md:-mt-[4.75rem]"
>
	<div
		class="hero-bg absolute inset-0 -z-30"
		class:hero-bg--previous={heroSlideDirection === 'previous'}
		data-depth="0"
	>
		{#each heroSlides as slide, index}
			<img
				src={slide.src}
				alt={slide.alt}
				width="1672"
				height="941"
				fetchpriority={index === 0 ? 'high' : 'auto'}
				aria-hidden={index !== heroSlideIndex}
				class="hero-bg__slide h-full w-full bg-[#eadac8] object-cover object-center"
				class:hero-bg__slide--active={index === heroSlideIndex}
				class:hero-bg__slide--previous-next={index === previousHeroSlideIndex &&
					heroSlideDirection === 'next'}
				class:hero-bg__slide--previous-previous={index === previousHeroSlideIndex &&
					heroSlideDirection === 'previous'}
			/>
		{/each}
	</div>

	<div class="absolute inset-0 -z-20 bg-black/12"></div>

	<div
		class="pointer-events-none absolute inset-x-3 top-1/2 z-30 flex -translate-y-1/2 items-center justify-between sm:inset-x-6"
	>
		<button
			type="button"
			class="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/50 bg-white/78 text-[#0a0a0a] shadow-[0_14px_32px_rgba(20,53,45,0.20)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0a0a0a] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
			aria-label="Previous hero image"
			onclick={() => showHeroSlide('previous')}
		>
			<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2.2"
					d="M15 19l-7-7 7-7"
				/>
			</svg>
		</button>
		<button
			type="button"
			class="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/50 bg-white/78 text-[#0a0a0a] shadow-[0_14px_32px_rgba(20,53,45,0.20)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0a0a0a] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
			aria-label="Next hero image"
			onclick={() => showHeroSlide('next')}
		>
			<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M9 5l7 7-7 7" />
			</svg>
		</button>
	</div>

	<div
		class="relative z-20 mx-auto flex min-h-[min(560px,100svh)] max-w-7xl items-end px-4 pt-24 pb-6 sm:min-h-0 sm:items-start sm:px-6 sm:pt-10 sm:pb-10 md:items-center md:pt-28 md:pb-16 lg:px-8"
	>
		<div
			class="mt-0 ml-0 max-w-[15.5rem] pb-2 text-black drop-shadow-[0_4px_18px_rgba(255,255,255,0.45)] sm:mt-16 sm:ml-10 sm:max-w-[32rem] md:mt-20 md:ml-16 md:pb-0"
		>
			<p
				class="hero-reveal text-[0.58rem] font-bold tracking-[0.16em] text-black/70 uppercase sm:text-[0.68rem]"
			>
				New Season Edit
			</p>
			<h1
				class="hero-reveal mt-1.5 ml-[11px] min-h-[2.95rem] max-w-[8.5ch] font-serif text-2xl leading-[0.95] whitespace-pre-line text-black uppercase sm:mt-3 sm:ml-[7px] sm:min-h-[5.9rem] sm:text-5xl md:min-h-[6.9rem] md:text-6xl"
			>
				<span class="hero-typewriter">
					{#each textWithBrand(heroHeadlineText) as part}
						{#if isBrandText(part)}
							<AbayizaWordmark class="align-baseline" />
						{:else}
							{part}
						{/if}
					{/each}
				</span>
			</h1>
			<p
				class="hero-reveal mt-2 max-w-[14.5rem] text-[0.66rem] leading-4 font-semibold text-black/82 sm:mt-4 sm:max-w-sm sm:text-base sm:leading-6"
			>
				Clean Nida silhouettes with soft movement, refined finishing, and everyday grace.
			</p>

			<div class="hero-reveal mt-3 flex flex-row flex-nowrap gap-1.5 sm:mt-8 sm:gap-2">
				<a
					href="/shop"
					class="inline-flex min-h-7 items-center justify-center gap-1 rounded-full bg-[#0a0a0a] px-2 text-[0.56rem] font-bold whitespace-nowrap text-white shadow-[0_16px_34px_rgba(20,53,45,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#c5a880] hover:text-[#0a0a0a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0a0a0a] sm:min-h-12 sm:gap-2 sm:px-7 sm:text-sm"
				>
					Shop Collection
					<span
						class="inline-flex h-3 w-3 items-center justify-center rounded-full bg-white/92 text-[#0a0a0a] sm:h-5 sm:w-5"
					>
						<svg
							class="h-2 w-2 sm:h-3 sm:w-3"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2.4"
								d="M7 17L17 7M9 7h8v8"
							/>
						</svg>
					</span>
				</a>
				<a
					href="/lookbook"
					class="inline-flex min-h-7 items-center justify-center rounded-full border border-[#0a0a0a]/20 bg-white/72 px-2 text-[0.56rem] font-bold whitespace-nowrap text-[#0a0a0a] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0a0a0a] sm:min-h-12 sm:px-7 sm:text-sm"
				>
					View Lookbook
				</a>
			</div>
		</div>
	</div>
</section>

{#if saleTapeEnabled && saleTapeItems.length}
	<!-- Eid Sale Tape -->
	<section class="relative overflow-hidden bg-[#f7f4ec] px-4 py-4 sm:px-6 lg:px-8">
		<div class="sale-tape-stage" aria-hidden="true">
			<div class="sale-tape sale-tape--gold">
				<div class="sale-tape__track sale-tape__track--ltr">
					{#each saleTapeLoop as item}
						<span>
							{#if isBrandText(item)}
								<AbayizaWordmark />
							{:else}
								{item}
							{/if}
						</span>
					{/each}
				</div>
			</div>
		</div>
	</section>
{/if}

<!-- Categories -->
<CategoryCircleCards {collections} />

<!-- Featured Collections -->
<section class="border-t border-[#0a0a0a]/8 bg-[#fbf9f2] px-4 py-16 sm:px-6 lg:px-8">
	<div class="mx-auto max-w-6xl">
		<div class="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
			<div>
				<p class="mb-3 text-xs font-bold tracking-[0.18em] text-[#7b6a3d] uppercase">
					Curated Edits
				</p>
				<h2 class="font-serif text-3xl leading-tight text-[#0a0a0a] uppercase sm:text-4xl">
					Signature Collections
				</h2>
			</div>
			<div class="max-w-md space-y-4 sm:text-right">
				<p class="text-sm leading-6 font-medium text-[#52524f]">
					Refined edits for the pieces you reach for most: daily essentials, occasion layers, and
					timeless black abayas.
				</p>
			</div>
		</div>

		<div
			class="grid grid-cols-2 items-stretch gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 xl:mx-auto xl:max-w-7xl"
		>
			{#each curatedEdits as edit}
				<ProductCard product={edit} aspectRatio="aspect-[5/6]" />
			{/each}
		</div>

		{#if hasViewAll(signatureCollectionsSection)}
			<div class="mt-8 text-center">
				<a
					href={signatureCollectionsSection.viewAllHref}
					class="inline-flex min-h-11 items-center justify-center rounded-full border border-[#0a0a0a]/12 bg-white px-6 text-xs font-black tracking-[0.12em] text-[#0a0a0a] uppercase shadow-[0_12px_28px_rgba(20,53,45,0.08)] transition-colors hover:border-[#c5a880] hover:bg-[#c5a880] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0a0a0a]"
				>
					View All
				</a>
			</div>
		{/if}
	</div>
</section>

<!-- Abaya Low-Height Sliding Banner -->
<AbayaSlidingBanner settings={storefrontSettings} />

<!-- Features / Trust Banner -->
<section class="bg-cream px-4 pt-4 pb-6 sm:px-6 lg:px-8">
	<div class="mx-auto max-w-7xl">
		<div
			class="flex flex-col items-center justify-between gap-6 rounded-[2rem] border border-[#0a0a0a]/6 bg-white p-6 shadow-[0_12px_36px_rgba(20,53,45,0.02)] sm:p-8 lg:flex-row lg:px-12"
		>
			<!-- Title -->
			<div class="shrink-0 text-center lg:text-left">
				<h3 class="font-serif text-xl font-black tracking-wide text-[#0a0a0a] sm:text-2xl">
					Exceptional Quality <span class="text-red-600">Delivered</span>
				</h3>
			</div>

			<!-- Grid of features -->
			<div class="grid w-full grid-cols-2 items-center gap-6 md:grid-cols-4 lg:w-auto lg:gap-8">
				<!-- Feature 1 -->
				<div class="flex items-center gap-3">
					<div
						class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0a0a0a]/5 text-[#0a0a0a]"
					>
						<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.8"
								d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"
							/>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.8"
								d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10M21 16V10a2 2 0 00-2-2h-6v8m0-8V5a1 1 0 011-1h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V16"
							/>
						</svg>
					</div>
					<div class="text-left leading-tight">
						<span class="block text-xs font-black text-[#0a0a0a] uppercase">Free Shipping</span>
						<span class="block text-[0.62rem] font-medium text-gray-500">Nationwide Delivery</span>
					</div>
				</div>

				<!-- Feature 2 -->
				<div class="flex items-center gap-3">
					<div
						class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0a0a0a]/5 text-[#0a0a0a]"
					>
						<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.8"
								d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
					<div class="text-left leading-tight">
						<span class="block text-xs font-black text-[#0a0a0a] uppercase">10K+ Happy</span>
						<span class="block text-[0.62rem] font-medium text-gray-500">Satisfied Customers</span>
					</div>
				</div>

				<!-- Feature 3 -->
				<div class="flex items-center gap-3">
					<div
						class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0a0a0a]/5 text-[#0a0a0a]"
					>
						<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.8"
								d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z"
							/>
						</svg>
					</div>
					<div class="text-left leading-tight">
						<span class="block text-xs font-black text-[#0a0a0a] uppercase">Premium Fabric</span>
						<span class="block text-[0.62rem] font-medium text-gray-500">Quality Guarantee</span>
					</div>
				</div>

				<!-- Feature 4 -->
				<div class="flex items-center gap-3">
					<div
						class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0a0a0a]/5 text-[#0a0a0a]"
					>
						<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.8"
								d="M4.8 8h14.4L12 20 4.8 8z"
							/>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.8"
								d="M12 4L4.8 8 12 12 19.2 8 12 4z"
							/>
						</svg>
					</div>
					<div class="text-left leading-tight">
						<span class="block text-xs font-black text-[#0a0a0a] uppercase">100% Authentic</span>
						<span class="block text-[0.62rem] font-medium text-gray-500">Original Abayas</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- New Arrivals (Horizontal Scroll / Grid) -->
<section class="bg-cream px-4 py-16 sm:px-6 lg:px-8">
	<div class="mx-auto max-w-6xl">
		<div class="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
			<div>
				<h2 class="mb-2 font-serif text-3xl tracking-widest text-black uppercase">New Arrivals</h2>
				<p class="font-light text-gray-500">The latest additions to our collection</p>
			</div>
		</div>

		<div class="grid grid-cols-2 items-stretch gap-3 sm:gap-6 lg:grid-cols-4">
			{#each newArrivals as item}
				<ProductCard product={item} aspectRatio="aspect-[1/1]" />
			{/each}
		</div>

		{#if hasViewAll(newArrivalsSection)}
			<div class="mt-8 text-center">
				<a
					href={newArrivalsSection.viewAllHref}
					class="inline-flex min-h-11 items-center justify-center rounded-full border border-[#0a0a0a]/12 bg-white px-6 text-xs font-black tracking-[0.12em] text-[#0a0a0a] uppercase shadow-[0_12px_28px_rgba(20,53,45,0.08)] transition-colors hover:border-[#c5a880] hover:bg-[#c5a880] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0a0a0a]"
				>
					View All
				</a>
			</div>
		{/if}
	</div>
</section>

{#if storefrontSettings.flashSaleEnabled}
	<!-- Flash Sale Timer Offer Banner -->
	<FlashSaleTimerBanner settings={storefrontSettings} />
{/if}

<!-- Bestsellers -->
<section class="overflow-hidden bg-cream py-14">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="mb-8 flex flex-col gap-6">
			<div class="text-center">
				<h2 class="font-serif text-3xl tracking-widest text-[#0a0a0a] uppercase">Most Loved</h2>
			</div>

			<div class="category-ribbon" aria-label="Bestseller categories">
				<div class="category-ribbon__track">
					{#each bestsellerCategoryTags as tag}
						<span
							class="inline-flex min-h-8 shrink-0 items-center justify-center rounded-full border border-[#0a0a0a]/10 bg-[#fffaf0] px-4 text-[0.68rem] font-black tracking-[0.12em] text-[#0a0a0a] uppercase shadow-[0_10px_22px_rgba(20,53,45,0.08)]"
						>
							{tag}
						</span>
					{/each}
				</div>
			</div>
		</div>

		<div class="product-loop-stack">
			{#each bestsellerRows as row, rowIndex}
				<div
					class="product-loop {rowIndex === 1 ? 'product-loop--second' : ''}"
					aria-label={`Most loved products row ${rowIndex + 1}`}
				>
					<div class="product-loop__track">
						{#each [...row, ...row] as item, itemIndex}
							<div
								class={`product-loop__item min-w-0 sm:w-[17.5rem] sm:shrink-0 lg:w-[18.25rem] ${itemIndex >= row.length ? 'product-loop__item--duplicate' : ''}`}
							>
								<ProductCard product={item} aspectRatio="aspect-[5/6]" />
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>

		{#if hasViewAll(mostLovedSection)}
			<div class="mt-8 text-center">
				<a
					href={mostLovedSection.viewAllHref}
					class="inline-flex min-h-11 items-center justify-center rounded-full border border-[#0a0a0a]/12 bg-white px-6 text-xs font-black tracking-[0.12em] text-[#0a0a0a] uppercase shadow-[0_12px_28px_rgba(20,53,45,0.08)] transition-colors hover:border-[#c5a880] hover:bg-[#c5a880] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0a0a0a]"
				>
					View All
				</a>
			</div>
		{/if}
	</div>
</section>

<!-- Special Promo Offers Section -->
<ProOfferGrid {products} onAddToCart={addProductToCart} />

{#if reviewPhotos.length}
	<!-- Review Photos -->
	<section class="overflow-hidden bg-cream py-16 sm:py-20">
		<div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
			<p class="mb-4 text-xs font-black tracking-[0.2em] text-[#a8895f] uppercase">Customer Love</p>
			<h2 class="font-serif text-3xl tracking-widest text-[#0a0a0a] uppercase sm:text-4xl">
				Reviews
			</h2>
		</div>

		<div
			class={`review-photo-loop mt-10 ${shouldAnimateReviewPhotos ? 'review-photo-loop--animated' : 'review-photo-loop--static'}`}
			aria-label="Customer review photos"
		>
			<div class="review-photo-loop__track">
				{#each reviewPhotoLoop as photo, index}
					<figure class="review-photo-card">
						<img
							src={photo.url}
							alt={`Shahzad Abaya's customer review ${index + 1}`}
							class="h-full w-full object-cover object-center"
							loading="lazy"
						/>
					</figure>
				{/each}
			</div>
		</div>
	</section>
{/if}

<style>
	.hero-bg {
		overflow: hidden;
	}

	.hero-bg__slide {
		position: absolute;
		inset: 0;
		z-index: 0;
		visibility: hidden;
		transform: translateX(-100%);
		transition: transform 950ms cubic-bezier(0.72, 0, 0.2, 1);
		will-change: transform;
	}

	.hero-bg--previous .hero-bg__slide {
		transform: translateX(100%);
	}

	.hero-bg__slide--active {
		z-index: 2;
		visibility: visible;
		transform: translateX(0);
	}

	.hero-bg__slide--previous-next {
		z-index: 1;
		visibility: visible;
		transform: translateX(100%);
	}

	.hero-bg__slide--previous-previous {
		z-index: 1;
		visibility: visible;
		transform: translateX(-100%);
	}

	.hero-typewriter {
		display: inline-block;
		min-width: 8.5ch;
	}

	.hero-typewriter::after {
		content: '';
		display: inline-block;
		height: 0.78em;
		margin-left: 0.08em;
		border-right: 0.055em solid currentColor;
		animation: hero-caret-blink 0.78s steps(1) infinite;
	}

	@keyframes hero-caret-blink {
		50% {
			opacity: 0;
		}
	}

	.sale-tape-stage {
		position: relative;
		min-height: 3.8rem;
		margin-inline: -4rem;
	}

	.sale-tape {
		position: absolute;
		left: -10%;
		width: 120%;
		overflow: hidden;
		box-shadow: 0 22px 48px rgba(20, 53, 45, 0.14);
		filter: blur(0.28px);
	}

	.sale-tape--gold {
		top: 0.45rem;
		transform: rotate(0deg);
		background: #c5a880;
		color: #0a0a0a;
	}

	.sale-tape__track {
		display: flex;
		width: max-content;
		align-items: center;
		gap: 2rem;
		min-height: 2.9rem;
		padding-inline: 1.5rem;
		will-change: transform;
	}

	.sale-tape__track--ltr {
		animation: sale-tape-left-to-right 18s linear infinite;
	}

	.sale-tape__track span {
		flex: 0 0 auto;
		font-size: clamp(1.05rem, 2.45vw, 2.35rem);
		font-weight: 900;
		letter-spacing: 0.08em;
		line-height: 1;
		text-transform: uppercase;
		white-space: nowrap;
	}

	@keyframes sale-tape-left-to-right {
		from {
			transform: translateX(-50%);
		}
		to {
			transform: translateX(0);
		}
	}

	.category-ribbon {
		overflow-x: auto;
		padding-block: 0.65rem;
		scrollbar-width: none;
	}

	.category-ribbon::-webkit-scrollbar {
		display: none;
	}

	.category-ribbon__track {
		display: flex;
		width: max-content;
		gap: 0.75rem;
		margin-inline: auto;
	}

	.product-loop-stack {
		display: flex;
		flex-direction: column;
		gap: 1.4rem;
	}

	.product-loop {
		margin-inline: -1rem;
		overflow: hidden;
		padding-block: 0.65rem;
	}

	.product-loop__track {
		display: flex;
		width: max-content;
		gap: 1.5rem;
		animation: product-loop-slide 28s linear infinite;
		will-change: transform;
	}

	.product-loop--second .product-loop__track {
		animation-duration: 34s;
	}

	.product-loop:hover .product-loop__track,
	.product-loop:focus-within .product-loop__track {
		animation-play-state: paused;
	}

	@keyframes product-loop-slide {
		from {
			transform: translateX(-50%);
		}
		to {
			transform: translateX(0);
		}
	}

	.review-photo-loop {
		margin-inline: -1rem;
		overflow: hidden;
		padding-block: 0.5rem;
	}

	.review-photo-loop__track {
		display: flex;
		width: max-content;
		gap: 1rem;
		will-change: transform;
	}

	.review-photo-loop--static .review-photo-loop__track {
		width: 100%;
		justify-content: center;
	}

	.review-photo-loop--animated .review-photo-loop__track {
		animation: review-photo-slide 34s linear infinite;
	}

	.review-photo-loop--animated:hover .review-photo-loop__track,
	.review-photo-loop--animated:focus-within .review-photo-loop__track {
		animation-play-state: paused;
	}

	.review-photo-card {
		aspect-ratio: 4 / 5;
		width: min(18rem, 72vw);
		flex-shrink: 0;
		overflow: hidden;
		border-radius: 0.45rem;
		background: #eeece4;
		box-shadow: 0 18px 44px rgba(20, 53, 45, 0.1);
		outline: 1px solid rgba(20, 53, 45, 0.1);
	}

	@keyframes review-photo-slide {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(-50%);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.hero-bg__slide {
			transition: none;
		}

		.product-loop__track,
		.review-photo-loop__track {
			animation: none;
			transform: none;
		}
	}

	@media (max-width: 640px) {
		.sale-tape-stage {
			min-height: 3.3rem;
			margin-inline: -2rem;
		}

		.sale-tape__track {
			min-height: 2.45rem;
			gap: 1.25rem;
		}

		.sale-tape--gold {
			top: 0.4rem;
		}

		.product-loop-stack {
			gap: 1rem;
		}

		.product-loop {
			margin-inline: 0;
			overflow: visible;
			padding-block: 0.2rem;
		}

		.product-loop__track {
			display: grid;
			width: 100%;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 0.8rem;
			animation: none;
			transform: none;
		}

		.product-loop__item {
			width: auto;
			min-width: 0;
		}

		.product-loop__item--duplicate {
			display: none;
		}

		.category-ribbon {
			margin-inline: -1rem;
			padding-inline: 1rem;
		}

		.category-ribbon__track {
			margin-inline: 0;
		}

		.review-photo-loop {
			margin-inline: -1rem;
		}

		.review-photo-loop__track {
			gap: 0.75rem;
		}

		.review-photo-loop--animated .review-photo-loop__track {
			animation-duration: 28s;
		}

		.review-photo-card {
			width: 12.5rem;
		}
	}
</style>
