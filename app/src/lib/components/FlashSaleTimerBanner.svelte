<script lang="ts">
	import { onMount } from 'svelte';

	let { settings = {} } = $props<{ settings?: Record<string, any> }>();

	const staticFlashSaleImage = '/products/georgette-abaya/georgette-abaya-charcoal-grey.png';

	function getInitialTime() {
		const h = settings.flashSaleHours !== undefined ? Number(settings.flashSaleHours) : 2;
		const m = settings.flashSaleMinutes !== undefined ? Number(settings.flashSaleMinutes) : 12;
		const s = settings.flashSaleSeconds !== undefined ? Number(settings.flashSaleSeconds) : 40;
		return h * 3600 + m * 60 + s;
	}

	let timeLeft = $state(getInitialTime());

	let hours = $derived(Math.floor(timeLeft / 3600));
	let minutes = $derived(Math.floor((timeLeft % 3600) / 60));
	let seconds = $derived(timeLeft % 60);

	onMount(() => {
		const interval = setInterval(() => {
			timeLeft = timeLeft > 0 ? timeLeft - 1 : getInitialTime();
		}, 1000);

		return () => clearInterval(interval);
	});

	function pad(num: number): string[] {
		return String(num).padStart(2, '0').split('');
	}
</script>

<section class="relative overflow-hidden border-y border-[#0a0a0a]/8 bg-white py-5 sm:py-7">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div
			class="relative grid min-h-[480px] overflow-hidden rounded-[1.75rem] border border-[#d8b7f0]/45 bg-[#2a0d45] shadow-[0_22px_50px_rgba(54,18,83,0.18)] sm:min-h-[390px] lg:grid-cols-[0.72fr_1.28fr]"
		>
			<div class="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,#b687d8_0%,#7d3aa1_24%,#522072_48%,#2c123f_100%)]"></div>
			<div class="pointer-events-none absolute inset-0 opacity-35">
				<svg class="h-full w-full" viewBox="0 0 1200 520" preserveAspectRatio="none" aria-hidden="true">
					<path
						d="M1115 326c-84 20-91 104-84 167M1030 480c76-68 142-45 205-91M-40 320c90-5 92 80 136 92M240 20c105 19 107 109 152 156"
						fill="none"
						stroke="#e9c7ff"
						stroke-width="1.2"
						opacity="0.55"
					/>
					<path
						d="M875 500c85-70 168 3 245-91M720 52c106-48 205-15 284-67"
						fill="none"
						stroke="#f2dcff"
						stroke-width="0.8"
						opacity="0.35"
					/>
				</svg>
			</div>

			<div class="pointer-events-none absolute top-10 right-8 hidden text-[#e9c7ff]/75 sm:block">
				<div class="grid grid-cols-4 gap-3">
					{#each Array(16) as _}
						<span class="size-1 rounded-full bg-current"></span>
					{/each}
				</div>
			</div>

			<div class="pointer-events-none absolute bottom-9 left-8 hidden text-white/55 sm:block">
				<div class="grid grid-cols-5 gap-3">
					{#each Array(20) as _}
						<span class="size-1 rounded-full bg-current"></span>
					{/each}
				</div>
			</div>

			<div
				class="relative z-10 flex min-h-[330px] items-end justify-center overflow-hidden border-b border-[#e6d3f5] bg-white px-4 pt-6 lg:min-h-full lg:border-r lg:border-b-0"
			>
				<div class="pointer-events-none absolute inset-y-0 left-0 w-4 bg-[#c8a4e5] sm:w-6"></div>
				<div class="pointer-events-none absolute inset-y-0 right-0 w-4 bg-[#f4edf8] sm:w-6"></div>
				<svg
					class="pointer-events-none absolute inset-0 text-[#a875ce]/28"
					viewBox="0 0 420 430"
					preserveAspectRatio="none"
					aria-hidden="true"
				>
					<path
						d="M-25 270c76 5 84 82 135 92M245 16c86 13 130 66 150 145"
						fill="none"
						stroke="currentColor"
						stroke-width="1.2"
					/>
				</svg>

				<div
					class="relative z-10 mb-0 h-[300px] w-[84%] max-w-[380px] overflow-visible rounded-t-full border border-[#dfc7f1] bg-[#eee4dc] shadow-[0_18px_38px_rgba(87,43,122,0.14)] sm:h-[390px] lg:h-[88%] lg:w-[82%]"
				>
					<div class="pointer-events-none absolute inset-3 rounded-t-full border-t-[8px] border-l-[8px] border-r-[8px] border-[#ead9f7]"></div>
					<div class="pointer-events-none absolute -right-[6%] top-[20%] h-[76%] w-[16%] bg-[#eadfd7]"></div>
					<img
						src={staticFlashSaleImage}
						alt="Limited edition abaya flash sale"
						class="relative z-10 h-full w-full object-cover object-top drop-shadow-[0_18px_28px_rgba(48,17,71,0.12)]"
					/>

					<div
						class="absolute -right-7 top-10 z-20 flex size-24 flex-col items-center justify-center rounded-full border-2 border-[#d7b6ef] bg-[#7f35bd] text-center text-white shadow-[0_14px_30px_rgba(91,38,130,0.25)] sm:-right-8 sm:size-28"
					>
						<span class="text-sm font-black uppercase">Save</span>
						<span class="text-3xl font-black leading-none sm:text-4xl">30%</span>
						<span class="text-sm font-black uppercase">Off</span>
					</div>

					<span
						class="absolute bottom-3 left-3 z-20 rounded-md bg-[#7f35bd] px-4 py-2 text-xs font-black text-white uppercase shadow-[0_10px_24px_rgba(91,38,130,0.25)] sm:px-5 sm:text-sm"
					>
						Online Exclusive
					</span>
				</div>
			</div>

			<div class="relative z-10 flex flex-col items-center justify-center px-5 py-7 text-center sm:px-10 lg:px-14">
				<div
					class="mb-4 rounded-full border border-white/25 bg-white/25 px-6 py-1.5 text-[0.64rem] font-black text-white uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.42)] sm:px-9 sm:text-xs"
				>
					Limited Edition Offer
				</div>

				<div class="relative">
					<h3
						class="font-serif text-[2.6rem] leading-none font-black text-white uppercase text-balance sm:text-[4.6rem] lg:text-[5.3rem]"
					>
						{settings.flashSaleTitle || 'Flash Sale'}
					</h3>
					<p
						class="-mt-2 font-serif text-[2.05rem] leading-none text-[#dfa4ff] italic sm:-mt-4 sm:text-[3.35rem] lg:text-[3.8rem]"
					>
						{settings.flashSaleSubtitle || 'Ends soon!'}
					</p>
				</div>

				<div class="mt-4 flex w-full max-w-2xl items-center gap-3 text-[#e9c7ff]">
					<span class="h-px flex-1 bg-current/55"></span>
					<span class="text-lg">✦</span>
					<span class="h-px flex-1 bg-current/55"></span>
				</div>

				<p
					class="mt-3 text-[0.78rem] font-black text-white uppercase text-pretty sm:text-sm"
				>
					{settings.flashSaleDescription || 'Up to 70% off selected items'}
				</p>

				<div class="mt-5 w-full max-w-[31rem] rounded-2xl border border-[#d8a7f5]/55 px-4 py-3 sm:px-6">
					<div class="-mt-6 mb-2.5 flex items-center justify-center gap-3">
						<span class="hidden h-px w-20 bg-[#e9c7ff]/60 sm:block"></span>
						<span class="bg-[#522072] px-3 text-[0.68rem] font-black text-white uppercase">
							Remaining Time:
						</span>
						<span class="hidden h-px w-20 bg-[#e9c7ff]/60 sm:block"></span>
					</div>

					<div class="flex items-center justify-center gap-2 sm:gap-4">
						<div class="flex flex-col items-center gap-2">
							<div class="flex gap-1.5">
								{#each pad(hours) as digit}
									<div
										class="flex h-12 w-9 items-center justify-center rounded-lg bg-white text-2xl font-black text-[#4c1d68] shadow-[0_8px_18px_rgba(30,9,45,0.25)] tabular-nums sm:h-15 sm:w-12 sm:text-3xl"
									>
										{digit}
									</div>
								{/each}
							</div>
							<span class="text-[0.62rem] font-black text-white uppercase sm:text-xs">Hours</span>
						</div>

						<div class="pb-7 text-2xl font-black text-white sm:text-3xl">:</div>

						<div class="flex flex-col items-center gap-2">
							<div class="flex gap-1.5">
								{#each pad(minutes) as digit}
									<div
										class="flex h-12 w-9 items-center justify-center rounded-lg bg-white text-2xl font-black text-[#4c1d68] shadow-[0_8px_18px_rgba(30,9,45,0.25)] tabular-nums sm:h-15 sm:w-12 sm:text-3xl"
									>
										{digit}
									</div>
								{/each}
							</div>
							<span class="text-[0.62rem] font-black text-white uppercase sm:text-xs">Mins</span>
						</div>

						<div class="pb-7 text-2xl font-black text-white sm:text-3xl">:</div>

						<div class="flex flex-col items-center gap-2">
							<div class="flex gap-1.5">
								{#each pad(seconds) as digit}
									<div
										class="flex h-12 w-9 items-center justify-center rounded-lg bg-white text-2xl font-black text-[#4c1d68] shadow-[0_8px_18px_rgba(30,9,45,0.25)] tabular-nums sm:h-15 sm:w-12 sm:text-3xl"
									>
										{digit}
									</div>
								{/each}
							</div>
							<span class="text-[0.62rem] font-black text-white uppercase sm:text-xs">Secs</span>
						</div>
					</div>
				</div>

				<a
					href={settings.flashSaleCtaLink || '/shop?on-sale=true'}
					class="mt-5 inline-flex min-h-11 items-center justify-center gap-3 rounded-full border border-white/50 bg-white/90 px-9 text-sm font-black text-[#542071] uppercase shadow-[0_0_24px_rgba(225,159,255,0.42)] transition-colors duration-200 hover:bg-[#f2dcff] sm:min-h-12 sm:px-14"
				>
					{settings.flashSaleCtaLabel || 'Shop The Sale'}
					<svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.4" d="M9 5l7 7-7 7" />
					</svg>
				</a>
			</div>
		</div>
	</div>
</section>
