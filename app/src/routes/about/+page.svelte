<script lang="ts">
	import AbayizaWordmark from '$lib/components/AbayizaWordmark.svelte';
	import { page } from '$app/state';
	import { absoluteUrl, jsonLdScript } from '$lib/shared/seo';

	const aboutBrandName = 'Shahzad Abayas';
	const aboutDescription =
		'Since 2006, Shahzad Abayas has grown from a small family shop into a trusted abaya brand with two branches in Attock City and customers online.';
	const aboutJsonLd = $derived(
		jsonLdScript([
			{
				'@context': 'https://schema.org',
				'@type': 'AboutPage',
				name: `About ${aboutBrandName} | Our Story`,
				description: aboutDescription,
				url: absoluteUrl('/about', page.url.origin)
			},
			{
				'@context': 'https://schema.org',
				'@type': 'Organization',
				name: aboutBrandName,
				foundingDate: '2006',
				foundingLocation: {
					'@type': 'Place',
					name: 'Attock City, Pakistan'
				},
				slogan: 'Started with a Dream, Growing with Trust'
			}
		])
	);
</script>

<svelte:head>
	<title>About Shahzad Abayas | Our Story Since 2006</title>
	<meta name="description" content={aboutDescription} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={`About ${aboutBrandName} | Our Story Since 2006`} />
	<meta property="og:description" content={aboutDescription} />
	<meta name="twitter:title" content={`About ${aboutBrandName} | Our Story Since 2006`} />
	<meta name="twitter:description" content={aboutDescription} />
	{@html aboutJsonLd}
</svelte:head>

<section
	class="relative isolate -mt-[4.25rem] overflow-hidden bg-[#0a0a0a] text-white md:-mt-[4.75rem]"
>
	<img
		src="/hero/custom-hero.webp"
		alt="Shahzad Abayas editorial collection"
		width="1600"
		height="753"
		decoding="async"
		class="absolute inset-0 -z-30 h-full w-full object-cover object-center"
		fetchpriority="high"
	/>
	<div class="absolute inset-0 -z-20 bg-[#10261f]/60"></div>
	<div
		class="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-white via-white/20 to-transparent"
	></div>

	<div
		class="mx-auto flex min-h-[min(680px,82svh)] max-w-7xl items-end px-4 pt-28 pb-10 sm:px-6 md:pt-32 lg:px-8"
	>
		<div class="max-w-3xl">
			<p class="mb-4 text-xs font-black tracking-[0.22em] text-[#d7c08f] uppercase">
				Our Story · Since 2006
			</p>
			<h1 class="font-serif text-4xl leading-[0.96] uppercase sm:text-6xl md:text-7xl">
				<AbayizaWordmark class="text-white" />
			</h1>
			<p class="mt-6 max-w-2xl text-base leading-7 font-medium text-white/90 sm:text-lg">
				Started with a dream. Growing with trust.
			</p>
			<div class="mt-8 flex flex-wrap gap-3">
				<a
					href="/shop"
					class="inline-flex min-h-12 items-center justify-center rounded-full bg-[#c8ff46] px-6 text-sm font-black text-[#0a0a0a] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
				>
					Shop Abayas
				</a>
				<a
					href="/contact"
					class="inline-flex min-h-12 items-center justify-center rounded-full border border-white/42 bg-white/12 px-6 text-sm font-black text-white backdrop-blur-md transition-colors hover:bg-white hover:text-[#0a0a0a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
				>
					Talk to Us
				</a>
			</div>
		</div>
	</div>
</section>

<section class="bg-white px-4 py-16 text-[#0a0a0a] sm:px-6 sm:py-20 lg:px-8 lg:py-24">
	<div class="mx-auto max-w-5xl">
		<div class="grid gap-10 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-16">
			<div>
				<p class="mb-4 text-xs font-black tracking-[0.2em] text-[#a8895f] uppercase">
					From a Small Shop to a Growing Brand
				</p>
				<h2 class="max-w-3xl font-serif text-3xl leading-tight uppercase sm:text-5xl">
					A family journey built on hard work, patience, and a dream.
				</h2>

				<div class="mt-8 space-y-6 text-base leading-8 font-medium text-[#52524f] sm:text-lg">
					<p>
						Every successful business has a story behind it—a story of hard work, patience,
						dedication, and a dream. Shahzad Abayas is no different.
					</p>
					<p>
						Our journey began in <strong class="font-black text-[#0a0a0a]">2006</strong>, when my
						beloved father started Shahzad Abayas with nothing more than a small shop and a big
						vision. At that time, we had limited resources, but we had something far more valuable:
						determination, honesty, and the desire to provide quality products to our customers.
					</p>
					<p>
						What started as a small family business gradually became a journey of growth and
						success. With the blessings of Allah Almighty, the love and trust of our customers, and
						the continuous support of our family, we kept moving forward.
					</p>
				</div>
			</div>

			<aside
				class="grid content-start gap-3 sm:grid-cols-2 lg:grid-cols-1"
				aria-label="Our journey"
			>
				<div class="rounded-[1.75rem] bg-[#f3efe6] p-6">
					<p class="font-serif text-4xl leading-none text-[#0f3025]">2006</p>
					<p class="mt-3 text-xs font-black tracking-[0.16em] text-[#766444] uppercase">
						The first small shop
					</p>
				</div>
				<div class="rounded-[1.75rem] bg-[#0f3025] p-6 text-white">
					<p class="font-serif text-4xl leading-none text-[#c8ff46]">2</p>
					<p class="mt-3 text-xs font-black tracking-[0.16em] text-white/75 uppercase">
						Branches in Attock City
					</p>
				</div>
			</aside>
		</div>
	</div>
</section>

<section class="bg-[#f6f3ec] px-4 py-16 text-[#0a0a0a] sm:px-6 sm:py-20 lg:px-8 lg:py-24">
	<div
		class="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.72fr)] lg:gap-20"
	>
		<div>
			<p class="mb-4 text-xs font-black tracking-[0.2em] text-[#a8895f] uppercase">
				Growing with Trust
			</p>
			<h2 class="font-serif text-3xl leading-tight uppercase sm:text-5xl">
				The goal has always remained the same.
			</h2>
		</div>

		<div class="space-y-6 text-base leading-8 font-medium text-[#52524f] sm:text-lg">
			<p>
				Alhamdulillah, today Shahzad Abayas has grown beyond that small beginning. We now have <strong
					class="font-black text-[#0a0a0a]">two branches in Attock City</strong
				>, along with a strong online presence that allows us to serve customers beyond our local
				community.
			</p>
			<p>
				From our very first customer to the countless customers who continue to support us today,
				every order, every visit, and every kind word has been an important part of our journey.
			</p>
			<p>
				Our goal has always remained the same: to provide beautiful, high-quality abayas with
				honesty, dedication, and excellent customer service.
			</p>
		</div>
	</div>
</section>

<section class="bg-[#0f3025] px-4 py-16 text-white sm:px-6 sm:py-20 lg:px-8 lg:py-24">
	<div class="mx-auto max-w-4xl text-center">
		<p class="text-xs font-black tracking-[0.2em] text-[#d7c08f] uppercase">Our Legacy</p>
		<blockquote class="mt-6 font-serif text-3xl leading-tight sm:text-4xl lg:text-5xl">
			“Alhamdulillah for every step, every challenge, every success, and every person who became a
			part of our journey.”
		</blockquote>
		<div class="mx-auto mt-8 h-px w-16 bg-[#c8ff46]"></div>
		<p class="mx-auto mt-8 max-w-2xl text-base leading-8 font-medium text-white/78 sm:text-lg">
			This is not just a business for us—it is our father’s dream, our family’s hard work, and a
			journey we are proud to continue.
		</p>
		<p class="mt-8 font-serif text-2xl text-[#c8ff46] sm:text-3xl">
			And this is only the beginning.
		</p>
		<p class="mt-2 text-base font-bold text-white sm:text-lg">
			InshaAllah, the best is yet to come. 🤍
		</p>
		<a
			href="/shop"
			class="mt-10 inline-flex min-h-12 items-center justify-center rounded-full bg-[#c8ff46] px-7 text-sm font-black text-[#0a0a0a] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
		>
			Discover Our Collection
		</a>
		<p class="mt-10 text-xs font-black tracking-[0.18em] text-white/60 uppercase">
			Shahzad Abayas — Started with a Dream, Growing with Trust
		</p>
	</div>
</section>
