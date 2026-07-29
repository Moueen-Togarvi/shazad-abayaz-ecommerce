<script lang="ts">
	let { collections = [] } = $props<{ collections: any[] }>();

	let needsMarquee = $derived(collections.length > 6);
	// We need 4 copies to make sure the marquee is seamless
	let displayCollections = $derived(
		needsMarquee ? [...collections, ...collections, ...collections, ...collections] : collections
	);
</script>

<section class="relative overflow-hidden border-t border-[#0a0a0a]/8 bg-white py-10 sm:py-14">
	<div class="pointer-events-none absolute top-8 left-0 hidden h-[18rem] w-[18rem] -translate-x-1/3 text-[#8b45b8]/12 sm:block" aria-hidden="true">
		<svg class="h-full w-full" viewBox="0 0 260 260" fill="none">
			<path d="M74 218C82 158 115 100 180 48" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
			<path d="M98 174C76 158 70 128 83 104C107 116 116 147 98 174Z" stroke="currentColor" stroke-width="2" />
			<path d="M124 136C102 120 99 88 116 66C140 83 146 113 124 136Z" stroke="currentColor" stroke-width="2" />
			<path d="M150 102C137 77 146 50 171 36C186 63 176 90 150 102Z" stroke="currentColor" stroke-width="2" />
			<path d="M107 166C134 159 161 171 177 194C147 203 121 192 107 166Z" stroke="currentColor" stroke-width="2" />
			<path d="M135 129C162 122 188 133 204 156C176 166 149 155 135 129Z" stroke="currentColor" stroke-width="2" />
			<circle cx="73" cy="218" r="4" fill="currentColor" />
		</svg>
	</div>
	<div class="pointer-events-none absolute right-0 bottom-4 hidden h-[19rem] w-[19rem] translate-x-1/3 rotate-180 text-[#8b45b8]/10 sm:block" aria-hidden="true">
		<svg class="h-full w-full" viewBox="0 0 260 260" fill="none">
			<path d="M74 218C82 158 115 100 180 48" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
			<path d="M98 174C76 158 70 128 83 104C107 116 116 147 98 174Z" stroke="currentColor" stroke-width="2" />
			<path d="M124 136C102 120 99 88 116 66C140 83 146 113 124 136Z" stroke="currentColor" stroke-width="2" />
			<path d="M150 102C137 77 146 50 171 36C186 63 176 90 150 102Z" stroke="currentColor" stroke-width="2" />
			<path d="M107 166C134 159 161 171 177 194C147 203 121 192 107 166Z" stroke="currentColor" stroke-width="2" />
			<path d="M135 129C162 122 188 133 204 156C176 166 149 155 135 129Z" stroke="currentColor" stroke-width="2" />
			<circle cx="73" cy="218" r="4" fill="currentColor" />
		</svg>
	</div>

	<div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex flex-col gap-8">
			<div class="text-center">
				<h2 class="font-serif text-2xl tracking-widest text-[#0a0a0a] uppercase">
					Shop by <span class="text-[#7e2bb8]">Category</span>
				</h2>
			</div>

			<div class="relative w-full overflow-hidden">
				<div
					class={needsMarquee
						? 'marquee-track hover:pause-animation flex items-start gap-4 sm:gap-10'
						: 'grid grid-cols-3 justify-items-center gap-x-2 gap-y-8 sm:flex sm:flex-row sm:flex-wrap sm:justify-center sm:gap-8 lg:gap-10'}
				>
					{#each displayCollections as category}
						<a
							href={`/shop?category=${category.slug || category.id}`}
							class="group flex w-[4.5rem] shrink-0 flex-col items-center gap-3 sm:w-[7.5rem]"
						>
							<div
								class="relative flex h-[4.5rem] w-[4.5rem] items-center justify-center overflow-hidden rounded-full bg-[#f7f1ff] ring-1 ring-[#8b45b8]/18 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_8px_20px_rgba(126,43,184,0.14)] group-hover:ring-2 group-hover:ring-[#8b45b8] sm:h-[7.5rem] sm:w-[7.5rem]"
							>
								<img
									src={category.imageUrl || '/image.png'}
									alt={category.name}
									class="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
								/>
							</div>
							<span
								class="text-center font-serif text-[0.65rem] font-semibold tracking-[0.1em] text-[#0a0a0a] uppercase transition-colors group-hover:text-[#7e2bb8] sm:text-xs"
							>
								{category.name}
							</span>
						</a>
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.marquee-track {
		/* Add padding to the end of the track to ensure seamless scroll if needed */
		display: flex;
		width: max-content;
		animation: scroll-left-to-right 30s linear infinite;
	}

	.hover\:pause-animation:hover {
		animation-play-state: paused;
	}

	@keyframes scroll-left-to-right {
		0% {
			transform: translateX(calc(-50% - 0.5rem));
		} /* Start at -50% */
		100% {
			transform: translateX(0);
		}
	}
</style>
