<script lang="ts">
	import { onMount } from 'svelte';

	let activeSlide = $state(0);
	let sliderHovered = $state(false);

	const bannerSlides = [
		{
			image: '/banner-section/banner-1.png',
			alt: 'Shahzad Abayas featured banner collection'
		},
		{
			image: '/banner-section/banner-2.png',
			alt: 'Shahzad Abayas premium modest wear banner'
		},
		{
			image: '/banner-section/banner-3.png',
			alt: 'Shahzad Abayas new arrival banner'
		}
	];

	let slideInterval: ReturnType<typeof setInterval>;

	function startSlider() {
		stopSlider();
		slideInterval = setInterval(() => {
			if (!sliderHovered) {
				activeSlide = (activeSlide + 1) % bannerSlides.length;
			}
		}, 4500);
	}

	function stopSlider() {
		if (slideInterval) clearInterval(slideInterval);
	}

	function handlePrev() {
		activeSlide = (activeSlide - 1 + bannerSlides.length) % bannerSlides.length;
		startSlider();
	}

	function handleNext() {
		activeSlide = (activeSlide + 1) % bannerSlides.length;
		startSlider();
	}

	onMount(() => {
		startSlider();
		return stopSlider;
	});
</script>

<section
	aria-label="Featured abaya banners"
	class="relative overflow-hidden border-y border-[#0a0a0a]/8 bg-white"
	onmouseenter={() => (sliderHovered = true)}
	onmouseleave={() => (sliderHovered = false)}
>
	<div class="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
		<div
			class="relative h-[310px] w-full overflow-hidden rounded-2xl border border-[#0a0a0a]/10 bg-white shadow-[0_20px_50px_rgba(20,53,45,0.05)] sm:h-[400px] md:h-[450px] lg:h-[520px]"
		>
			{#each bannerSlides as slide, index}
				<img
					src={slide.image}
					alt={slide.alt}
					class="absolute inset-0 size-full object-cover object-center transition-transform duration-[800ms] ease-in-out"
					style="transform: translateX({(index - activeSlide) * 100}%);"
					loading={index === 0 ? 'eager' : 'lazy'}
				/>
			{/each}

			<div class="absolute inset-y-0 left-2 z-20 flex items-center sm:left-4">
				<button
					onclick={handlePrev}
					class="flex size-8 items-center justify-center rounded-full border border-white/30 bg-[#0a0a0a]/35 text-white shadow-md backdrop-blur-sm transition-colors duration-200 hover:bg-white hover:text-[#0a0a0a] sm:size-10"
					aria-label="Previous banner"
				>
					<svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2.5"
							d="M15 19l-7-7 7-7"
						/>
					</svg>
				</button>
			</div>

			<div class="absolute inset-y-0 right-2 z-20 flex items-center sm:right-4">
				<button
					onclick={handleNext}
					class="flex size-8 items-center justify-center rounded-full border border-white/30 bg-[#0a0a0a]/35 text-white shadow-md backdrop-blur-sm transition-colors duration-200 hover:bg-white hover:text-[#0a0a0a] sm:size-10"
					aria-label="Next banner"
				>
					<svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2.5"
							d="M9 5l7 7-7 7"
						/>
					</svg>
				</button>
			</div>

			<div class="absolute inset-x-0 bottom-3 z-20 flex justify-center gap-2">
				{#each bannerSlides as _, idx}
					<button
						onclick={() => {
							activeSlide = idx;
							startSlider();
						}}
						class="h-1.5 rounded-full transition-all duration-200 {activeSlide === idx
							? 'w-7 bg-white'
							: 'w-1.5 bg-white/45'}"
						aria-label={`Go to banner ${idx + 1}`}
					></button>
				{/each}
			</div>
		</div>
	</div>
</section>
