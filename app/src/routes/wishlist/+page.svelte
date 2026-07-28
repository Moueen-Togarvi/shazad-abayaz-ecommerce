<script lang="ts">
	import { cart } from '$lib/client/cart.svelte';
	import { wishlist, type WishlistItem } from '$lib/client/wishlist.svelte';
	import { formatMoney } from '$lib/shared/money';

	function itemPrice(item: WishlistItem) {
		return Number(item.salePrice || item.price);
	}

	function addToCart(item: WishlistItem) {
		cart.addItem({
			id: item.id,
			productId: item.id,
			name: item.name,
			price: itemPrice(item),
			quantity: 1,
			image: item.image,
			color: item.color,
			size: item.size
		});
	}
</script>

<svelte:head>
	<title>My Wishlist | Abayiza</title>
</svelte:head>

<section class="bg-[#fbf9f2] px-4 py-12 text-[#14352d] sm:px-6 md:py-20 lg:px-8">
	<div class="mx-auto max-w-7xl">
		<div class="mb-10 text-center">
			<p class="mb-3 text-xs font-black tracking-[0.2em] text-[#b58b2b] uppercase">Saved Abayas</p>
			<h1 class="font-serif text-4xl leading-tight uppercase sm:text-5xl">My Wishlist</h1>
			<p class="mx-auto mt-4 max-w-xl text-sm leading-6 font-medium text-[#596c62]">
				Your saved pieces stay here on this device so you can return and order easily.
			</p>
		</div>

		{#if wishlist.items.length}
			<div class="mb-8 flex items-center justify-between gap-4 border-b border-[#14352d]/10 pb-5">
				<p class="text-sm font-bold text-[#596c62]">
					{wishlist.totalItems} saved item{wishlist.totalItems === 1 ? '' : 's'}
				</p>
				<button
					type="button"
					class="rounded-full border border-[#14352d]/12 bg-white px-4 py-2 text-xs font-black tracking-[0.12em] text-[#14352d] uppercase transition-colors hover:bg-[#e4b43d]"
					onclick={() => wishlist.clear()}
				>
					Clear Wishlist
				</button>
			</div>

			<div class="grid auto-rows-fr grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{#each wishlist.items as item}
					<article
						class="group flex h-full flex-col overflow-hidden rounded-md border border-[#14352d]/10 bg-white shadow-[0_16px_38px_rgba(20,53,45,0.08)] transition-transform duration-300 hover:-translate-y-1"
					>
						<a
							href={`/shop/${item.slug}`}
							class="relative block aspect-[4/3] overflow-hidden bg-[#e4eee9]"
							aria-label={`View ${item.name}`}
						>
							<img
								src={item.image}
								alt={item.name}
								width="1200"
								height="900"
								class="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]"
							/>
							<span
								class="absolute top-3 left-3 rounded-full bg-white/86 px-3 py-1 text-[0.62rem] font-black tracking-[0.12em] text-[#14352d] uppercase shadow-[0_10px_20px_rgba(20,53,45,0.10)] backdrop-blur"
							>
								Saved
							</span>
						</a>

						<div class="flex flex-1 flex-col p-4">
							<p class="text-xs font-bold tracking-[0.1em] text-[#596c62] uppercase">
								{item.category || item.color || 'Abayiza'}
							</p>
							<a
								href={`/shop/${item.slug}`}
								class="mt-2 block overflow-hidden font-serif text-base leading-tight font-semibold text-ellipsis whitespace-nowrap text-[#14352d] transition-colors hover:text-[#b58b2b]"
							>
								{item.name}
							</a>

							<div class="mt-3 flex flex-wrap gap-2">
								{#if item.color}
									<span
										class="inline-flex min-h-6 items-center justify-center rounded-full border border-[#14352d]/10 bg-[#f5f0e5] px-2.5 text-center text-[0.66rem] font-bold text-[#14352d]"
									>
										{item.color}
									</span>
								{/if}
								{#if item.size}
									<span
										class="inline-flex min-h-6 items-center justify-center rounded-full border border-[#14352d]/10 bg-[#f5f0e5] px-2.5 text-center text-[0.66rem] font-bold text-[#14352d]"
									>
										{item.size}
									</span>
								{/if}
							</div>

							<div class="mt-auto flex items-end justify-between gap-3 pt-5">
								<div>
									<p class="text-lg font-black whitespace-nowrap text-[#14352d]">
										{formatMoney(item.salePrice || item.price)}
									</p>
									{#if item.salePrice}
										<p class="text-xs font-bold whitespace-nowrap text-red-600 line-through">
											{formatMoney(item.price)}
										</p>
									{/if}
								</div>
								<button
									type="button"
									class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#14352d]/10 bg-[#fbf9f2] text-[#14352d] transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-700"
									aria-label={`Remove ${item.name} from wishlist`}
									onclick={() => wishlist.removeItem(item.id)}
								>
									<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="1.8"
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</button>
							</div>

							<button
								type="button"
								class="mt-4 inline-flex min-h-10 w-full items-center justify-center rounded-full bg-[#14352d] px-4 text-sm font-bold whitespace-nowrap text-white transition-colors hover:bg-[#e4b43d] hover:text-[#14352d]"
								onclick={() => addToCart(item)}
							>
								Add to Cart
							</button>
						</div>
					</article>
				{/each}
			</div>
		{:else}
			<div
				class="mx-auto max-w-md rounded-md border border-dashed border-[#14352d]/18 bg-white/80 px-6 py-16 text-center shadow-[0_16px_38px_rgba(20,53,45,0.06)]"
			>
				<svg
					class="mx-auto mb-6 h-16 w-16 text-[#e4b43d]"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					aria-hidden="true"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.4"
						d="M12 20.25l-1.45-1.32C5.4 14.36 2 11.28 2 7.5A4.5 4.5 0 016.5 3c1.74 0 3.41.81 4.5 2.09A5.96 5.96 0 0115.5 3 4.5 4.5 0 0120 7.5c0 3.78-3.4 6.86-8.55 11.43L12 20.25z"
					/>
				</svg>
				<h2 class="font-serif text-2xl text-[#14352d]">Your wishlist is empty</h2>
				<p class="mt-3 text-sm leading-6 font-medium text-[#596c62]">
					Tap the heart on any abaya card to save it here.
				</p>
				<a
					href="/shop"
					class="mt-7 inline-flex min-h-11 items-center justify-center rounded-full bg-[#14352d] px-7 text-sm font-black text-white transition-colors hover:bg-[#e4b43d] hover:text-[#14352d]"
				>
					Explore Collection
				</a>
			</div>
		{/if}
	</div>
</section>
