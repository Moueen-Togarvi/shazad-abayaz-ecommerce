<script lang="ts">
	import { onDestroy } from 'svelte';

	type PendingImage = {
		id: number;
		file: File;
		previewUrl: string;
	};

	let {
		inputId = 'product-image-picker',
		label = 'Add Image',
		emptyText = 'Select images one by one. New images will appear here before saving.'
	} = $props<{
		inputId?: string;
		label?: string;
		emptyText?: string;
	}>();

	let pickerInput: HTMLInputElement;
	let uploadInput: HTMLInputElement;
	let nextImageId = 1;
	let pendingImages = $state<PendingImage[]>([]);

	const syncUploadInput = () => {
		if (!uploadInput) return;
		const transfer = new DataTransfer();
		for (const image of pendingImages) {
			transfer.items.add(image.file);
		}
		uploadInput.files = transfer.files;
	};

	const addPickedImage = () => {
		const file = pickerInput?.files?.[0];
		if (!file) return;

		pendingImages = [
			...pendingImages,
			{
				id: nextImageId++,
				file,
				previewUrl: URL.createObjectURL(file)
			}
		];

		pickerInput.value = '';
		queueMicrotask(syncUploadInput);
	};

	const removePendingImage = (id: number) => {
		const image = pendingImages.find((item) => item.id === id);
		if (image) URL.revokeObjectURL(image.previewUrl);
		pendingImages = pendingImages.filter((item) => item.id !== id);
		queueMicrotask(syncUploadInput);
	};

	onDestroy(() => {
		for (const image of pendingImages) {
			URL.revokeObjectURL(image.previewUrl);
		}
	});
</script>

<div>
	<label for={inputId} class="mb-1 block text-sm font-medium text-gray-700">{label}</label>
	<input
		bind:this={uploadInput}
		name="images"
		type="file"
		accept="image/*"
		multiple
		class="hidden"
	/>
	<input
		id={inputId}
		bind:this={pickerInput}
		type="file"
		accept="image/*"
		class="block w-full rounded-md border border-gray-300 text-sm shadow-sm file:mr-4 file:border-0 file:bg-[#000] file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:bg-gray-800 focus:border-[#000] focus:ring-[#000]"
		onchange={addPickedImage}
	/>

	{#if pendingImages.length}
		<div class="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
			{#each pendingImages as image (image.id)}
				<div class="group relative overflow-hidden rounded-md border border-gray-200 bg-gray-50">
					<div class="aspect-square bg-gray-100">
						<img src={image.previewUrl} alt={image.file.name} class="h-full w-full object-cover" />
					</div>
					<button
						type="button"
						class="absolute top-1.5 right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/75 text-white opacity-90 transition-opacity group-hover:opacity-100 hover:bg-red-600"
						aria-label={`Remove ${image.file.name}`}
						onclick={() => removePendingImage(image.id)}
					>
						<svg
							class="h-4 w-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
					<p
						class="truncate px-2 py-1.5 text-[11px] font-medium text-gray-600"
						title={image.file.name}
					>
						{image.file.name}
					</p>
				</div>
			{/each}
		</div>
	{:else}
		<p class="mt-3 rounded-md border border-dashed border-gray-300 px-3 py-3 text-xs text-gray-500">
			{emptyText}
		</p>
	{/if}
</div>
