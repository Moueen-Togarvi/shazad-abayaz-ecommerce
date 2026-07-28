<script lang="ts">
	import { onMount } from 'svelte';
	import AbayizaWordmark from './AbayizaWordmark.svelte';

	let { settings = {} } = $props();

	// Calculate initial time dynamically
	const getInitialTime = () => {
		const h = settings.flashSaleHours !== undefined ? Number(settings.flashSaleHours) : 2;
		const m = settings.flashSaleMinutes !== undefined ? Number(settings.flashSaleMinutes) : 14;
		const s = settings.flashSaleSeconds !== undefined ? Number(settings.flashSaleSeconds) : 30;
		return h * 3600 + m * 60 + s;
	};

	let timeLeft = $state(getInitialTime());

	let hours = $derived(Math.floor(timeLeft / 3600));
	let minutes = $derived(Math.floor((timeLeft % 3600) / 60));
	let seconds = $derived(timeLeft % 60);

	onMount(() => {
		const interval = setInterval(() => {
			if (timeLeft > 0) {
				timeLeft--;
			} else {
				timeLeft = getInitialTime(); // reset/loop
			}
		}, 1000);
		return () => clearInterval(interval);
	});

	function pad(num: number): string[] {
		return String(num).padStart(2, '0').split('');
	}
</script>

<section class="relative overflow-hidden border-y border-[#14352d]/8 bg-[#fbf9f2]">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div
			class="relative my-6 flex h-[530px] w-full flex-col items-stretch justify-between overflow-hidden rounded-2xl border border-[#e4b43d]/20 bg-[#14352d] shadow-[0_20px_50px_rgba(20,53,45,0.15)] sm:h-[360px] sm:flex-row md:h-[420px]"
		>
			<!-- Fine Lines Grid Overlay (Subtle) -->
			<div
				class="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:24px_24px]"
			></div>

			<!-- Glowing gold blur background element -->
			<div
				class="pointer-events-none absolute top-1/2 left-1/4 h-80 w-80 -translate-y-1/2 rounded-full bg-[#e4b43d]/10 blur-[90px]"
			></div>

			<!-- Left Section: Model in Abaya (using transparent generated asset) -->
			<div
				class="relative z-10 flex h-[180px] w-full shrink-0 items-end justify-center overflow-hidden px-4 sm:h-full sm:w-[38%] sm:justify-start sm:pl-12 md:w-[42%]"
			>
				<!-- Concentric background circles framing the model -->
				<div
					class="pointer-events-none absolute top-1/2 left-1/2 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e4b43d]/8 sm:left-[-20px] sm:h-[360px] sm:w-[360px]"
				></div>
				<div
					class="pointer-events-none absolute top-1/2 left-1/2 h-[160px] w-[160px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fffaf0]/5 sm:left-[10px] sm:h-[280px] sm:w-[280px]"
				></div>

				<!-- Sparkle accent -->
				<svg
					class="absolute top-12 left-1/2 h-4 w-4 animate-pulse text-[#e4b43d] opacity-30"
					fill="currentColor"
					viewBox="0 0 24 24"
				>
					<path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
				</svg>

				<!-- Modest abaya image -->
				<img
					src={settings.flashSaleImage || '/abaya_banner_occasion.png'}
					alt="Flash Sale Abaya Highlight"
					class="h-[95%] w-auto object-contain object-bottom drop-shadow-[0_15px_30px_rgba(0,0,0,0.35)] filter sm:h-[98%]"
				/>
			</div>

			<!-- Right Section: Offer Info & Countdown -->
			<div
				class="relative z-10 flex flex-grow flex-col items-center justify-center px-4 py-6 text-center sm:px-12 sm:py-0 md:px-16"
			>
				<!-- Badge -->
				<div class="mb-2.5 flex items-center justify-center gap-1.5 sm:mb-4">
					<span
						class="inline-flex rounded-full border border-[#e4b43d]/20 bg-[#e4b43d]/10 px-3 py-1.5 text-[0.58rem] font-black tracking-[0.1em] text-[#e4b43d] uppercase sm:text-[0.68rem]"
					>
						Limited Edition Offer
					</span>
				</div>

				<!-- Title Ribbon -->
				<div class="relative my-1 inline-block self-center">
					<h3
						class="xs:text-[1.2rem] rotate-[-1.5deg] rounded bg-[#e4b43d] px-3 py-1.5 font-serif text-[1.05rem] font-black tracking-wide text-[#14352d] uppercase shadow-lg sm:px-5 sm:py-2.5 sm:text-3xl md:text-4xl lg:text-[2.2rem]"
					>
						{settings.flashSaleTitle || 'FLASH SALE'}
					</h3>
					<!-- Cursive overlapping text -->
					<span
						class="absolute -right-2 -bottom-2 rotate-[2.5deg] font-serif text-sm text-[#fffaf0] italic drop-shadow-md select-none sm:-right-6 sm:text-2xl md:text-3xl"
					>
						{settings.flashSaleSubtitle || 'Ends Soon!'}
					</span>
				</div>

				<!-- Promo details description -->
				<p
					class="mt-3 w-full text-center text-[0.62rem] font-black tracking-[0.15em] text-[#fffaf0]/80 uppercase sm:mt-6 sm:text-xs sm:tracking-[0.25em] md:text-[0.85rem]"
				>
					{settings.flashSaleDescription || 'UP TO 70% OFF SELECTED ITEMS'}
				</p>

				<!-- Countdown Timer Box -->
				<div class="mt-4 flex flex-col items-center gap-2 sm:mt-6">
					<span
						class="text-[0.55rem] font-bold tracking-[0.15em] text-[#e4b43d] uppercase sm:text-[0.62rem]"
					>
						Remaining Time:
					</span>

					<div
						class="flex items-center justify-center gap-2 rounded-xl border border-white/5 bg-[#173f35]/60 p-2.5 shadow-inner backdrop-blur sm:p-3.5"
					>
						<!-- Hours -->
						<div class="flex flex-col items-center gap-1">
							<div class="flex gap-0.5 sm:gap-1">
								{#each pad(hours) as digit}
									<div
										class="flex h-8 w-6 items-center justify-center rounded-md bg-[#fffaf0] text-sm font-black text-[#14352d] shadow-md sm:h-13 sm:w-10 sm:text-xl"
									>
										{digit}
									</div>
								{/each}
							</div>
							<span
								class="mt-1 text-[0.48rem] font-semibold tracking-[0.12em] text-white/50 uppercase sm:text-[0.58rem]"
								>Hours</span
							>
						</div>

						<div class="pb-4 text-sm font-bold text-[#e4b43d] sm:pb-5 sm:text-lg">:</div>

						<!-- Minutes -->
						<div class="flex flex-col items-center gap-1">
							<div class="flex gap-0.5 sm:gap-1">
								{#each pad(minutes) as digit}
									<div
										class="flex h-8 w-6 items-center justify-center rounded-md bg-[#fffaf0] text-sm font-black text-[#14352d] shadow-md sm:h-13 sm:w-10 sm:text-xl"
									>
										{digit}
									</div>
								{/each}
							</div>
							<span
								class="mt-1 text-[0.48rem] font-semibold tracking-[0.12em] text-white/50 uppercase sm:text-[0.58rem]"
								>Mins</span
							>
						</div>

						<div class="pb-4 text-sm font-bold text-[#e4b43d] sm:pb-5 sm:text-lg">:</div>

						<!-- Seconds -->
						<div class="flex flex-col items-center gap-1">
							<div class="flex gap-0.5 sm:gap-1">
								{#each pad(seconds) as digit}
									<div
										class="flex h-8 w-6 items-center justify-center rounded-md bg-[#fffaf0] text-sm font-black text-[#14352d] shadow-md sm:h-13 sm:w-10 sm:text-xl"
									>
										{digit}
									</div>
								{/each}
							</div>
							<span
								class="mt-1 text-[0.48rem] font-semibold tracking-[0.12em] text-white/50 uppercase sm:text-[0.58rem]"
								>Secs</span
							>
						</div>
					</div>
				</div>

				<!-- Action button -->
				<a
					href={settings.flashSaleCtaLink || '/shop?on-sale=true'}
					class="mt-4 inline-flex min-h-9 items-center justify-center gap-2 rounded-full bg-[#fffaf0] px-5 text-[0.62rem] font-black text-[#14352d] uppercase shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#e4b43d] hover:text-[#14352d] hover:shadow-lg sm:mt-6 sm:min-h-11 sm:px-8 sm:text-[0.72rem]"
				>
					{settings.flashSaleCtaLabel || 'Shop The Sale'}
					<svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2.8"
							d="M9 5l7 7-7 7"
						/>
					</svg>
				</a>
			</div>
		</div>
	</div>
</section>
