<script lang="ts">
	let { data, form } = $props();
	let reviewPhotos = $derived((data.reviewPhotos || []) as Array<any>);
</script>

<svelte:head>
	<title>Review Photos | Abayiza Admin</title>
</svelte:head>

<div class="mx-auto max-w-7xl pb-12">
	<div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<p class="text-xs font-bold tracking-[0.22em] text-blue-600 uppercase">Storefront</p>
			<h1 class="mt-1 text-2xl font-bold text-[#000]">Review Photos</h1>
			<p class="mt-2 max-w-2xl text-sm font-medium text-[#000]/55">
				Upload customer review screenshots or photos. Visible photos will animate on the homepage.
			</p>
		</div>
		<a
			href="/"
			class="inline-flex items-center justify-center rounded-md border border-[#000]/15 bg-white px-4 py-2 text-sm font-semibold text-[#000] shadow-sm transition-colors hover:bg-yellow-50"
		>
			View Storefront
		</a>
	</div>

	<div class="grid grid-cols-1 gap-6 xl:grid-cols-[24rem_1fr]">
		<form
			method="POST"
			action="?/upload"
			enctype="multipart/form-data"
			class="rounded-lg border border-[#000]/10 bg-white p-5 shadow-sm"
		>
			<div class="mb-5 flex items-center gap-3">
				<div class="flex h-10 w-10 items-center justify-center rounded-md bg-blue-50 text-blue-600">
					<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 16l4-4 4 4m-4-4v9M20 12l-4-4-4 4m4-4v13"
						/>
					</svg>
				</div>
				<h2 class="text-lg font-semibold text-[#000]">Upload Photos</h2>
			</div>

			{#if form?.error}
				<div class="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
					{form.error}
				</div>
			{/if}

			<label for="review-images" class="mb-2 block text-sm font-medium text-[#000]/70">
				Review images
			</label>
			<input
				id="review-images"
				name="images"
				type="file"
				accept="image/*"
				multiple
				required
				class="block w-full rounded-md border border-[#000]/15 bg-white px-3 py-2 text-sm text-[#000] shadow-sm file:mr-3 file:rounded-md file:border-0 file:bg-[#000] file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
			/>
			<p class="mt-3 text-xs leading-5 text-[#000]/45">
				JPG, PNG, WEBP, GIF, or AVIF. You can select multiple images at once.
			</p>

			<button
				type="submit"
				class="mt-5 inline-flex w-full items-center justify-center rounded-md bg-[#000] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#222]"
			>
				Upload Review Photos
			</button>
		</form>

		<section class="rounded-lg border border-[#000]/10 bg-white shadow-sm">
			<div class="flex items-center justify-between border-b border-[#000]/10 px-5 py-4">
				<h2 class="text-lg font-semibold text-[#000]">Uploaded Photos</h2>
				<span class="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-900">
					{reviewPhotos.length} Total
				</span>
			</div>

			{#if reviewPhotos.length}
				<div class="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
					{#each reviewPhotos as photo}
						<article class="overflow-hidden rounded-lg border border-[#000]/10 bg-white shadow-sm">
							<div class="aspect-[4/5] bg-gray-100">
								<img
									src={photo.url}
									alt="Customer review"
									class="h-full w-full object-cover object-center"
								/>
							</div>
							<div class="space-y-3 p-4">
								<div class="flex items-center justify-between gap-3">
									<span
										class={`rounded-full px-2.5 py-1 text-xs font-bold ${photo.isVisible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}
									>
										{photo.isVisible ? 'Visible' : 'Hidden'}
									</span>
									<p class="text-xs font-semibold text-[#000]/45">
										Order #{photo.displayOrder + 1}
									</p>
								</div>

								<div class="flex flex-wrap gap-2">
									<form method="POST" action="?/toggle">
										<input type="hidden" name="id" value={photo.id} />
										<input type="hidden" name="isVisible" value={String(!photo.isVisible)} />
										<button
											type="submit"
											class="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-100"
										>
											{photo.isVisible ? 'Hide' : 'Show'}
										</button>
									</form>
									<form
										method="POST"
										action="?/delete"
										onsubmit={(event) => {
											if (!confirm('Delete this review photo?')) event.preventDefault();
										}}
									>
										<input type="hidden" name="id" value={photo.id} />
										<button
											type="submit"
											class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100"
										>
											Delete
										</button>
									</form>
								</div>
							</div>
						</article>
					{/each}
				</div>
			{:else}
				<div class="px-5 py-14 text-center">
					<p class="text-sm font-medium text-[#000]/55">No review photos uploaded yet.</p>
				</div>
			{/if}
		</section>
	</div>
</div>
