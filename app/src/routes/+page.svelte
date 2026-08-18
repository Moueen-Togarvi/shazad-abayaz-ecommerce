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
	import TieNDyeShowcase from '$lib/components/TieNDyeShowcase.svelte';

	import { cloudinaryUrl } from '$lib/shared/cloudinary-image';
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
	let bannerSlides = $derived([
		{
			image: storefrontSettings.slide1Image || '/banner-section/banner-1.webp',
			alt: 'Shahzad Abayas featured banner collection'
		},
		{
			image: storefrontSettings.slide2Image || '/banner-section/banner-2.webp',
			alt: 'Shahzad Abayas premium modest wear banner'
		},
		{
			image: storefrontSettings.slide3Image || '/banner-section/banner-3.webp',
			alt: 'Shahzad Abayas new arrival banner'
		}
	]);

	let heroWordTimers: ReturnType<typeof setTimeout>[] = [];

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
	const heroLeadWords = ['Timeless', 'Elegant', 'Poised', 'Luminous'];
	const heroSupportWords = ['Graceful', 'Refined', 'Regal', 'Flowing'];
	let heroLeadWordIndex = $state(0);
	let heroSupportWordIndex = $state(0);
	let heroLeadDisplay = $state(heroLeadWords[0]);
	let heroSupportDisplay = $state(heroSupportWords[0]);
	let heroHeadingLead = $derived(`${heroLeadDisplay}.`);
	let heroHeadingSupport = $derived(`${heroSupportDisplay}.`);
	let heroHeadingAccent = $derived('Abayas.');

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
	let tieNDyeSection = $derived(homeSection('tie-n-die-abaya', 4));
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

	function isBrandText(value: string) {
		return brandPattern.test(value);
	}

	function productImage(item: any) {
		return item.images?.[0]?.url || collections[0]?.imageUrl || '/image.webp';
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
		const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
		const scheduleHeroWordTimer = (callback: () => void, delay: number) => {
			const timer = setTimeout(callback, delay);
			heroWordTimers.push(timer);
			return timer;
		};
		const clearHeroWordTimers = () => {
			for (const timer of heroWordTimers) clearTimeout(timer);
			heroWordTimers = [];
		};

		const runHeroWordCycle = () => {
			if (!active || reduceMotionQuery.matches) return;
			clearHeroWordTimers();

			const nextLeadIndex = (heroLeadWordIndex + 1) % heroLeadWords.length;
			const nextSupportIndex = (heroSupportWordIndex + 1) % heroSupportWords.length;
			const nextLeadWord = heroLeadWords[nextLeadIndex];
			const nextSupportWord = heroSupportWords[nextSupportIndex];

			const deleteWord = (
				currentText: string,
				assign: (value: string) => void,
				onDone: () => void
			) => {
				let index = currentText.length;
				const step = () => {
					if (!active) return;
					assign(currentText.slice(0, index));
					if (index === 0) {
						onDone();
						return;
					}
					index -= 1;
					scheduleHeroWordTimer(step, 38);
				};
				step();
			};

			const typeWord = (nextText: string, assign: (value: string) => void, onDone: () => void) => {
				let index = 0;
				const step = () => {
					if (!active) return;
					index += 1;
					assign(nextText.slice(0, index));
					if (index >= nextText.length) {
						onDone();
						return;
					}
					scheduleHeroWordTimer(step, 76);
				};
				step();
			};

			deleteWord(
				heroLeadDisplay,
				(value) => (heroLeadDisplay = value),
				() => {
					typeWord(
						nextLeadWord,
						(value) => (heroLeadDisplay = value),
						() => {
							heroLeadWordIndex = nextLeadIndex;
						}
					);
				}
			);

			scheduleHeroWordTimer(() => {
				deleteWord(
					heroSupportDisplay,
					(value) => (heroSupportDisplay = value),
					() => {
						typeWord(
							nextSupportWord,
							(value) => (heroSupportDisplay = value),
							() => {
								heroSupportWordIndex = nextSupportIndex;
							}
						);
					}
				);
			}, 180);

			scheduleHeroWordTimer(runHeroWordCycle, 4200);
		};

		if (!reduceMotionQuery.matches) {
			scheduleHeroWordTimer(runHeroWordCycle, 2400);
		}

		return () => {
			active = false;
			clearHeroWordTimers();
		};
	});
</script>

<svelte:head>
	<title>Shahzad Abaya's | Premium Modest Fashion</title>
	<link rel="preload" as="image" href="/hero/custom-hero.webp" fetchpriority="high" />
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
	class="hero-cinematic relative isolate -mt-[4.25rem] min-h-[calc(100vh+20px)] overflow-hidden bg-[#eeece4] text-[#0a0a0a] md:-mt-[4.75rem]"
>
	<div class="hero-bg absolute inset-0 -z-30" data-depth="0">
		<img
			src="/hero/custom-hero.webp"
			alt="Shahzad Abayas hero banner"
			width="1600"
			height="753"
			fetchpriority="high"
			decoding="async"
			class="hero-bg__image h-full w-full scale-[1.02] bg-[#eadac8] object-cover object-[72%_center] sm:object-center"
		/>
	</div>

	<div
		class="absolute inset-y-0 left-0 z-20 flex w-[62%] -translate-y-8 items-center justify-start px-4 text-left sm:w-[58%] sm:translate-x-[10%] sm:translate-y-0 sm:justify-center sm:px-8 sm:text-center lg:w-[55%] lg:translate-x-[18%]"
	>
		<div
			class="max-w-[12rem] px-1 py-4 drop-shadow-[0_2px_12px_rgba(255,255,255,0.72)] sm:max-w-[25rem] sm:px-5 lg:max-w-[27rem]"
		>
			<p
				class="mb-1.5 text-[0.42rem] font-black tracking-[0.24em] text-[#0a0a0a] uppercase sm:mb-3 sm:text-[0.68rem] sm:tracking-[0.34em]"
			>
				Timeless Elegance
			</p>
			<div
				class="mb-1 flex items-center justify-start gap-2 text-[#2a2a2a] sm:justify-center sm:gap-2.5"
			>
				<span class="h-px w-6 bg-current sm:w-8"></span>
				<span class="size-1.5 rotate-45 bg-current"></span>
				<span class="h-px w-6 bg-current sm:w-8"></span>
			</div>
			<h1
				class="font-serif text-[1.45rem] leading-none font-normal tracking-[0.1em] text-[#0a0a0a] uppercase sm:text-[3.8rem] sm:tracking-[0.12em] lg:text-[4.8rem]"
			>
				Shahzad
			</h1>
			<h2
				class="-mt-0.5 font-serif text-[1.16rem] leading-none font-normal tracking-[0.06em] text-[#0a0a0a] uppercase sm:-mt-2 sm:text-[3rem] sm:tracking-[0.08em] lg:text-[3.9rem]"
			>
				Abaya's
			</h2>
			<p
				class="mt-2 text-[0.42rem] font-black tracking-[0.13em] text-[#1a1a1a] uppercase sm:mt-4 sm:text-[0.68rem] sm:tracking-[0.24em]"
			>
				• Modesty. Elegance. You •
			</p>
			<p
				class="mt-1.5 max-w-[10rem] text-[0.42rem] leading-snug font-semibold text-pretty text-[#3f3f3f] sm:mx-auto sm:mt-2.5 sm:max-w-[16rem] sm:text-xs"
			>
				Discover our premium abaya collection crafted for every moment of your life.
			</p>
		</div>
	</div>

	<div
		class="absolute bottom-8 left-[18%] z-20 grid hidden grid-cols-4 gap-5 text-center text-[#0a0a0a] sm:grid lg:left-[26%] lg:gap-7"
	>
		<div class="flex flex-col items-center gap-1.5">
			<span
				class="flex size-9 items-center justify-center rounded-full border border-[#0a0a0a]/28 bg-white/40"
			>
				<svg
					class="size-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					aria-hidden="true"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.8"
						d="m12 3 7 6-7 12L5 9l7-6Z"
					/>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.8"
						d="M5 9h14M9 9l3 12 3-12"
					/>
				</svg>
			</span>
			<span class="text-[0.5rem] leading-tight font-black uppercase">Premium<br />Quality</span>
		</div>
		<div class="flex flex-col items-center gap-1.5">
			<span
				class="flex size-9 items-center justify-center rounded-full border border-[#0a0a0a]/28 bg-white/40"
			>
				<svg
					class="size-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					aria-hidden="true"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.8"
						d="M20 4C12 4 6 8 5 18c8 0 14-5 15-14Z"
					/>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.8"
						d="M5 18c4-5 8-7 13-9"
					/>
				</svg>
			</span>
			<span class="text-[0.5rem] leading-tight font-black uppercase"
				>Lightweight<br />& Comfort</span
			>
		</div>
		<div class="flex flex-col items-center gap-1.5">
			<span
				class="flex size-9 items-center justify-center rounded-full border border-[#0a0a0a]/28 bg-white/40"
			>
				<svg
					class="size-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					aria-hidden="true"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.8"
						d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4"
					/>
					<circle cx="12" cy="12" r="3" stroke-width="1.8" />
				</svg>
			</span>
			<span class="text-[0.5rem] leading-tight font-black uppercase">Elegant<br />Design</span>
		</div>
		<div class="flex flex-col items-center gap-1.5">
			<span
				class="flex size-9 items-center justify-center rounded-full border border-[#0a0a0a]/28 bg-white/40"
			>
				<svg
					class="size-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					aria-hidden="true"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.8"
						d="M12 3 19 6v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3Z"
					/>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.8"
						d="m9 12 2 2 4-5"
					/>
				</svg>
			</span>
			<span class="text-[0.5rem] leading-tight font-black uppercase">All Day<br />Confidence</span>
		</div>
	</div>
</section>

{#if saleTapeEnabled && saleTapeItems.length}
	<!-- Eid Sale Tape -->
	<section class="relative overflow-hidden bg-white px-4 py-4 sm:px-6 lg:px-8">
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
<section class="border-t border-[#0a0a0a]/8 bg-white px-4 py-16 sm:px-6 lg:px-8">
	<div class="mx-auto max-w-6xl">
		<div class="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
			<div>
				<p class="mb-3 text-xs font-bold tracking-[0.18em] text-[#7b6a3d] uppercase">
					Curated Edits
				</p>
				<h2 class="font-serif text-3xl leading-tight text-[#0a0a0a] uppercase sm:text-4xl">
					Signature <span class="text-[#0a0a0a]">Collections</span>
				</h2>
			</div>
			<div class="max-w-md space-y-4 sm:text-right">
				<p class="text-sm leading-6 font-medium text-[#6b7280]">
					Refined edits for the pieces you reach for most: daily essentials, occasion layers, and
					<span class="font-bold text-[#0a0a0a]">timeless black abayas.</span>
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

<!-- Tie N Die editorial product showcase -->
<TieNDyeShowcase products={tieNDyeSection.products} />

<!-- Abaya Low-Height Sliding Banner -->
<AbayaSlidingBanner slides={bannerSlides} />

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
						<span class="block text-[0.62rem] font-medium text-gray-500"
							>On Full Advance Payment</span
						>
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
				<h2 class="mb-2 font-serif text-3xl tracking-widest text-black uppercase">
					New <span class="text-[#0a0a0a]">Arrivals</span>
				</h2>
				<p class="font-light text-[#6b7280]">
					The latest additions to our <span class="font-semibold text-[#0a0a0a]">collection</span>
				</p>
			</div>
		</div>

		<div class="grid grid-cols-2 items-stretch gap-3 sm:gap-6 lg:grid-cols-4">
			{#each newArrivals as item}
				<ProductCard product={item} aspectRatio="aspect-[100/106.5]" />
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
				<h2 class="font-serif text-3xl tracking-widest text-[#0a0a0a] uppercase">
					Most <span class="text-[#0a0a0a]">Loved</span>
				</h2>
			</div>

			<div class="category-ribbon" aria-label="Bestseller categories">
				<div class="category-ribbon__track">
					{#each bestsellerCategoryTags as tag}
						<span
							class="inline-flex min-h-8 shrink-0 items-center justify-center rounded-full border border-[#0a0a0a]/18 bg-gray-50 px-4 text-[0.68rem] font-black tracking-[0.12em] text-[#1a1a1a] uppercase shadow-[0_10px_22px_rgba(0,0,0,0.08)]"
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
							src={cloudinaryUrl(photo.url, 400)}
							alt={`Shahzad Abaya's customer review ${index + 1}`}
							width="400"
							height="500"
							class="h-full w-full object-cover object-center"
							loading="lazy"
							decoding="async"
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

	.hero-bg__image {
		display: block;
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
