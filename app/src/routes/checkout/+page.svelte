<script lang="ts">
	import { cart } from '$lib/client/cart.svelte';
	import { cartPixelPayload, trackInitiateCheckout } from '$lib/client/pixels';
	import { formatMoney } from '$lib/shared/money';
	import { onMount } from 'svelte';

	type PaymentMethod = 'COD';
	type ShippingMethod = 'STANDARD' | 'EXPRESS';

	let { form } = $props();

	let step = $state(1);
	let checkoutError = $state('');
	let email = $state('');
	let firstName = $state('');
	let lastName = $state('');
	let addressLine1 = $state('');
	let addressLine2 = $state('');
	let city = $state('');
	let postalCode = $state('');
	let phone = $state('');
	let shippingMethod = $state<ShippingMethod>('STANDARD');
	let paymentMethod = $state<PaymentMethod>('COD');

	const expressShipping = 1200;
	const cartJson = $derived(JSON.stringify(cart.items));
	const shippingTotal = $derived(shippingMethod === 'EXPRESS' ? expressShipping : 0);
	const orderTotal = $derived(cart.subtotal + shippingTotal);

	const validateRequiredDetails = () => {
		if (
			!email.trim() ||
			!firstName.trim() ||
			!lastName.trim() ||
			!addressLine1.trim() ||
			!city.trim() ||
			!postalCode.trim() ||
			!phone.trim()
		) {
			checkoutError =
				'Please fill all required fields: email, address, city, postal code, and mobile number.';
			step = 1;
			return false;
		}

		checkoutError = '';
		return true;
	};

	const continueToShipping = () => {
		if (!validateRequiredDetails()) return;

		step = 2;
	};

	const continueToPayment = () => {
		if (!validateRequiredDetails()) return;

		checkoutError = '';
		step = 3;
	};

	const handlePlaceOrder = (event: SubmitEvent) => {
		if (!validateRequiredDetails()) {
			event.preventDefault();
		}
	};

	onMount(() => {
		if (!cart.items.length) return;

		trackInitiateCheckout(cartPixelPayload(cart.items, orderTotal));
	});
</script>

<svelte:head>
	<title>Checkout | Abayiza</title>
</svelte:head>

<div class="min-h-screen bg-cream">
	<header class="border-b border-gray-200 py-6">
		<div class="mx-auto flex max-w-4xl justify-center px-4">
			<a href="/" class="font-serif text-2xl tracking-widest uppercase">Abayiza</a>
		</div>
	</header>

	<div class="mx-auto flex max-w-4xl flex-col gap-12 px-4 py-10 md:flex-row">
		<div class="w-full md:w-3/5">
			<nav class="mb-10 flex items-center text-xs tracking-widest uppercase">
				<a href="/cart" class="text-gray-400 hover:text-black">Cart</a>
				<svg
					class="mx-2 h-3 w-3 text-gray-300"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
				<span class={step >= 1 ? 'font-medium text-black' : 'text-gray-400'}>Information</span>
				<svg
					class="mx-2 h-3 w-3 text-gray-300"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
				<span class={step >= 2 ? 'font-medium text-black' : 'text-gray-400'}>Shipping</span>
				<svg
					class="mx-2 h-3 w-3 text-gray-300"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
				<span class={step >= 3 ? 'font-medium text-black' : 'text-gray-400'}>Payment</span>
			</nav>

			{#if form?.error || checkoutError}
				<div class="mb-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
					{form?.error || checkoutError}
				</div>
			{/if}

			{#if step === 1}
				<div>
					<div class="mb-4 flex items-center justify-between gap-4">
						<h2 class="font-serif text-xl">Contact Information</h2>
						<span class="text-sm font-light text-gray-500">
							Already have an account? <a href="/login" class="text-black underline">Log in</a>
						</span>
					</div>
					<div class="mb-8">
						<label
							for="checkout-email"
							class="mb-1 block text-xs font-bold tracking-[0.08em] text-gray-700 uppercase"
						>
							Email <span class="text-red-600">*</span>
						</label>
						<input
							id="checkout-email"
							type="email"
							placeholder="Email"
							bind:value={email}
							required
							autocomplete="email"
							class="w-full rounded-none border-gray-300 p-3 text-sm focus:border-black focus:ring-black"
						/>
						<label class="mt-3 flex cursor-pointer items-center space-x-2">
							<input
								type="checkbox"
								class="form-checkbox h-4 w-4 rounded-none border-gray-300 text-black focus:ring-black"
							/>
							<span class="text-xs text-gray-500">Email me with news and offers</span>
						</label>
					</div>

					<h2 class="mb-4 font-serif text-xl">Shipping Address</h2>
					<div class="mb-6 grid grid-cols-2 gap-4">
						<div class="col-span-2 md:col-span-1">
							<label
								for="checkout-first-name"
								class="mb-1 block text-xs font-bold tracking-[0.08em] text-gray-700 uppercase"
							>
								First name <span class="text-red-600">*</span>
							</label>
							<input
								id="checkout-first-name"
								type="text"
								placeholder="First name"
								bind:value={firstName}
								required
								autocomplete="given-name"
								class="w-full rounded-none border-gray-300 p-3 text-sm focus:border-black focus:ring-black"
							/>
						</div>
						<div class="col-span-2 md:col-span-1">
							<label
								for="checkout-last-name"
								class="mb-1 block text-xs font-bold tracking-[0.08em] text-gray-700 uppercase"
							>
								Last name <span class="text-red-600">*</span>
							</label>
							<input
								id="checkout-last-name"
								type="text"
								placeholder="Last name"
								bind:value={lastName}
								required
								autocomplete="family-name"
								class="w-full rounded-none border-gray-300 p-3 text-sm focus:border-black focus:ring-black"
							/>
						</div>
						<div class="col-span-2">
							<label
								for="checkout-address"
								class="mb-1 block text-xs font-bold tracking-[0.08em] text-gray-700 uppercase"
							>
								Address <span class="text-red-600">*</span>
							</label>
							<input
								id="checkout-address"
								type="text"
								placeholder="Address"
								bind:value={addressLine1}
								required
								autocomplete="address-line1"
								class="w-full rounded-none border-gray-300 p-3 text-sm focus:border-black focus:ring-black"
							/>
						</div>
						<input
							type="text"
							placeholder="Apartment, suite, etc. (optional)"
							bind:value={addressLine2}
							autocomplete="address-line2"
							class="col-span-2 rounded-none border-gray-300 p-3 text-sm focus:border-black focus:ring-black"
						/>
						<div class="col-span-2 md:col-span-1">
							<label
								for="checkout-city"
								class="mb-1 block text-xs font-bold tracking-[0.08em] text-gray-700 uppercase"
							>
								City <span class="text-red-600">*</span>
							</label>
							<input
								id="checkout-city"
								type="text"
								placeholder="City"
								bind:value={city}
								required
								autocomplete="address-level2"
								class="w-full rounded-none border-gray-300 p-3 text-sm focus:border-black focus:ring-black"
							/>
						</div>
						<div class="col-span-2 md:col-span-1">
							<label
								for="checkout-postal-code"
								class="mb-1 block text-xs font-bold tracking-[0.08em] text-gray-700 uppercase"
							>
								Postal code <span class="text-red-600">*</span>
							</label>
							<input
								id="checkout-postal-code"
								type="text"
								placeholder="Postal code"
								bind:value={postalCode}
								required
								autocomplete="postal-code"
								class="w-full rounded-none border-gray-300 p-3 text-sm focus:border-black focus:ring-black"
							/>
						</div>
						<div class="col-span-2">
							<label
								for="checkout-phone"
								class="mb-1 block text-xs font-bold tracking-[0.08em] text-gray-700 uppercase"
							>
								Mobile number <span class="text-red-600">*</span>
							</label>
							<input
								id="checkout-phone"
								type="tel"
								placeholder="Mobile number"
								bind:value={phone}
								required
								autocomplete="tel"
								class="w-full rounded-none border-gray-300 p-3 text-sm focus:border-black focus:ring-black"
							/>
						</div>
					</div>

					<div class="flex items-center justify-between pt-4">
						<a href="/cart" class="flex items-center text-sm text-gray-500 hover:text-black">
							<svg class="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15 19l-7-7 7-7"
								/>
							</svg>
							Return to cart
						</a>
						<button
							type="button"
							class="bg-black px-8 py-4 text-sm tracking-widest text-white uppercase transition-colors hover:bg-gold"
							onclick={continueToShipping}
						>
							Continue to shipping
						</button>
					</div>
				</div>
			{:else if step === 2}
				<div>
					<div class="mb-8 rounded-none border border-gray-200 p-4 text-sm font-light">
						<div class="mb-3 flex justify-between border-b border-gray-100 pb-3">
							<span class="text-gray-500">Contact</span>
							<span>{email}</span>
							<button
								type="button"
								class="text-xs text-gray-400 underline"
								onclick={() => (step = 1)}
							>
								Change
							</button>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-500">Ship to</span>
							<span class="mx-4 truncate text-right">{addressLine1}, {city}</span>
							<button
								type="button"
								class="text-xs text-gray-400 underline"
								onclick={() => (step = 1)}
							>
								Change
							</button>
						</div>
					</div>

					<h2 class="mb-4 font-serif text-xl">Shipping Method</h2>
					<div class="mb-8 divide-y divide-gray-100 rounded-none border border-gray-200">
						<label class="flex cursor-pointer items-center justify-between p-4 hover:bg-gray-50">
							<div class="flex items-center">
								<input
									type="radio"
									bind:group={shippingMethod}
									value="STANDARD"
									class="form-radio h-4 w-4 border-gray-300 text-black focus:ring-black"
								/>
								<span class="ml-3 text-sm">Standard Shipping (5-7 Business Days)</span>
							</div>
							<span class="text-sm font-medium">Free</span>
						</label>
						<label class="flex cursor-pointer items-center justify-between p-4 hover:bg-gray-50">
							<div class="flex items-center">
								<input
									type="radio"
									bind:group={shippingMethod}
									value="EXPRESS"
									class="form-radio h-4 w-4 border-gray-300 text-black focus:ring-black"
								/>
								<span class="ml-3 text-sm">DHL Express (2-3 Business Days)</span>
							</div>
							<span class="text-sm font-medium">{formatMoney(expressShipping)}</span>
						</label>
					</div>

					<div class="flex items-center justify-between pt-4">
						<button
							type="button"
							class="flex items-center text-sm text-gray-500 hover:text-black"
							onclick={() => (step = 1)}
						>
							<svg class="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15 19l-7-7 7-7"
								/>
							</svg>
							Return to information
						</button>
						<button
							type="button"
							class="bg-black px-8 py-4 text-sm tracking-widest text-white uppercase transition-colors hover:bg-gold"
							onclick={continueToPayment}
						>
							Continue to payment
						</button>
					</div>
				</div>
			{:else}
				<form method="POST" action="?/placeOrder" onsubmit={handlePlaceOrder}>
					<input type="hidden" name="cartJson" value={cartJson} />
					<input type="hidden" name="email" value={email} />
					<input type="hidden" name="firstName" value={firstName} />
					<input type="hidden" name="lastName" value={lastName} />
					<input type="hidden" name="addressLine1" value={addressLine1} />
					<input type="hidden" name="addressLine2" value={addressLine2} />
					<input type="hidden" name="city" value={city} />
					<input type="hidden" name="postalCode" value={postalCode} />
					<input type="hidden" name="phone" value={phone} />
					<input type="hidden" name="shippingMethod" value={shippingMethod} />

					<h2 class="mb-2 font-serif text-xl">Payment</h2>
					<p class="mb-6 text-sm font-light text-gray-500">
						All transactions are secure and encrypted.
					</p>

					<div class="mb-8 rounded-none border border-gray-200">
						<div class="border-b border-gray-200">
							<label
								class="flex cursor-pointer items-center justify-between bg-gray-50 p-4 hover:bg-gray-50"
							>
								<div class="flex items-center">
									<input
										type="radio"
										name="paymentMethod"
										value="COD"
										bind:group={paymentMethod}
										class="form-radio h-4 w-4 border-gray-300 text-black focus:ring-black"
									/>
									<span class="ml-3 text-sm font-medium">Cash on Delivery (COD)</span>
								</div>
							</label>
						</div>

						<div>
							<label class="flex cursor-not-allowed items-center justify-between p-4 opacity-55">
								<div class="flex items-center">
									<input
										type="radio"
										value="JAZZCASH"
										disabled
										class="form-radio h-4 w-4 border-gray-300 text-black focus:ring-black"
									/>
									<span class="ml-3 text-sm font-medium">JazzCash</span>
								</div>
								<div class="rounded-sm bg-gray-200 px-2 py-1 text-xs font-bold text-gray-600">
									Coming soon
								</div>
							</label>
						</div>

						<div
							class="border-t border-gray-100 bg-white p-6 text-center text-sm font-light text-gray-500"
						>
							Pay with cash upon delivery.
						</div>
					</div>

					<div class="flex items-center justify-between pt-4">
						<button
							type="button"
							class="flex items-center text-sm text-gray-500 hover:text-black"
							onclick={() => (step = 2)}
						>
							<svg class="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15 19l-7-7 7-7"
								/>
							</svg>
							Return to shipping
						</button>
						<button
							type="submit"
							disabled={cart.items.length === 0}
							class="bg-black px-8 py-4 text-sm tracking-widest text-white uppercase transition-colors hover:bg-gold disabled:cursor-not-allowed disabled:bg-gray-300"
						>
							Complete order
						</button>
					</div>
				</form>
			{/if}
		</div>

		<div class="w-full border-l border-gray-200 md:w-2/5 md:pl-10">
			{#if cart.items.length === 0}
				<div class="mb-6 rounded border border-gray-200 p-4 text-sm text-gray-500">
					Your bag is empty. Add a product before checkout.
				</div>
			{:else}
				{#each cart.items as item}
					<div class="mb-6 flex items-center">
						<div class="relative h-16 w-16 flex-shrink-0 border border-gray-200 bg-gray-100">
							<img src={item.image} alt={item.name} class="h-full w-full object-cover" />
							<span
								class="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-500 text-[10px] text-white"
							>
								{item.quantity}
							</span>
						</div>
						<div class="ml-4 flex-grow">
							<h4 class="font-serif text-sm">{item.name}</h4>
							<p class="text-xs font-light text-gray-500">
								{[item.color, item.size].filter(Boolean).join(' / ')}
							</p>
						</div>
						<span class="ml-4 text-right text-sm font-medium"
							>{formatMoney(item.price * item.quantity)}</span
						>
					</div>
				{/each}
			{/if}

			<div class="mb-4 flex space-x-2 border-y border-gray-200 py-4">
				<input
					type="text"
					placeholder="Gift card or discount code"
					class="flex-grow rounded-none border-gray-300 p-3 text-sm focus:border-black focus:ring-black"
				/>
				<button
					type="button"
					class="bg-gray-200 px-4 text-sm font-medium tracking-widest text-gray-500 uppercase transition-colors hover:bg-gray-300"
				>
					Apply
				</button>
			</div>

			<div class="mb-6 space-y-3 border-b border-gray-200 pb-4 text-sm font-light">
				<div class="flex justify-between">
					<span class="text-gray-600">Subtotal</span>
					<span class="font-medium text-black">{formatMoney(cart.subtotal)}</span>
				</div>
				<div class="flex justify-between">
					<span class="text-gray-600">Shipping</span>
					<span class="text-xs text-gray-500"
						>{step >= 2 ? formatMoney(shippingTotal) : 'Calculated at next step'}</span
					>
				</div>
			</div>

			<div class="flex items-end justify-between">
				<span class="text-base font-medium tracking-widest text-black uppercase">Total</span>
				<div class="flex items-center">
					<span class="mr-2 text-xs text-gray-500">PKR</span>
					<span class="font-serif text-2xl text-black">{formatMoney(orderTotal)}</span>
				</div>
			</div>
		</div>
	</div>
</div>
