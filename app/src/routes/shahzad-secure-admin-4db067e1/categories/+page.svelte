<script lang="ts">
	let { data, form } = $props();
	let categories = $derived((data.categories || []) as Array<any>);
	let editingId = $state<string | null>(null);

	const productLabel = (count: number) => `${count} Product${count === 1 ? '' : 's'}`;
</script>

<svelte:head>
	<title>Categories | Abayiza Admin</title>
</svelte:head>

<div class="mx-auto max-w-7xl pb-12">
	<div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<p class="text-xs font-bold tracking-[0.22em] text-blue-600 uppercase">Storefront</p>
			<h1 class="mt-1 text-2xl font-bold text-[#000]">Categories</h1>
		</div>
		<a
			href="/collections"
			class="inline-flex items-center justify-center rounded-md border border-[#000]/15 bg-white px-4 py-2 text-sm font-semibold text-[#000] shadow-sm transition-colors hover:bg-yellow-50"
		>
			View Storefront
		</a>
	</div>

	<div class="grid grid-cols-1 gap-6 xl:grid-cols-[24rem_1fr]">
		<form
			method="POST"
			action="?/create"
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
							d="M12 4v16m8-8H4"
						/>
					</svg>
				</div>
				<h2 class="text-lg font-semibold text-[#000]">Add Category</h2>
			</div>

			{#if form?.createError}
				<div class="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
					{form.createError}
				</div>
			{/if}

			<div class="space-y-4">
				<div>
					<label for="new-name" class="mb-1 block text-sm font-medium text-[#000]/70">Name</label>
					<input
						id="new-name"
						name="name"
						type="text"
						required
						placeholder="Daily Wear"
						class="block w-full rounded-md border border-[#000]/15 bg-white px-3 py-2 text-sm text-[#000] shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
					/>
				</div>
				<div>
					<label for="new-image" class="mb-1 block text-sm font-medium text-[#000]/70">Image</label>
					<input
						id="new-image"
						name="image"
						type="file"
						accept="image/*"
						class="block w-full rounded-md border border-[#000]/15 bg-white px-3 py-2 text-sm text-[#000] shadow-sm file:mr-3 file:rounded-md file:border-0 file:bg-[#000] file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
					/>
				</div>

				<label class="flex h-10 items-center gap-2 rounded-md border border-[#000]/10 px-3 text-sm">
					<input
						name="isVisible"
						type="checkbox"
						checked
						class="h-4 w-4 rounded border-[#000]/20 text-[#000] focus:ring-blue-500"
					/>
					<span class="text-[#000]/70">Visible</span>
				</label>

				<button
					type="submit"
					class="inline-flex w-full items-center justify-center rounded-md bg-[#000] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#222]"
				>
					Add Category
				</button>
			</div>
		</form>

		<section class="rounded-lg border border-[#000]/10 bg-white shadow-sm">
			<div class="flex items-center justify-between border-b border-[#000]/10 px-5 py-4">
				<h2 class="text-lg font-semibold text-[#000]">All Categories</h2>
				<span class="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-900">
					{categories.length} Total
				</span>
			</div>

			{#if form?.updateError || form?.deleteError}
				<div
					class="mx-5 mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
				>
					{form.updateError || form.deleteError}
				</div>
			{/if}

			<div class="divide-y divide-[#000]/10">
				{#each categories as category}
					<article class="p-5">
						<div class="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
							<div class="min-w-0">
								<div class="flex gap-4">
									<div
										class="h-16 w-20 shrink-0 overflow-hidden rounded-md border border-[#000]/10 bg-gray-100"
									>
										{#if category.imageUrl}
											<img
												src={category.imageUrl}
												alt={category.name}
												class="h-full w-full object-cover object-center"
											/>
										{:else}
											<div
												class="flex h-full w-full items-center justify-center text-xs text-gray-400"
											>
												No image
											</div>
										{/if}
									</div>
									<div class="min-w-0">
										<div class="flex flex-wrap items-center gap-2">
											<h3 class="text-base font-semibold text-[#000]">{category.name}</h3>
											<span
												class="rounded-full px-2.5 py-0.5 text-xs font-medium {category.isVisible
													? 'bg-blue-100 text-blue-800'
													: 'bg-yellow-100 text-yellow-800'}"
											>
												{category.isVisible ? 'Visible' : 'Hidden'}
											</span>
											<span
												class="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700"
											>
												{productLabel(category._count.products)}
											</span>
										</div>
									</div>
								</div>
							</div>

							<div class="flex flex-wrap gap-2 lg:justify-end">
								<button
									type="button"
									onclick={() => (editingId = editingId === category.id ? null : category.id)}
									class="inline-flex items-center rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-100"
								>
									{editingId === category.id ? 'Close' : 'Edit'}
								</button>
								<form
									method="POST"
									action="?/delete"
									onsubmit={(event) => {
										if (!confirm(`Delete ${category.name}?`)) event.preventDefault();
									}}
								>
									<input type="hidden" name="id" value={category.id} />
									<button
										type="submit"
										class="inline-flex items-center rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100"
									>
										Delete
									</button>
								</form>
							</div>
						</div>

						{#if editingId === category.id}
							<form
								method="POST"
								action="?/update"
								enctype="multipart/form-data"
								class="mt-5 rounded-lg border border-[#000]/10 bg-gray-50 p-4"
							>
								<input type="hidden" name="id" value={category.id} />
								<div class="grid gap-4 md:grid-cols-2">
									<div>
										<label
											for={`name-${category.id}`}
											class="mb-1 block text-sm font-medium text-[#000]/70">Name</label
										>
										<input
											id={`name-${category.id}`}
											name="name"
											type="text"
											value={category.name}
											required
											class="block w-full rounded-md border border-[#000]/15 bg-white px-3 py-2 text-sm text-[#000] shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
										/>
									</div>
									<div>
										<label
											for={`image-${category.id}`}
											class="mb-1 block text-sm font-medium text-[#000]/70">Image</label
										>
										<input
											id={`image-${category.id}`}
											name="image"
											type="file"
											accept="image/*"
											class="block w-full rounded-md border border-[#000]/15 bg-white px-3 py-2 text-sm text-[#000] shadow-sm file:mr-3 file:rounded-md file:border-0 file:bg-[#000] file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
										/>
									</div>
									{#if category.imageUrl}
										<div class="md:col-span-2">
											<div class="mb-3 overflow-hidden rounded-md border border-[#000]/10 bg-white">
												<img
													src={category.imageUrl}
													alt={category.name}
													class="h-36 w-full object-cover object-center"
												/>
											</div>
											<label
												class="flex h-10 items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 text-sm"
											>
												<input
													name="removeImage"
													type="checkbox"
													class="h-4 w-4 rounded border-red-300 text-red-600 focus:ring-red-500"
												/>
												<span class="font-medium text-red-700">Remove current image</span>
											</label>
										</div>
									{/if}
									<label
										class="flex h-10 items-center gap-2 rounded-md border border-[#000]/10 bg-white px-3 text-sm"
									>
										<input
											name="isVisible"
											type="checkbox"
											checked={category.isVisible}
											class="h-4 w-4 rounded border-[#000]/20 text-[#000] focus:ring-blue-500"
										/>
										<span class="text-[#000]/70">Visible</span>
									</label>
								</div>

								<div class="mt-4 flex justify-end gap-2">
									<button
										type="button"
										onclick={() => (editingId = null)}
										class="rounded-md border border-[#000]/15 bg-white px-4 py-2 text-sm font-semibold text-[#000]/70 transition-colors hover:bg-gray-100"
									>
										Cancel
									</button>
									<button
										type="submit"
										class="rounded-md bg-[#000] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#222]"
									>
										Save Category
									</button>
								</div>
							</form>
						{/if}
					</article>
				{/each}

				{#if categories.length === 0}
					<div class="px-5 py-12 text-center">
						<p class="text-sm font-medium text-[#000]/55">No categories yet.</p>
					</div>
				{/if}
			</div>
		</section>
	</div>
</div>
