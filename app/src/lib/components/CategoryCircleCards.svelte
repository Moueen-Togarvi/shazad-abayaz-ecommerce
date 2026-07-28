<script lang="ts">
	let { collections = [] } = $props<{ collections: any[] }>();

	let needsMarquee = $derived(collections.length > 6);
	// We need 4 copies to make sure the marquee is seamless
	let displayCollections = $derived(
		needsMarquee ? [...collections, ...collections, ...collections, ...collections] : collections
	);
</script>

<section class="overflow-hidden border-t border-[#14352d]/8 bg-[#f7f4ec] py-10 sm:py-14">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex flex-col gap-8">
			<div class="text-center">
				<h2 class="font-serif text-2xl tracking-widest text-[#14352d] uppercase">
					Shop by Category
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
								class="relative flex h-[4.5rem] w-[4.5rem] items-center justify-center overflow-hidden rounded-full bg-[#f5f0e5] ring-1 ring-[#14352d]/10 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_8px_20px_rgba(20,53,45,0.15)] group-hover:ring-2 group-hover:ring-[#e4b43d] sm:h-[7.5rem] sm:w-[7.5rem]"
							>
								<img
									src={category.imageUrl || '/image.png'}
									alt={category.name}
									class="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
								/>
							</div>
							<span
								class="text-center font-serif text-[0.65rem] font-semibold tracking-[0.1em] text-[#14352d] uppercase transition-colors group-hover:text-[#c0983f] sm:text-xs"
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
