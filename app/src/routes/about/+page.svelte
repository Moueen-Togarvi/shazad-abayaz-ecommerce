<script lang="ts">
	import AbayizaWordmark from '$lib/components/AbayizaWordmark.svelte';
	import { page } from '$app/state';
	import { SITE_NAME, absoluteUrl, jsonLdScript } from '$lib/shared/seo';

	const aboutDescription =
		'The story of Abayiza, started by university friends Chand Baloch and Mubahsir Ali after their first abaya ad video went viral.';
	const aboutJsonLd = $derived(
		jsonLdScript([
			{
				'@context': 'https://schema.org',
				'@type': 'AboutPage',
				name: `About ${SITE_NAME} | Our Story`,
				description: aboutDescription,
				url: absoluteUrl('/about', page.url.origin)
			},
			{
				'@context': 'https://schema.org',
				'@type': 'Organization',
				name: SITE_NAME,
				founder: [
					{
						'@type': 'Person',
						name: 'Chand Baloch'
					},
					{
						'@type': 'Person',
						name: 'Mubahsir Ali'
					}
				]
			}
		])
	);
</script>

<svelte:head>
	<title>About Abayiza | Our Story</title>
	<meta name="description" content={aboutDescription} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={`About ${SITE_NAME} | Our Story`} />
	<meta property="og:description" content={aboutDescription} />
	<meta name="twitter:title" content={`About ${SITE_NAME} | Our Story`} />
	<meta name="twitter:description" content={aboutDescription} />
	{@html aboutJsonLd}
</svelte:head>

<section
	class="relative isolate -mt-[4.25rem] overflow-hidden bg-[#14352d] text-white md:-mt-[4.75rem]"
>
	<img
		src="/ChatGPT%20Image%20May%2025,%202026,%2006_25_51%20PM.png"
		alt="Abayiza abaya editorial"
		width="1670"
		height="941"
		class="absolute inset-0 -z-30 h-full w-full object-cover object-center"
		fetchpriority="high"
	/>
	<div class="absolute inset-0 -z-20 bg-[#10261f]/50"></div>
	<div
		class="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-[#fbf9f2] via-[#fbf9f2]/20 to-transparent"
	></div>

	<div
		class="mx-auto flex min-h-[min(680px,82svh)] max-w-7xl items-end px-4 pt-28 pb-10 sm:px-6 md:pt-32 lg:px-8"
	>
		<div class="max-w-3xl">
			<p class="mb-4 text-xs font-black tracking-[0.22em] text-[#d7c08f] uppercase">Our Story</p>
			<h1 class="font-serif text-4xl leading-[0.96] uppercase sm:text-6xl md:text-7xl">
				<AbayizaWordmark class="text-white" />
			</h1>
			<p class="mt-6 max-w-2xl text-base leading-7 font-medium text-white/86 sm:text-lg">
				Premium abayas for women who want modesty to feel intentional, graceful, and quietly
				luxurious.
			</p>
			<div class="mt-8 flex flex-wrap gap-3">
				<a
					href="/shop"
					class="inline-flex min-h-12 items-center justify-center rounded-full bg-[#c8ff46] px-6 text-sm font-black text-[#14352d] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
				>
					Shop Abayas
				</a>
				<a
					href="/contact"
					class="inline-flex min-h-12 items-center justify-center rounded-full border border-white/42 bg-white/12 px-6 text-sm font-black text-white backdrop-blur-md transition-colors hover:bg-white hover:text-[#14352d] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
				>
					Talk to Us
				</a>
			</div>
		</div>
	</div>
</section>

<section class="bg-[#fbf9f2] px-4 py-16 text-[#14352d] sm:px-6 lg:px-8">
	<div class="mx-auto max-w-4xl">
		<p class="mb-4 text-xs font-black tracking-[0.2em] text-[#b58b2b] uppercase">
			How Abayiza Started
		</p>
		<h2 class="font-serif text-3xl leading-tight uppercase sm:text-5xl">
			From two university friends to a growing abaya brand.
		</h2>

		<div class="mt-8 space-y-6 text-base leading-8 font-medium text-[#596c62] sm:text-lg">
			<p>
				Abayiza started with two friends,
				<strong class="font-black text-[#14352d]">Chand Baloch</strong> and
				<strong class="font-black text-[#14352d]">Mubahsir Ali</strong>. During university, they
				would often talk about their future and plan the kind of business they wanted to build after
				graduation.
			</p>
			<p>
				After graduating, they decided to begin with abayas: a modest fashion idea they believed
				could become something meaningful. They started small, prepared their first pieces, and
				uploaded their first video as an ad.
			</p>
			<p>
				That first video went viral. Orders and attention started coming in, and from that moment
				the brand began to grow. What started as a plan between two university friends became
				<strong class="font-black text-[#14352d]"> Abayiza</strong>.
			</p>
		</div>
	</div>
</section>
