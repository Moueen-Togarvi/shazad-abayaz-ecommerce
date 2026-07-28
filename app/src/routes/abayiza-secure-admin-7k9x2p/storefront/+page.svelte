<script lang="ts">
	import { formatMoney } from '$lib/shared/money';

	let { data, form } = $props();
	let products = $derived((data.products || []) as Array<any>);
	let sections = $derived((data.sections || []) as Array<any>);
	let saleTapeItems = $derived((form?.saleTapeItems ?? data.saleTapeItems ?? '') as string);
	let heroHeadlinePhrases = $derived(
		(form?.hero_headline_phrases ?? storefrontSettings.hero_headline_phrases ?? '') as string
	);
	let storefrontSettings = $derived(data.storefrontSettings || {});
	let saleTapePreview = $derived(
		saleTapeItems
			.split(/\r?\n/)
			.map((item) => item.trim())
			.filter(Boolean)
	);
	let selections = $state<Record<string, string[]>>({});
	let searches = $state<Record<string, string>>({});
	let initialized = $state(false);

	let productMap = $derived(new Map(products.map((product) => [product.id, product])));

	$effect(() => {
		if (initialized || !sections.length) return;

		selections = Object.fromEntries(
			sections.map((section) => [section.key, section.products.map((product: any) => product.id)])
		);
		searches = Object.fromEntries(sections.map((section) => [section.key, '']));
		initialized = true;
	});

	function productImage(product: any) {
		return product.images?.[0]?.url || '/image.png';
	}

	function selectedIds(sectionKey: string) {
		return selections[sectionKey] ?? [];
	}

	function selectedProducts(sectionKey: string) {
		return selectedIds(sectionKey)
			.map((id) => productMap.get(id))
			.filter(Boolean);
	}

	function updateSelection(sectionKey: string, productIds: string[]) {
		selections = {
			...selections,
			[sectionKey]: productIds
		};
	}

	function addProduct(sectionKey: string, productId: string) {
		const ids = selectedIds(sectionKey);
		if (ids.includes(productId)) return;
		updateSelection(sectionKey, [...ids, productId]);
	}

	function removeProduct(sectionKey: string, productId: string) {
		updateSelection(
			sectionKey,
			selectedIds(sectionKey).filter((id) => id !== productId)
		);
	}

	function moveProduct(sectionKey: string, productId: string, offset: number) {
		const ids = [...selectedIds(sectionKey)];
		const index = ids.indexOf(productId);
		const nextIndex = index + offset;

		if (index < 0 || nextIndex < 0 || nextIndex >= ids.length) return;

		[ids[index], ids[nextIndex]] = [ids[nextIndex], ids[index]];
		updateSelection(sectionKey, ids);
	}

	function updateSearch(sectionKey: string, event: Event) {
		searches = {
			...searches,
			[sectionKey]: (event.currentTarget as HTMLInputElement).value
		};
	}

	function availableProducts(sectionKey: string) {
		const query = (searches[sectionKey] || '').trim().toLowerCase();
		const selected = new Set(selectedIds(sectionKey));

		return products
			.filter((product) => {
				if (selected.has(product.id)) return false;
				if (!query) return true;

				return [
					product.name,
					product.slug,
					product.description,
					...(product.collections || []).map((collection: any) => collection.name)
				]
					.filter(Boolean)
					.some((value) => String(value).toLowerCase().includes(query));
			})
			.slice(0, 8);
	}
</script>

<svelte:head>
	<title>Storefront Sections | Abayiza Admin</title>
</svelte:head>

<div class="mx-auto max-w-7xl pb-12">
	<div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<p class="text-xs font-bold tracking-[0.22em] text-blue-600 uppercase">Online Store</p>
			<h1 class="mt-1 text-2xl font-bold text-gray-950">Homepage Sections</h1>
			<p class="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
				Choose which active abayas appear in each homepage section. Empty sections use automatic
				fallback products on the public site.
			</p>
		</div>
		<div class="flex flex-wrap gap-2">
			<a
				href="/"
				class="inline-flex min-h-10 items-center justify-center rounded-md border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
			>
				Preview Home
			</a>
			<a
				href="/shop"
				class="inline-flex min-h-10 items-center justify-center rounded-md bg-black px-4 text-sm font-semibold text-white shadow-sm hover:bg-gray-800"
			>
				View Shop
			</a>
		</div>
	</div>

	{#if form?.error}
		<div class="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
			{form.error}
		</div>
	{/if}

	<div class="space-y-6">
		<!-- Hero Typewriter Phrases Form -->
		<form
			method="POST"
			action="?/saveHero"
			class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
		>
			<div
				class="flex flex-col gap-4 border-b border-gray-200 bg-gray-50 px-5 py-4 lg:flex-row lg:items-center lg:justify-between"
			>
				<div>
					<p class="text-xs font-black tracking-[0.18em] text-blue-600 uppercase">
						Homepage Hero
					</p>
					<h2 class="mt-1 text-xl font-black text-gray-950">Typewriter Phrases</h2>
					<p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
						Edit the rotating typewriter words in the main hero headline. Add one phrase per line.
					</p>
				</div>
				<button
					type="submit"
					class="inline-flex min-h-10 items-center justify-center rounded-md bg-black px-5 text-sm font-bold text-white shadow-sm hover:bg-gray-800"
				>
					Save Typewriter Phrases
				</button>
			</div>

			<div class="grid gap-5 p-5 lg:grid-cols-[1fr_24rem]">
				<div>
					<label
						for="heroHeadlinePhrases"
						class="mb-2 block text-sm font-black tracking-[0.12em] text-gray-900 uppercase"
					>
						Phrases (one per line)
					</label>
					<textarea
						id="heroHeadlinePhrases"
						name="hero_headline_phrases"
						rows="5"
						class="w-full rounded-md border-gray-300 text-sm focus:border-black focus:ring-black"
						>{heroHeadlinePhrases}</textarea
					>
				</div>

				<div class="rounded-xl border border-gray-200 bg-[#f7f4ec] p-4">
					<p class="mb-3 text-xs font-black tracking-[0.14em] text-gray-700 uppercase">
						Current Phrases
					</p>
					<div class="flex flex-wrap gap-2">
						{#each heroHeadlinePhrases.split(/\r?\n/).map(item => item.trim()).filter(Boolean) as phrase}
							<span
								class="rounded-full bg-[#14352d] px-3 py-1.5 text-xs font-black tracking-[0.12em] text-[#e4b43d] uppercase"
							>
								{phrase}
							</span>
						{/each}
					</div>
				</div>
			</div>
		</form>

		<form
			method="POST"
			action="?/saveSaleTape"
			class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
		>
			<div
				class="flex flex-col gap-4 border-b border-gray-200 bg-gray-50 px-5 py-4 lg:flex-row lg:items-center lg:justify-between"
			>
				<div>
					<p class="text-xs font-black tracking-[0.18em] text-blue-600 uppercase">
						Homepage ticker
					</p>
					<h2 class="mt-1 text-xl font-black text-gray-950">Sale Tape Text</h2>
					<p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
						Edit the moving yellow strip under the hero. Add one text item per line.
					</p>
				</div>
				<button
					type="submit"
					class="inline-flex min-h-10 items-center justify-center rounded-md bg-black px-5 text-sm font-bold text-white shadow-sm hover:bg-gray-800"
				>
					Save Tape Text
				</button>
			</div>

			<div class="grid gap-5 p-5 lg:grid-cols-[1fr_24rem]">
				<div>
					<label
						for="saleTapeItems"
						class="mb-2 block text-sm font-black tracking-[0.12em] text-gray-900 uppercase"
					>
						Tape items
					</label>
					<textarea
						id="saleTapeItems"
						name="saleTapeItems"
						rows="5"
						class="w-full rounded-md border-gray-300 text-sm focus:border-black focus:ring-black"
						>{saleTapeItems}</textarea
					>
				</div>

				<div class="rounded-xl border border-gray-200 bg-[#f7f4ec] p-4">
					<p class="mb-3 text-xs font-black tracking-[0.14em] text-gray-700 uppercase">
						Current preview
					</p>
					<div class="flex flex-wrap gap-2">
						{#each saleTapePreview as item}
							<span
								class="rounded-full bg-[#e4b43d] px-3 py-1.5 text-xs font-black tracking-[0.12em] text-[#14352d] uppercase"
							>
								{item}
							</span>
						{/each}
					</div>
				</div>
			</div>
		</form>

		<!-- Banner Customization Form -->
		<form
			method="POST"
			action="?/saveBanners"
			enctype="multipart/form-data"
			class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
		>
			<div
				class="flex flex-col gap-4 border-b border-gray-200 bg-gray-50 px-5 py-4 lg:flex-row lg:items-center lg:justify-between"
			>
				<div>
					<p class="text-xs font-black tracking-[0.18em] text-blue-600 uppercase">
						Promotions & Sliders
					</p>
					<h2 class="mt-1 text-xl font-black text-gray-950">
						Banner Sliders & Flash Sale Settings
					</h2>
					<p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
						Edit slide content, model images, countdown timers, and discount tags for the homepage.
					</p>
				</div>
				<button
					type="submit"
					class="inline-flex min-h-10 items-center justify-center rounded-md bg-black px-5 text-sm font-bold text-white shadow-sm hover:bg-gray-800"
				>
					Save Banner Configurations
				</button>
			</div>

			<div class="space-y-8 p-5">
				<!-- Sliding Banners Block -->
				<div>
					<h3
						class="border-gray-150 mb-4 border-b pb-2 text-sm font-black tracking-[0.14em] text-gray-900 uppercase"
					>
						Homepage Hero Sliding Banners (Nida, Occasion, Eid Signature)
					</h3>

					<div class="grid gap-6 md:grid-cols-3">
						<!-- Slide 1 -->
						<div class="space-y-3 rounded-xl border border-gray-200 bg-gray-50/50 p-4">
							<span
								class="inline-flex items-center rounded-md bg-[#14352d]/10 px-2 py-1 text-xs font-bold text-[#14352d]"
							>
								Slide 1: Nida Essentials
							</span>

							<div>
								<label class="mb-1 block text-xs font-bold text-gray-700 uppercase">Title</label>
								<input
									type="text"
									name="slide1_title"
									value={storefrontSettings.slide1_title || ''}
									class="w-full rounded-md border-gray-300 text-sm focus:border-black focus:ring-black"
								/>
							</div>

							<div>
								<label class="mb-1 block text-xs font-bold text-gray-700 uppercase">Tagline</label>
								<input
									type="text"
									name="slide1_tagline"
									value={storefrontSettings.slide1_tagline || ''}
									class="w-full rounded-md border-gray-300 text-sm focus:border-black focus:ring-black"
								/>
							</div>

							<div>
								<label class="mb-1 block text-xs font-bold text-gray-700 uppercase"
									>Description</label
								>
								<textarea
									name="slide1_description"
									rows="3"
									class="w-full rounded-md border-gray-300 text-sm focus:border-black focus:ring-black"
									>{storefrontSettings.slide1_description || ''}</textarea
								>
							</div>

							<div>
								<label class="mb-1 block text-xs font-bold text-gray-700 uppercase">Promo Tag</label
								>
								<input
									type="text"
									name="slide1_promo"
									value={storefrontSettings.slide1_promo || ''}
									class="w-full rounded-md border-gray-300 text-sm focus:border-black focus:ring-black"
								/>
							</div>

							<div>
								<label class="mb-1 block text-xs font-bold text-gray-700 uppercase">Link URL</label>
								<input
									type="text"
									name="slide1_link"
									value={storefrontSettings.slide1_link || ''}
									class="w-full rounded-md border-gray-300 text-sm focus:border-black focus:ring-black"
								/>
							</div>

							<div class="space-y-2">
								<label class="block text-xs font-bold text-gray-700 uppercase">Slide Image</label>
								{#if storefrontSettings.slide1_image}
									<div
										class="relative mb-1 h-24 w-full overflow-hidden rounded-md border border-gray-200 bg-gray-100"
									>
										<img
											src={storefrontSettings.slide1_image}
											alt="Slide 1 Preview"
											class="h-full w-full object-contain"
										/>
									</div>
									<label
										class="mb-2 flex cursor-pointer items-center gap-2 rounded-md border border-red-200 bg-red-50 p-2 text-xs"
									>
										<input
											name="remove_slide1_image"
											type="checkbox"
											class="h-3.5 w-3.5 rounded border-red-300 text-red-600 focus:ring-red-500"
										/>
										<span class="font-medium text-red-700">Remove current image</span>
									</label>
								{/if}
								<input
									type="hidden"
									name="slide1_image"
									value={storefrontSettings.slide1_image || ''}
								/>
								<input
									type="file"
									name="slide1_image_file"
									accept="image/*"
									class="w-full text-xs text-gray-500 file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
								/>
							</div>
						</div>

						<!-- Slide 2 -->
						<div class="space-y-3 rounded-xl border border-gray-200 bg-gray-50/50 p-4">
							<span
								class="inline-flex items-center rounded-md bg-[#e4b43d]/15 px-2 py-1 text-xs font-bold text-[#b58b2b]"
							>
								Slide 2: Occasion Wear
							</span>

							<div>
								<label class="mb-1 block text-xs font-bold text-gray-700 uppercase">Title</label>
								<input
									type="text"
									name="slide2_title"
									value={storefrontSettings.slide2_title || ''}
									class="w-full rounded-md border-gray-300 text-sm focus:border-black focus:ring-black"
								/>
							</div>

							<div>
								<label class="mb-1 block text-xs font-bold text-gray-700 uppercase">Tagline</label>
								<input
									type="text"
									name="slide2_tagline"
									value={storefrontSettings.slide2_tagline || ''}
									class="w-full rounded-md border-gray-300 text-sm focus:border-black focus:ring-black"
								/>
							</div>

							<div>
								<label class="mb-1 block text-xs font-bold text-gray-700 uppercase"
									>Description</label
								>
								<textarea
									name="slide2_description"
									rows="3"
									class="w-full rounded-md border-gray-300 text-sm focus:border-black focus:ring-black"
									>{storefrontSettings.slide2_description || ''}</textarea
								>
							</div>

							<div>
								<label class="mb-1 block text-xs font-bold text-gray-700 uppercase">Promo Tag</label
								>
								<input
									type="text"
									name="slide2_promo"
									value={storefrontSettings.slide2_promo || ''}
									class="w-full rounded-md border-gray-300 text-sm focus:border-black focus:ring-black"
								/>
							</div>

							<div>
								<label class="mb-1 block text-xs font-bold text-gray-700 uppercase">Link URL</label>
								<input
									type="text"
									name="slide2_link"
									value={storefrontSettings.slide2_link || ''}
									class="w-full rounded-md border-gray-300 text-sm focus:border-black focus:ring-black"
								/>
							</div>

							<div class="space-y-2">
								<label class="block text-xs font-bold text-gray-700 uppercase">Slide Image</label>
								{#if storefrontSettings.slide2_image}
									<div
										class="relative mb-1 h-24 w-full overflow-hidden rounded-md border border-gray-200 bg-gray-100"
									>
										<img
											src={storefrontSettings.slide2_image}
											alt="Slide 2 Preview"
											class="h-full w-full object-contain"
										/>
									</div>
									<label
										class="mb-2 flex cursor-pointer items-center gap-2 rounded-md border border-red-200 bg-red-50 p-2 text-xs"
									>
										<input
											name="remove_slide2_image"
											type="checkbox"
											class="h-3.5 w-3.5 rounded border-red-300 text-red-600 focus:ring-red-500"
										/>
										<span class="font-medium text-red-700">Remove current image</span>
									</label>
								{/if}
								<input
									type="hidden"
									name="slide2_image"
									value={storefrontSettings.slide2_image || ''}
								/>
								<input
									type="file"
									name="slide2_image_file"
									accept="image/*"
									class="w-full text-xs text-gray-500 file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
								/>
							</div>
						</div>

						<!-- Slide 3 -->
						<div class="space-y-3 rounded-xl border border-gray-200 bg-gray-50/50 p-4">
							<span
								class="inline-flex items-center rounded-md bg-[#14352d]/10 px-2 py-1 text-xs font-bold text-[#14352d]"
							>
								Slide 3: Eid Signature
							</span>

							<div>
								<label class="mb-1 block text-xs font-bold text-gray-700 uppercase">Title</label>
								<input
									type="text"
									name="slide3_title"
									value={storefrontSettings.slide3_title || ''}
									class="w-full rounded-md border-gray-300 text-sm focus:border-black focus:ring-black"
								/>
							</div>

							<div>
								<label class="mb-1 block text-xs font-bold text-gray-700 uppercase">Tagline</label>
								<input
									type="text"
									name="slide3_tagline"
									value={storefrontSettings.slide3_tagline || ''}
									class="w-full rounded-md border-gray-300 text-sm focus:border-black focus:ring-black"
								/>
							</div>

							<div>
								<label class="mb-1 block text-xs font-bold text-gray-700 uppercase"
									>Description</label
								>
								<textarea
									name="slide3_description"
									rows="3"
									class="w-full rounded-md border-gray-300 text-sm focus:border-black focus:ring-black"
									>{storefrontSettings.slide3_description || ''}</textarea
								>
							</div>

							<div>
								<label class="mb-1 block text-xs font-bold text-gray-700 uppercase">Promo Tag</label
								>
								<input
									type="text"
									name="slide3_promo"
									value={storefrontSettings.slide3_promo || ''}
									class="w-full rounded-md border-gray-300 text-sm focus:border-black focus:ring-black"
								/>
							</div>

							<div>
								<label class="mb-1 block text-xs font-bold text-gray-700 uppercase">Link URL</label>
								<input
									type="text"
									name="slide3_link"
									value={storefrontSettings.slide3_link || ''}
									class="w-full rounded-md border-gray-300 text-sm focus:border-black focus:ring-black"
								/>
							</div>

							<div class="space-y-2">
								<label class="block text-xs font-bold text-gray-700 uppercase">Slide Image</label>
								{#if storefrontSettings.slide3_image}
									<div
										class="relative mb-1 h-24 w-full overflow-hidden rounded-md border border-gray-200 bg-gray-100"
									>
										<img
											src={storefrontSettings.slide3_image}
											alt="Slide 3 Preview"
											class="h-full w-full object-contain"
										/>
									</div>
									<label
										class="mb-2 flex cursor-pointer items-center gap-2 rounded-md border border-red-200 bg-red-50 p-2 text-xs"
									>
										<input
											name="remove_slide3_image"
											type="checkbox"
											class="h-3.5 w-3.5 rounded border-red-300 text-red-600 focus:ring-red-500"
										/>
										<span class="font-medium text-red-700">Remove current image</span>
									</label>
								{/if}
								<input
									type="hidden"
									name="slide3_image"
									value={storefrontSettings.slide3_image || ''}
								/>
								<input
									type="file"
									name="slide3_image_file"
									accept="image/*"
									class="w-full text-xs text-gray-500 file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
								/>
							</div>
						</div>
					</div>
				</div>

				<!-- Flash Sale Timer Banner Block -->
				<div>
					<h3
						class="border-gray-150 mb-4 border-b pb-2 text-sm font-black tracking-[0.14em] text-gray-900 uppercase"
					>
						Flash Sale Timer Banner
					</h3>

					<div class="space-y-4 rounded-xl border border-gray-200 bg-gray-50/50 p-5">
						<div class="flex items-center gap-3">
							<input
								id="flash_sale_enabled"
								name="flash_sale_enabled"
								type="checkbox"
								checked={storefrontSettings.flash_sale_enabled === 'true'}
								class="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
							/>
							<label
								for="flash_sale_enabled"
								class="cursor-pointer text-sm font-bold text-gray-900 uppercase"
							>
								Enable Flash Sale Timer Section
							</label>
						</div>

						<div class="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
							<div>
								<label class="mb-1 block text-xs font-bold text-gray-700 uppercase">Title</label>
								<input
									type="text"
									name="flash_sale_title"
									value={storefrontSettings.flash_sale_title || ''}
									class="w-full rounded-md border-gray-300 text-sm focus:border-black focus:ring-black"
								/>
							</div>

							<div>
								<label class="mb-1 block text-xs font-bold text-gray-700 uppercase"
									>Cursive Subtitle</label
								>
								<input
									type="text"
									name="flash_sale_subtitle"
									value={storefrontSettings.flash_sale_subtitle || ''}
									class="w-full rounded-md border-gray-300 text-sm focus:border-black focus:ring-black"
								/>
							</div>

							<div>
								<label class="mb-1 block text-xs font-bold text-gray-700 uppercase"
									>Discount Tagline</label
								>
								<input
									type="text"
									name="flash_sale_description"
									value={storefrontSettings.flash_sale_description || ''}
									class="w-full rounded-md border-gray-300 text-sm focus:border-black focus:ring-black"
								/>
							</div>

							<div class="space-y-2">
								<label class="block text-xs font-bold text-gray-700 uppercase">Model Image</label>
								{#if storefrontSettings.flash_sale_image}
									<div
										class="relative mb-1 h-24 w-full overflow-hidden rounded-md border border-gray-200 bg-gray-100"
									>
										<img
											src={storefrontSettings.flash_sale_image}
											alt="Flash Sale Preview"
											class="h-full w-full object-contain"
										/>
									</div>
									<label
										class="mb-2 flex cursor-pointer items-center gap-2 rounded-md border border-red-200 bg-red-50 p-2 text-xs"
									>
										<input
											name="remove_flash_sale_image"
											type="checkbox"
											class="h-3.5 w-3.5 rounded border-red-300 text-red-600 focus:ring-red-500"
										/>
										<span class="font-medium text-red-700">Remove current image</span>
									</label>
								{/if}
								<input
									type="hidden"
									name="flash_sale_image"
									value={storefrontSettings.flash_sale_image || ''}
								/>
								<input
									type="file"
									name="flash_sale_image_file"
									accept="image/*"
									class="w-full text-xs text-gray-500 file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
								/>
							</div>

							<div>
								<label class="mb-1 block text-xs font-bold text-gray-700 uppercase"
									>CTA Button Text</label
								>
								<input
									type="text"
									name="flash_sale_cta_label"
									value={storefrontSettings.flash_sale_cta_label || ''}
									class="w-full rounded-md border-gray-300 text-sm focus:border-black focus:ring-black"
								/>
							</div>

							<div>
								<label class="mb-1 block text-xs font-bold text-gray-700 uppercase"
									>CTA Button URL</label
								>
								<input
									type="text"
									name="flash_sale_cta_link"
									value={storefrontSettings.flash_sale_cta_link || ''}
									class="w-full rounded-md border-gray-300 text-sm focus:border-black focus:ring-black"
								/>
							</div>
						</div>

						<div class="space-y-3 border-t border-gray-200 pt-4">
							<span class="block text-xs font-bold text-gray-700 uppercase">
								Sale Duration Countdown (Timer value relative to user visit session)
							</span>
							<div class="grid max-w-sm grid-cols-3 gap-4">
								<div>
									<label class="mb-1 block text-[0.65rem] font-bold text-gray-500 uppercase"
										>Hours</label
									>
									<input
										type="number"
										name="flash_sale_hours"
										min="0"
										max="23"
										value={storefrontSettings.flash_sale_hours || '2'}
										class="w-full rounded-md border-gray-300 text-sm focus:border-black focus:ring-black"
									/>
								</div>
								<div>
									<label class="mb-1 block text-[0.65rem] font-bold text-gray-500 uppercase"
										>Minutes</label
									>
									<input
										type="number"
										name="flash_sale_minutes"
										min="0"
										max="59"
										value={storefrontSettings.flash_sale_minutes || '14'}
										class="w-full rounded-md border-gray-300 text-sm focus:border-black focus:ring-black"
									/>
								</div>
								<div>
									<label class="mb-1 block text-[0.65rem] font-bold text-gray-500 uppercase"
										>Seconds</label
									>
									<input
										type="number"
										name="flash_sale_seconds"
										min="0"
										max="59"
										value={storefrontSettings.flash_sale_seconds || '30'}
										class="w-full rounded-md border-gray-300 text-sm focus:border-black focus:ring-black"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</form>

		{#each sections as section}
			<form
				method="POST"
				action="?/saveSection"
				class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
			>
				<input type="hidden" name="sectionKey" value={section.key} />
				<div
					class="flex flex-col gap-4 border-b border-gray-200 bg-gray-50 px-5 py-4 lg:flex-row lg:items-center lg:justify-between"
				>
					<div>
						<p class="text-xs font-black tracking-[0.18em] text-blue-600 uppercase">
							{section.eyebrow}
						</p>
						<h2 class="mt-1 text-xl font-black text-gray-950">{section.title}</h2>
						<p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
							Homepage shows first {section.homepageLimit}; View All opens
							<a href={section.viewAllHref} class="font-semibold text-blue-700 hover:underline">
								{section.viewAllHref}
							</a>
						</p>
					</div>
					<div class="flex items-center gap-2">
						<span class="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-900">
							{selectedIds(section.key).length} selected
						</span>
						<button
							type="submit"
							class="inline-flex min-h-10 items-center justify-center rounded-md bg-black px-5 text-sm font-bold text-white shadow-sm hover:bg-gray-800"
						>
							Save Section
						</button>
					</div>
				</div>

				<div class="grid gap-0 lg:grid-cols-[1fr_22rem]">
					<section class="p-5">
						<div class="mb-4 flex items-center justify-between gap-3">
							<h3 class="text-sm font-black tracking-[0.14em] text-gray-900 uppercase">
								Selected order
							</h3>
							<button
								type="button"
								class="text-xs font-bold text-gray-500 hover:text-red-700"
								onclick={() => updateSelection(section.key, [])}
							>
								Clear all
							</button>
						</div>

						{#each selectedProducts(section.key) as product, index}
							<input type="hidden" name="productIds" value={product.id} />
							<article
								class="mb-3 grid gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:grid-cols-[4rem_1fr_auto] sm:items-center"
							>
								<div class="aspect-[4/5] overflow-hidden rounded-md bg-gray-100">
									<img
										src={productImage(product)}
										alt={product.name}
										class="h-full w-full object-cover object-top"
									/>
								</div>
								<div class="min-w-0">
									<div class="flex flex-wrap items-center gap-2">
										<span
											class="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-gray-900 px-2 text-xs font-black text-white"
										>
											{index + 1}
										</span>
										<h4 class="truncate text-sm font-black text-gray-950">{product.name}</h4>
									</div>
									<p class="mt-1 truncate text-xs font-semibold text-gray-500">
										{product.collections?.map((collection: any) => collection.name).join(', ') ||
											'No category'}
									</p>
									<p class="mt-1 text-xs font-bold text-gray-900">
										{formatMoney(product.salePrice || product.price)}
									</p>
								</div>
								<div class="flex flex-wrap gap-2 sm:justify-end">
									<button
										type="button"
										disabled={index === 0}
										class="rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
										onclick={() => moveProduct(section.key, product.id, -1)}
									>
										Up
									</button>
									<button
										type="button"
										disabled={index === selectedIds(section.key).length - 1}
										class="rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
										onclick={() => moveProduct(section.key, product.id, 1)}
									>
										Down
									</button>
									<button
										type="button"
										class="rounded-md border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-bold text-red-700 hover:bg-red-100"
										onclick={() => removeProduct(section.key, product.id)}
									>
										Remove
									</button>
								</div>
							</article>
						{/each}

						{#if selectedIds(section.key).length === 0}
							<div
								class="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-10 text-center"
							>
								<p class="text-sm font-semibold text-gray-500">
									No manual selection. Public homepage will use automatic fallback products.
								</p>
							</div>
						{/if}
					</section>

					<aside class="border-t border-gray-200 bg-gray-50 p-5 lg:border-t-0 lg:border-l">
						<label
							for={`search-${section.key}`}
							class="mb-2 block text-sm font-black tracking-[0.12em] text-gray-900 uppercase"
						>
							Add active abayas
						</label>
						<input
							id={`search-${section.key}`}
							type="search"
							value={searches[section.key] || ''}
							placeholder="Search products"
							class="mb-4 w-full rounded-md border-gray-300 text-sm focus:border-black focus:ring-black"
							oninput={(event) => updateSearch(section.key, event)}
						/>

						<div class="max-h-[26rem] space-y-2 overflow-y-auto pr-1">
							{#each availableProducts(section.key) as product}
								<article
									class="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-2"
								>
									<div class="h-12 w-10 shrink-0 overflow-hidden rounded bg-gray-100">
										<img
											src={productImage(product)}
											alt={product.name}
											class="h-full w-full object-cover object-top"
										/>
									</div>
									<div class="min-w-0 flex-1">
										<p class="truncate text-sm font-bold text-gray-950">{product.name}</p>
										<p class="truncate text-xs font-medium text-gray-500">
											{product.collections?.map((collection: any) => collection.name).join(', ') ||
												'No category'}
										</p>
									</div>
									<button
										type="button"
										class="rounded-md bg-blue-50 px-3 py-1.5 text-xs font-black text-blue-700 hover:bg-blue-100"
										onclick={() => addProduct(section.key, product.id)}
									>
										Add
									</button>
								</article>
							{/each}

							{#if availableProducts(section.key).length === 0}
								<p
									class="rounded-lg border border-gray-200 bg-white px-3 py-4 text-center text-sm font-semibold text-gray-500"
								>
									No matching active products.
								</p>
							{/if}
						</div>
					</aside>
				</div>
			</form>
		{/each}
	</div>
</div>
