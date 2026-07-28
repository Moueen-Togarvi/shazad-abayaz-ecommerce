<script lang="ts">
	import { cart } from '$lib/client/cart.svelte';
	import { formatMoney } from '$lib/shared/money';

	let shipping = 300;
	let giftWrapPrice = 500;
	let freeShippingThreshold = 15000;
	let isGift = $state(false);
	let giftMessage = $state('');
</script>

<svelte:head>
	<title>Your Bag | Abayiza</title>
</svelte:head>

<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-20 lg:px-8">
	<div class="mb-12 text-center">
		<h1 class="mb-4 font-serif text-3xl tracking-widest text-black uppercase md:text-4xl">
			Your Bag
		</h1>
		<div class="mx-auto h-[1px] w-12 bg-gold"></div>
	</div>

	{#if cart.items.length === 0}
		<div class="py-20 text-center">
			<p class="mb-8 text-lg font-light text-gray-500">Your bag is currently empty.</p>
			<a
				href="/shop"
				class="inline-block bg-black px-10 py-4 text-sm tracking-widest text-white uppercase transition-colors hover:bg-gold"
				>Continue Shopping</a
			>
		</div>
	{:else}
		<div class="flex flex-col gap-12 lg:flex-row lg:gap-20">
			<!-- Cart Items -->
			<div class="w-full lg:w-3/5">
				<div
					class="mb-6 hidden justify-between border-b border-black/10 pb-4 text-sm tracking-widest text-gray-500 uppercase md:flex"
				>
					<div class="w-1/2">Product</div>
					<div class="w-1/6 text-center">Quantity</div>
					<div class="w-1/6 text-right">Total</div>
				</div>

				<div class="space-y-8">
					{#each cart.items as item}
						<div
							class="flex flex-col items-start border-b border-gray-100 py-4 md:flex-row md:items-center"
						>
							<!-- Product Image & Info -->
							<div class="mb-4 flex w-full md:mb-0 md:w-1/2">
								<a href="/shop/{item.productId}" class="block h-32 w-24 flex-shrink-0 bg-gray-100">
									<img
										src={item.image}
										alt={item.name}
										class="h-full w-full object-cover object-top"
									/>
								</a>
								<div class="ml-6 flex flex-col justify-center">
									<a
										href="/shop/{item.productId}"
										class="mb-1 font-serif text-sm transition-colors hover:text-gold md:text-base"
										>{item.name}</a
									>
									<p class="mb-1 text-xs font-light text-gray-500">Color: {item.color}</p>
									<p class="mb-2 text-xs font-light text-gray-500">Size: {item.size}</p>
									<p class="block text-sm font-medium md:hidden">{formatMoney(item.price)}</p>
									<button
										class="mt-2 self-start text-xs tracking-wider text-gray-400 uppercase underline hover:text-black"
										onclick={() => cart.removeItem(item.id)}>Remove</button
									>
								</div>
							</div>

							<!-- Quantity -->
							<div class="mb-4 flex w-full justify-start md:mb-0 md:w-1/6 md:justify-center">
								<div class="flex h-10 w-24 border border-gray-300">
									<button
										class="flex w-8 items-center justify-center text-gray-500 transition-colors hover:bg-gray-50 hover:text-black"
										onclick={() => cart.updateQuantity(item.id, item.quantity - 1)}>-</button
									>
									<input
										type="number"
										class="w-full border-none bg-transparent p-0 text-center text-sm font-medium focus:ring-0"
										bind:value={item.quantity}
										onchange={() => cart.updateQuantity(item.id, item.quantity)}
										min="1"
									/>
									<button
										class="flex w-8 items-center justify-center text-gray-500 transition-colors hover:bg-gray-50 hover:text-black"
										onclick={() => cart.updateQuantity(item.id, item.quantity + 1)}>+</button
									>
								</div>
							</div>

							<!-- Item Total -->
							<div class="w-full text-left md:w-1/6 md:text-right">
								<p class="text-sm font-medium">{formatMoney(item.price * item.quantity)}</p>
							</div>
						</div>
					{/each}
				</div>

				<!-- Gift Wrapping Option -->
				<div class="mt-8 border border-gray-100 bg-cream/50 p-6">
					<label class="flex cursor-pointer items-start space-x-3">
						<input
							type="checkbox"
							bind:checked={isGift}
							class="mt-0.5 form-checkbox h-5 w-5 rounded-none border-gray-300 text-black focus:ring-black"
						/>
						<div>
							<span class="mb-1 block text-sm font-medium tracking-wide uppercase">
								Add Premium Gift Wrapping ({formatMoney(giftWrapPrice)})
							</span>
							<span class="text-xs font-light text-gray-500"
								>Your items will be beautifully packaged in our signature Abayiza gift box with a
								satin ribbon.</span
							>
						</div>
					</label>

					{#if isGift}
						<div class="mt-4 pl-8">
							<label
								for="gift-message"
								class="mb-2 block text-xs tracking-widest text-gray-500 uppercase"
								>Gift Message (Optional)</label
							>
							<textarea
								id="gift-message"
								bind:value={giftMessage}
								rows="3"
								class="w-full border-gray-300 bg-white text-sm focus:border-black focus:ring-black"
								placeholder="Write a personal note..."
							></textarea>
						</div>
					{/if}
				</div>
			</div>

			<!-- Order Summary -->
			<div class="w-full lg:w-2/5">
				<div class="sticky top-28 border border-gray-200 bg-gray-50 p-8">
					<h2
						class="mb-6 border-b border-gray-200 pb-4 font-serif text-lg tracking-widest text-black uppercase"
					>
						Order Summary
					</h2>

					<div class="mb-6 space-y-4 text-sm font-light">
						<div class="flex justify-between">
							<span class="text-gray-600">Subtotal</span>
							<span>{formatMoney(cart.subtotal)}</span>
						</div>
						{#if isGift}
							<div class="flex justify-between">
								<span class="text-gray-600">Gift Wrapping</span>
								<span>{formatMoney(giftWrapPrice)}</span>
							</div>
						{/if}
						<div class="flex justify-between">
							<span class="text-gray-600">Estimated Shipping</span>
							<span>{cart.subtotal > freeShippingThreshold ? 'Free' : formatMoney(shipping)}</span>
						</div>
					</div>

					<div class="mb-8 border-t border-gray-200 pt-6">
						<div class="flex items-end justify-between">
							<span class="text-base font-medium tracking-widest uppercase">Total</span>
							<span class="font-serif text-xl text-black">
								{formatMoney(
									cart.subtotal +
										(isGift ? giftWrapPrice : 0) +
										(cart.subtotal > freeShippingThreshold ? 0 : shipping)
								)}
							</span>
						</div>
						<p class="mt-2 text-right text-xs text-gray-500">Taxes calculated at checkout</p>
					</div>

					<a
						href="/checkout"
						class="mb-4 block w-full bg-black py-4 text-center text-sm tracking-widest text-white uppercase transition-colors hover:bg-gold"
					>
						Proceed to Checkout
					</a>

					<div class="flex items-center justify-center space-x-2 text-xs text-gray-400">
						<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.5"
								d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
							/></svg
						>
						<span>Secure Encrypted Checkout</span>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
