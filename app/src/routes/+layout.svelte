<script lang="ts">
	import { browser, dev } from '$app/environment';
	import { navigating, page } from '$app/state';
	import { env } from '$env/dynamic/public';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import { onMount } from 'svelte';
	import './layout.css';
	import AbayizaLoader from '$lib/components/AbayizaLoader.svelte';
	import AbayizaWordmark from '$lib/components/AbayizaWordmark.svelte';
	import { cart } from '$lib/client/cart.svelte';
	import { pixelsEnabled, trackPageView } from '$lib/client/pixels';
	import { wishlist } from '$lib/client/wishlist.svelte';
	import {
		PRIMARY_WHATSAPP_URL,
		SITE_BRAND,
		SITE_IMAGE,
		SITE_NAME,
		STORE_ADDRESS,
		SUPPORT_PHONE_DISPLAY,
		SUPPORT_PHONE_INTERNATIONAL,
		TIKTOK_URL,
		absoluteUrl,
		jsonLdScript
	} from '$lib/shared/seo';

	let { children } = $props();
	let mobileMenuOpen = $state(false);
	let whatsAppMenuOpen = $state(false);
	let isScrolled = $state(false);

	injectAnalytics({ mode: dev ? 'development' : 'production' });

	const primaryNavItems = [
		{ href: '/', label: 'Home' },
		{ href: '/shop', label: 'Shop' },
		{ href: '/collections', label: 'Collections' },
		{ href: '/size-guide', label: 'Size Guide' },
		{ href: '/about', label: 'About' },
		{ href: '/contact', label: 'Contact' }
	];

	const iconButtonClass =
		'inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/24 bg-[#0a0a0a]/92 text-white shadow-[0_12px_28px_rgba(20,53,45,0.18)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#c8ff46] hover:text-[#0a0a0a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a0a0a]';
	const primaryWhatsAppHref = PRIMARY_WHATSAPP_URL;
	const announcementItems = [
		'Whole Sale Market Deals Available',
		'Bulk Orders & Reseller Pricing on WhatsApp'
	];
	const announcementLoop = Array.from({ length: 8 }, () => announcementItems).flat();

	let isAdminRoute = $derived(page.url.pathname.startsWith('/shahzad-secure-admin-4db067e1'));
	let isNavigating = $derived(Boolean(navigating.to));
	let canonicalHref = $derived(canonicalUrl(page.url));
	let robotsMeta = $derived(
		shouldNoindex(page.url) ? 'noindex,follow' : 'index,follow,max-image-preview:large'
	);
	let socialImage = $derived(absoluteUrl(SITE_IMAGE, page.url.origin));
	let metaPixelId = $derived((env.PUBLIC_META_PIXEL_ID || '').trim());
	let tikTokPixelId = $derived((env.PUBLIC_TIKTOK_PIXEL_ID || '').trim());
	let pixelNoscriptUrl = $derived(
		metaPixelId ? `https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1` : ''
	);
	let siteJsonLd = $derived(
		jsonLdScript([
			{
				'@context': 'https://schema.org',
				'@type': 'Organization',
				name: SITE_NAME,
				alternateName: SITE_BRAND,
				url: absoluteUrl('/', page.url.origin),
				logo: socialImage,
				image: socialImage,
				address: {
					'@type': 'PostalAddress',
					streetAddress: STORE_ADDRESS,
					addressLocality: 'Attock city',
					addressCountry: 'PK'
				},
				sameAs: [TIKTOK_URL, PRIMARY_WHATSAPP_URL],
				contactPoint: [
					{
						'@type': 'ContactPoint',
						contactType: 'customer support',
						telephone: SUPPORT_PHONE_INTERNATIONAL,
						areaServed: 'PK',
						availableLanguage: ['en', 'ur']
					}
				]
			},
			{
				'@context': 'https://schema.org',
				'@type': 'WebSite',
				name: SITE_NAME,
				url: absoluteUrl('/', page.url.origin),
				potentialAction: {
					'@type': 'SearchAction',
					target: `${absoluteUrl('/search', page.url.origin)}?q={search_term_string}`,
					'query-input': 'required name=search_term_string'
				}
			}
		])
	);
	let lastTrackedPath = '';

	onMount(() => {
		let frame = 0;
		const updateScrollState = () => {
			if (frame) return;
			frame = requestAnimationFrame(() => {
				isScrolled = window.scrollY > 24;
				frame = 0;
			});
		};

		updateScrollState();
		window.addEventListener('scroll', updateScrollState, { passive: true });

		return () => {
			window.removeEventListener('scroll', updateScrollState);
			if (frame) cancelAnimationFrame(frame);
		};
	});

	function shouldNoindex(url: URL) {
		const noindexPrefixes = [
			'/shahzad-secure-admin-4db067e1',
			'/account',
			'/cart',
			'/checkout',
			'/login',
			'/track',
			'/wishlist',
			'/search'
		];
		const hasFilterParams = ['q', 'color', 'size', 'category', 'collection'].some((key) =>
			url.searchParams.has(key)
		);

		return noindexPrefixes.some((prefix) => url.pathname.startsWith(prefix)) || hasFilterParams;
	}

	function canonicalUrl(url: URL) {
		const canonical = new URL(url.pathname, url.origin);
		const pageNumber = Number(url.searchParams.get('page') || '1');
		const isPaginatedListing = url.pathname === '/shop' || url.pathname.startsWith('/sections/');

		if (isPaginatedListing && Number.isFinite(pageNumber) && pageNumber > 1) {
			canonical.searchParams.set('page', String(Math.floor(pageNumber)));
		}

		return canonical.toString();
	}

	function inlineScript(code: string) {
		return '<scr' + `ipt>${code.replace(/<\/script>/gi, '<\\/script>')}</scr` + 'ipt>';
	}

	let metaPixelScript = $derived(
		metaPixelId
			? inlineScript(`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${metaPixelId}');`)
			: ''
	);
	let tikTokPixelScript = $derived(
		tikTokPixelId
			? inlineScript(`!function (w, d, t) {
  w.TiktokAnalyticsObject=t;
  var ttq=w[t]=w[t]||[];
  ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"];
  ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
  for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
  ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};
  ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js";
  ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=r;ttq._t=ttq._t||{};ttq._t[e]=+new Date;
  ttq._o=ttq._o||{};ttq._o[e]=n||{};
  n=document.createElement("script");n.type="text/javascript";n.async=!0;n.src=r+"?sdkid="+e+"&lib="+t;
  e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
  ttq.load('${tikTokPixelId}');
}(window, document, 'ttq');`)
			: ''
	);

	$effect(() => {
		if (!browser || !pixelsEnabled() || isAdminRoute) return;

		const currentPath = `${page.url.pathname}${page.url.search}`;

		if (lastTrackedPath === currentPath) return;
		lastTrackedPath = currentPath;

		trackPageView();
	});
</script>

<svelte:head>
	<meta name="robots" content={robotsMeta} />
	<meta name="theme-color" content="#0a0a0a" />
	<link rel="canonical" href={canonicalHref} />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:locale" content="en_PK" />
	<meta property="og:url" content={canonicalHref} />
	<meta property="og:image" content={socialImage} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content={socialImage} />
	{#if !isAdminRoute}
		{@html metaPixelScript}
		{@html tikTokPixelScript}
	{/if}
	{@html siteJsonLd}
</svelte:head>

<div
	class={`flex min-h-screen flex-col font-sans text-black ${isAdminRoute ? 'bg-white' : 'bg-cream'}`}
>
	{#if !isAdminRoute && pixelNoscriptUrl}
		<noscript>
			<img height="1" width="1" style="display:none" alt="" src={pixelNoscriptUrl} />
		</noscript>
	{/if}
	{#if !isAdminRoute}
		<!-- Full-width announcement bar -->
		<div
			class="announcement-strap w-full overflow-hidden bg-[#111111] text-white {isScrolled
				? 'is-hidden'
				: ''}"
			aria-label="Store announcements"
		>
			<div class="announcement-strap__marquee">
				<div class="announcement-strap__track">
					{#each announcementLoop as item}
						<span>
							<span class="announcement-strap__dot"></span>
							{item}
						</span>
					{/each}
				</div>
				<div class="announcement-strap__track" aria-hidden="true">
					{#each announcementLoop as item}
						<span>
							<span class="announcement-strap__dot"></span>
							{item}
						</span>
					{/each}
				</div>
			</div>
		</div>
		<!-- Navbar -->
		<header class="sticky top-0 z-50 px-3 pt-0 pb-3 sm:px-5">
			<div class="mx-auto max-w-7xl">
				<div class="transition-all duration-300">
					<div class="flex h-14 items-center justify-between gap-2">
						<a
							href="/"
							class="group inline-flex min-w-0 shrink-0 items-center gap-0 rounded-full border border-white/70 bg-white/86 py-1 pr-1.5 pl-1.5 shadow-[0_12px_30px_rgba(0,0,0,0.14)] backdrop-blur-md sm:gap-2.5 sm:pr-4"
						>
							<img
								src="/image.webp"
								alt="Shahzad Abaya's"
								width="640"
								height="640"
								class="h-12 w-12 rounded-full object-cover shadow-[0_14px_30px_rgba(20,53,45,0.28)] ring-2 ring-white/80"
							/>
							<span class="hidden leading-none sm:block">
								<AbayizaWordmark class="block text-sm text-black" />
								<span class="mt-1 block text-[9px] font-semibold tracking-[0.08em] text-black"
									>Where Elegance Meets Modesty</span
								>
							</span>
						</a>

						<nav
							class="mx-auto hidden items-center gap-1 text-xs font-black lg:flex"
							aria-label="Primary navigation"
						>
							{#each primaryNavItems.slice(0, 4) as item}
								<a
									href={item.href}
									class={`rounded-full px-3.5 py-2 transition-all duration-300 ${
										page.url.pathname === item.href ||
										(item.href !== '/' && page.url.pathname.startsWith(item.href))
											? 'bg-[#0a0a0a] text-white shadow-[0_10px_24px_rgba(20,53,45,0.18)]'
											: 'text-[#0a0a0a] hover:bg-[#c8ff46]/88 hover:text-[#0a0a0a]'
									}`}
								>
									{item.label}
								</a>
							{/each}
						</nav>

						<form action="/search" method="GET" class="ml-auto hidden min-w-0 lg:block">
							<label
								class="flex h-10 w-[13rem] items-center gap-2 overflow-hidden rounded-full border border-white/24 bg-[#0a0a0a]/88 pr-3 pl-4 text-white shadow-[0_12px_28px_rgba(20,53,45,0.16)] backdrop-blur-md transition-colors focus-within:bg-[#0a0a0a]"
							>
								<svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="1.8"
										d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
									/>
								</svg>
								<input
									type="search"
									name="q"
									placeholder="Search abayas"
									class="h-full w-full border-0 bg-transparent px-0 text-xs font-semibold text-white placeholder:text-white/62 focus:ring-0"
								/>
							</label>
						</form>

						<div class="ml-auto flex items-center gap-1.5">
							<a
								href="/account"
								class={`${iconButtonClass} !hidden lg:!inline-flex`}
								aria-label="Account"
							>
								<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="1.8"
										d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM5 20a7 7 0 0114 0"
									/>
								</svg>
							</a>
							<a
								href="/wishlist"
								class={`${iconButtonClass} relative !hidden lg:!inline-flex`}
								aria-label="Wishlist"
							>
								<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="1.8"
										d="M12 20.25l-1.45-1.32C5.4 14.36 2 11.28 2 7.5A4.5 4.5 0 016.5 3c1.74 0 3.41.81 4.5 2.09A5.96 5.96 0 0115.5 3 4.5 4.5 0 0120 7.5c0 3.78-3.4 6.86-8.55 11.43L12 20.25z"
									/>
								</svg>
								{#if wishlist.totalItems > 0}
									<span
										class="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#c5a880] px-1 text-[9px] font-bold text-[#121212]"
									>
										{wishlist.totalItems}
									</span>
								{/if}
							</a>
							<a href="/cart" class={`${iconButtonClass} relative`} aria-label="Cart">
								<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="1.8"
										d="M6 7h15l-1.5 8.25H8.25L6 4.5H3"
									/>
									<circle cx="9" cy="19" r="1.25" fill="currentColor"></circle>
									<circle cx="18" cy="19" r="1.25" fill="currentColor"></circle>
								</svg>
								{#if cart.totalItems > 0}
									<span
										class="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#c5a880] px-1 text-[9px] font-bold text-[#121212]"
									>
										{cart.totalItems}
									</span>
								{/if}
							</a>
							<button
								type="button"
								class={`${iconButtonClass} lg:!hidden`}
								aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
								aria-expanded={mobileMenuOpen}
								onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
							>
								{#if mobileMenuOpen}
									<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="1.8"
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								{:else}
									<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="1.8"
											d="M4 7h16M4 12h16M4 17h16"
										/>
									</svg>
								{/if}
							</button>
						</div>
					</div>
				</div>

				{#if mobileMenuOpen}
					<div
						class="mt-2 overflow-hidden rounded-[1.25rem] border border-white/24 bg-[#0a0a0a]/92 p-3 text-white shadow-[0_22px_60px_rgba(20,53,45,0.22)] backdrop-blur-xl lg:hidden"
					>
						<form action="/search" method="GET">
							<label
								class="flex h-12 items-center gap-3 overflow-hidden rounded-full border border-white/12 bg-white/10 pr-3 pl-4 text-white"
							>
								<svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="1.8"
										d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
									/>
								</svg>
								<input
									type="search"
									name="q"
									placeholder="Search premium abayas"
									class="h-full w-full border-0 bg-transparent px-0 text-sm text-white placeholder:text-white/58 focus:ring-0"
								/>
							</label>
						</form>

						<nav class="mt-3 grid grid-cols-2 gap-2" aria-label="Mobile navigation">
							{#each primaryNavItems as item}
								<a
									href={item.href}
									class={`rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${
										page.url.pathname === item.href ||
										(item.href !== '/' && page.url.pathname.startsWith(item.href))
											? 'bg-[#c8ff46] text-[#0a0a0a] shadow-[0_12px_28px_rgba(200,255,70,0.16)]'
											: 'bg-white/9 text-white hover:bg-white/16'
									}`}
									onclick={() => (mobileMenuOpen = false)}
								>
									{item.label}
								</a>
							{/each}
						</nav>

						<div
							class="mt-3 flex items-center justify-between rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-xs font-semibold text-white"
						>
							<span>Free shipping on full advance payment</span>
							<span class="text-[#c8ff46]">PKR</span>
						</div>
					</div>
				{/if}
			</div>
		</header>
	{/if}

	<!-- Main Content -->
	<main class="flex-grow">
		{@render children()}
	</main>

	{#if !isAdminRoute}
		<div
			class="fixed right-4 bottom-5 z-50 flex flex-col items-end gap-2 sm:right-6 sm:bottom-6"
			role="navigation"
			aria-label="WhatsApp contact options"
			onmouseenter={() => (whatsAppMenuOpen = true)}
			onmouseleave={() => (whatsAppMenuOpen = false)}
			onfocusin={() => (whatsAppMenuOpen = true)}
			onfocusout={(event) => {
				if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
					whatsAppMenuOpen = false;
				}
			}}
		>
			{#if whatsAppMenuOpen}
				<div class="flex flex-col items-end gap-2">
					<a
						href={primaryWhatsAppHref}
						target="_blank"
						rel="noreferrer"
						class="inline-flex min-h-9 items-center justify-center rounded-full border border-white/95 bg-white px-4 text-[0.68rem] font-black tracking-[0.1em] text-[#0a0a0a] uppercase shadow-[0_12px_24px_rgba(20,53,45,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#c8ff46] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#25D366]"
						aria-label="Contact Shahzad Abaya's on WhatsApp"
					>
						WhatsApp {SUPPORT_PHONE_DISPLAY}
					</a>
				</div>
			{/if}
			<a
				href={primaryWhatsAppHref}
				target="_blank"
				rel="noreferrer"
				class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/95 bg-[#25D366] text-white shadow-[0_12px_24px_rgba(20,53,45,0.22)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#1fb95a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#25D366] sm:h-10 sm:w-10"
				aria-label="Contact Shahzad Abaya's on WhatsApp"
			>
				<svg
					class="h-5 w-5 translate-x-[0.5px] -translate-y-[0.5px] sm:h-[1.35rem] sm:w-[1.35rem]"
					viewBox="0 0 16 16"
					fill="currentColor"
					aria-hidden="true"
				>
					<path
						d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.066 7.926a7.9 7.9 0 0 0 1.057 3.965L0 16l4.204-1.103a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.928-7.93a7.9 7.9 0 0 0-2.325-5.606M7.998 14.524a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.002 3.628-2.959 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.331.065-.133.034-.247-.015-.346-.05-.099-.445-1.076-.612-1.47-.16-.39-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.397 2.132 3.383 2.992.473.205.842.327 1.13.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"
					/>
				</svg>
			</a>
		</div>

		<!-- Footer -->
		<footer class="bg-[#0a0a0a] pt-14 pb-8 text-white sm:pt-16">
			<div class="mx-auto max-w-7xl px-4 text-center sm:px-6 md:text-left lg:px-8">
				<div class="grid grid-cols-1 gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr_1.1fr] lg:gap-10">
					<div class="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6">
						<h3 class="mb-4 text-xl text-white"><AbayizaWordmark /></h3>
						<p class="text-sm leading-6 font-light text-pretty text-white/60">
							Where elegance meets modesty — premium abayas crafted for everyday grace and
							occasion-ready confidence.
						</p>
						<div
							class="mt-5 inline-flex rounded-full border border-white/35 bg-white/12 px-4 py-2 text-[0.68rem] font-black tracking-[0.12em] text-white uppercase"
						>
							Shahzad Abaya's
						</div>
					</div>

					<div class="pt-2">
						<h4 class="mb-5 text-xs font-black tracking-[0.18em] text-white/80 uppercase">Shop</h4>
						<ul class="space-y-3 text-sm font-light text-white/58">
							<li><a href="/shop" class="transition-colors hover:text-white">All Products</a></li>
							<li>
								<a href="/collections" class="transition-colors hover:text-white">Categories</a>
							</li>
							<li>
								<a href="/search" class="transition-colors hover:text-white">Search Catalog</a>
							</li>
						</ul>
					</div>

					<div class="pt-2">
						<h4 class="mb-5 text-xs font-black tracking-[0.18em] text-white/80 uppercase">
							Support
						</h4>
						<ul class="space-y-3 text-sm font-light text-white/58">
							<li><a href="/contact" class="transition-colors hover:text-white">Contact Us</a></li>
							<li>
								<a href="/faq" class="transition-colors hover:text-white">Shipping & Returns</a>
							</li>
							<li>
								<a href="/size-guide" class="transition-colors hover:text-white">Size Guide</a>
							</li>
							<li>
								<a href="/policies/privacy" class="transition-colors hover:text-white"
									>Privacy Policy</a
								>
							</li>
						</ul>
					</div>

					<div class="rounded-[1.75rem] border border-white/24 bg-white/10 p-6">
						<h4 class="mb-5 text-xs font-black tracking-[0.18em] text-white/80 uppercase">
							Visit & Contact
						</h4>
						<div class="space-y-4 text-sm leading-6 text-white/68">
							<div>
								<span class="block text-[0.68rem] font-black tracking-[0.14em] text-white uppercase"
									>Address</span
								>
								<span>{STORE_ADDRESS}</span>
							</div>
							<div>
								<span class="block text-[0.68rem] font-black tracking-[0.14em] text-white uppercase"
									>Contact</span
								>
								<a
									href={primaryWhatsAppHref}
									target="_blank"
									rel="noreferrer"
									class="inline-flex items-center gap-2 font-semibold text-white/80 transition-colors hover:text-white"
								>
									<span class="inline-flex size-2 rounded-full bg-[#25D366]"></span>
									{SUPPORT_PHONE_DISPLAY}
								</a>
							</div>
						</div>
					</div>
				</div>
				<div
					class="mt-16 flex flex-col items-center justify-between border-t border-gray-800 pt-8 md:flex-row"
				>
					<div class="text-center text-xs text-gray-500 md:text-left">
						<p>&copy; 2026 <AbayizaWordmark class="text-[0.9em]" />. All rights reserved.</p>
					</div>
					<div class="mt-4 flex items-center gap-3 text-gray-500 md:mt-0">
						<a
							href="https://www.tiktok.com/@_abayiza_"
							target="_blank"
							rel="noreferrer"
							class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:border-white/30 hover:bg-white/12"
							aria-label="Shahzad Abaya's TikTok"
						>
							<svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
								<path
									d="M16.6 2.1c.3 2.5 1.7 4 4.2 4.2v4.1c-1.5.1-2.8-.3-4.1-1.1v6.1c0 4.5-4.9 7.3-8.8 5-3.7-2.2-3.6-7.7.2-9.8 1.2-.7 2.4-.9 3.8-.7v4.2c-.3-.1-.6-.1-.9-.1-1.9 0-3 2.1-2 3.7.9 1.5 3.3 1.3 4-.3.2-.4.2-.9.2-1.4V2.1h3.4z"
								/>
							</svg>
						</a>
						<a
							href={primaryWhatsAppHref}
							target="_blank"
							rel="noreferrer"
							class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:border-[#25D366]/50 hover:bg-[#25D366]"
							aria-label="Shahzad Abaya's WhatsApp"
						>
							<svg class="h-5 w-5" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
								<path
									d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.066 7.926a7.9 7.9 0 0 0 1.057 3.965L0 16l4.204-1.103a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.928-7.93a7.9 7.9 0 0 0-2.325-5.606M7.998 14.524a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.002 3.628-2.959 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.331.065-.133.034-.247-.015-.346-.05-.099-.445-1.076-.612-1.47-.16-.39-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.397 2.132 3.383 2.992.473.205.842.327 1.13.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"
								/>
							</svg>
						</a>
					</div>
				</div>
				<div
					class="mt-8 flex items-center justify-center gap-2 border-t border-gray-800 pt-7 text-center"
				>
					<span class="text-xs font-bold tracking-[0.14em] text-white/45 uppercase">
						Developed by
					</span>
					<a
						href="https://voquarn.com"
						target="_blank"
						rel="noreferrer"
						class="inline-flex items-center gap-2 text-sm font-black tracking-[0.16em] text-white uppercase transition-colors hover:text-[#c8ff46] sm:text-base"
					>
						<img
							src="/final%20logo%20bhai%20shb.webp"
							alt=""
							class="h-6 w-6 rounded-full object-cover ring-1 ring-white/20"
							loading="lazy"
						/>
						<span>Voquarn Code</span>
					</a>
				</div>
			</div>
		</footer>
	{/if}
</div>

<style>
	.brand-adaptive-text {
		color: #0a0a0a;
		text-shadow:
			0 1px 8px rgba(255, 255, 255, 0.94),
			0 2px 16px rgba(255, 255, 255, 0.62),
			0 1px 10px rgba(20, 53, 45, 0.2);
	}

	.announcement-strap {
		position: relative;
	}

	.announcement-strap__marquee {
		display: flex;
		width: max-content;
		align-items: center;
		will-change: transform;
		animation: announcement-strap-slide 36s linear infinite;
	}

	.announcement-strap__track {
		display: flex;
		flex: 0 0 auto;
		align-items: center;
		gap: 2rem;
		padding: 0.6rem 1.1rem;
		font-size: 0.64rem;
		font-weight: 800;
		letter-spacing: 0.14em;
		line-height: 1;
		text-transform: uppercase;
		white-space: nowrap;
	}

	.announcement-strap__track span {
		display: inline-flex;
		align-items: center;
		gap: 0.65rem;
		color: rgba(255, 255, 255, 0.92);
	}

	.announcement-strap__dot {
		display: inline-block;
		width: 0.34rem;
		height: 0.34rem;
		flex: 0 0 auto;
		border-radius: 9999px;
		background: #c5a880;
		box-shadow: 0 0 0 0.16rem rgba(197, 168, 128, 0.18);
	}

	.route-loading-pill {
		animation: route-loading-needle 1400ms cubic-bezier(0.65, 0, 0.35, 1) infinite both;
		transform-box: fill-box;
		transform-origin: center;
	}

	@keyframes route-loading-needle {
		0% {
			opacity: 0.78;
			transform: scale(0.94);
		}
		50% {
			opacity: 1;
			transform: scale(1.08);
		}
		100% {
			opacity: 0.78;
			transform: scale(0.94);
		}
	}

	@keyframes announcement-strap-slide {
		0% {
			transform: translate3d(0, 0, 0);
		}
		100% {
			transform: translate3d(-50%, 0, 0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.announcement-strap__marquee,
		.route-loading-pill {
			animation: none;
		}
	}

	.announcement-strap {
		max-height: 3rem;
		transition:
			max-height 0.35s ease,
			opacity 0.3s ease,
			padding 0.35s ease;
	}

	.announcement-strap.is-hidden {
		max-height: 0;
		opacity: 0;
		pointer-events: none;
	}

	@media (max-width: 640px) {
		.announcement-strap__track {
			gap: 1.15rem;
			padding: 0.5rem 0.8rem;
			font-size: 0.56rem;
			letter-spacing: 0.12em;
		}
	}
</style>
