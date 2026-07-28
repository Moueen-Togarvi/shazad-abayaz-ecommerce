<script lang="ts">
	import { SITE_NAME } from '$lib/shared/seo';

	const sizeGuideDescription =
		'Use the Abayiza size guide to choose the right abaya length, bust fit, and modest drape before ordering.';
</script>

<svelte:head>
	<title>Size Guide | Abayiza</title>
	<meta name="description" content={sizeGuideDescription} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={`Size Guide | ${SITE_NAME}`} />
	<meta property="og:description" content={sizeGuideDescription} />
	<meta name="twitter:title" content={`Size Guide | ${SITE_NAME}`} />
	<meta name="twitter:description" content={sizeGuideDescription} />
</svelte:head>

<div class="mx-auto max-w-5xl px-4 py-12 sm:px-6 md:py-20 lg:px-8">
	<!-- Header -->
	<div class="mb-14 text-center">
		<h1 class="mb-4 font-serif text-3xl tracking-widest text-black uppercase md:text-4xl">
			Size Guide
		</h1>
		<div class="mx-auto mb-6 h-[1px] w-12 bg-gold"></div>
		<p class="mx-auto max-w-xl leading-relaxed font-light text-gray-500">
			We want your abaya to fit perfectly. Our sizes are based on total body height. If you are
			between sizes, we recommend sizing up for a more relaxed, traditional drape.
		</p>
	</div>

	<!-- How to Measure -->
	<div class="mb-14 border border-gray-200 bg-cream p-8 md:p-12">
		<h2 class="mb-8 text-center font-serif text-xl tracking-widest text-black uppercase">
			How to Measure
		</h2>
		<div class="grid grid-cols-1 gap-8 text-center md:grid-cols-3">
			<div>
				<div
					class="mx-auto mb-4 flex h-12 w-12 items-center justify-center border border-gold text-gold"
				>
					<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.5"
							d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
						/></svg
					>
				</div>
				<h3 class="mb-3 text-sm font-bold tracking-widest uppercase">Height</h3>
				<p class="text-sm leading-relaxed font-light text-gray-500">
					Stand barefoot against a wall. Measure from the floor to the top of your head. This is
					your primary measurement for selecting your abaya size.
				</p>
			</div>
			<div>
				<div
					class="mx-auto mb-4 flex h-12 w-12 items-center justify-center border border-gold text-gold"
				>
					<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.5"
							d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
						/></svg
					>
				</div>
				<h3 class="mb-3 text-sm font-bold tracking-widest uppercase">Bust</h3>
				<p class="text-sm leading-relaxed font-light text-gray-500">
					Measure around the fullest part of your bust, keeping the tape parallel to the floor. Add
					2-4 inches for a comfortable, modest fit.
				</p>
			</div>
			<div>
				<div
					class="mx-auto mb-4 flex h-12 w-12 items-center justify-center border border-gold text-gold"
				>
					<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.5"
							d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
						/></svg
					>
				</div>
				<h3 class="mb-3 text-sm font-bold tracking-widest uppercase">Sleeves</h3>
				<p class="text-sm leading-relaxed font-light text-gray-500">
					Extend your arm straight out. Measure from the centre back of your neck, over the
					shoulder, and down to your wrist. This ensures perfect sleeve length.
				</p>
			</div>
		</div>
	</div>

	<!-- Size Chart Table -->
	<h2 class="mb-6 text-center font-serif text-xl tracking-widest text-black uppercase">
		Standard Size Chart
	</h2>
	<div class="mb-14 overflow-x-auto">
		<table class="w-full border-collapse text-sm">
			<thead>
				<tr class="bg-black text-white">
					<th class="px-6 py-4 text-left text-xs font-medium tracking-widest uppercase"
						>Size Label</th
					>
					<th class="px-6 py-4 text-left text-xs font-medium tracking-widest uppercase"
						>Height (cm)</th
					>
					<th class="px-6 py-4 text-left text-xs font-medium tracking-widest uppercase"
						>Height (ft)</th
					>
					<th class="px-6 py-4 text-left text-xs font-medium tracking-widest uppercase"
						>Bust (cm)</th
					>
					<th class="px-6 py-4 text-left text-xs font-medium tracking-widest uppercase"
						>Abaya Length</th
					>
				</tr>
			</thead>
			<tbody>
				{#each [{ size: 'XS (50)', heightCm: '145–152', heightFt: '4\'9" – 5\'0"', bust: '80–85', length: '137 cm' }, { size: 'S (52)', heightCm: '153–158', heightFt: '5\'0" – 5\'2"', bust: '86–92', length: '141 cm' }, { size: 'M (54)', heightCm: '159–164', heightFt: '5\'2" – 5\'4"', bust: '93–99', length: '145 cm' }, { size: 'L (56)', heightCm: '165–170', heightFt: '5\'5" – 5\'7"', bust: '100–106', length: '149 cm' }, { size: 'XL (58)', heightCm: '171–176', heightFt: '5\'7" – 5\'9"', bust: '107–114', length: '153 cm' }, { size: 'XXL (60)', heightCm: '177–182', heightFt: '5\'9" – 5\'11"', bust: '115–122', length: '157 cm' }] as row, i}
					<tr
						class="{i % 2 === 0
							? 'bg-white'
							: 'bg-gray-50'} border-b border-gray-100 transition-colors hover:bg-cream"
					>
						<td class="px-6 py-4 font-medium text-black">{row.size}</td>
						<td class="px-6 py-4 text-gray-600">{row.heightCm}</td>
						<td class="px-6 py-4 text-gray-600">{row.heightFt}</td>
						<td class="px-6 py-4 text-gray-600">{row.bust}</td>
						<td class="px-6 py-4 text-gray-600">{row.length}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- Custom Sizing -->
	<div class="border-t border-gray-200 pt-12 text-center">
		<h2 class="mb-4 font-serif text-xl tracking-widest text-black uppercase">
			Need Custom Sizing?
		</h2>
		<p class="mx-auto mb-8 max-w-lg leading-relaxed font-light text-gray-500">
			We offer bespoke tailoring on select styles for an additional fee. Reach out to us via
			WhatsApp with your measurements and the style you love, and we'll create your perfect piece.
		</p>
		<div class="flex flex-col justify-center gap-4 sm:flex-row">
			<a
				href="/contact"
				class="border border-black px-8 py-3 text-sm tracking-widest text-black uppercase transition-colors hover:bg-gray-50"
				>Contact Us</a
			>
			<a
				href="https://wa.me/923116857822"
				target="_blank"
				rel="noreferrer"
				class="flex items-center justify-center gap-2 bg-[#25D366] px-8 py-3 text-sm tracking-widest text-white uppercase transition-opacity hover:opacity-90"
			>
				<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"
					><path
						d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
					/></svg
				>
				Custom Order on WhatsApp
			</a>
			<a
				href="https://wa.me/923346657779"
				target="_blank"
				rel="noreferrer"
				class="border border-[#25D366] px-8 py-3 text-sm tracking-widest text-green-700 uppercase transition-colors hover:bg-green-50"
			>
				WhatsApp 2
			</a>
		</div>
	</div>
</div>
