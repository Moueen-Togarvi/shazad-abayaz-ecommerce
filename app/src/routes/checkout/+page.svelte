<script lang="ts">
	import { cart } from '$lib/client/cart.svelte';
	import { cartPixelPayload, trackInitiateCheckout } from '$lib/client/pixels';
	import { cloudinaryUrl } from '$lib/shared/cloudinary-image';
	import { formatMoney } from '$lib/shared/money';
	import { SUPPORT_PHONE_DISPLAY } from '$lib/shared/seo';
	import { onMount } from 'svelte';

	type PaymentMethod = 'COD' | 'ADVANCE';

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
	let paymentMethod = $state<PaymentMethod>('COD');

	const codDeliveryCharges = [
		{ quantity: '1 piece', amount: 300, label: 'Rs. 300/-' },
		{ quantity: '2 pieces', amount: 400, label: 'Rs. 400/-' },
		{ quantity: '3 to 4 pieces', amount: 500, label: 'Rs. 500/-' },
		{ quantity: '5 to 7 pieces', amount: 700, label: 'Rs. 700/-' }
	];
	const getCodShippingCharge = (quantity: number) => {
		if (quantity <= 1) return 300;
		if (quantity === 2) return 400;
		if (quantity <= 4) return 500;
		if (quantity <= 7) return 700;
		return 700;
	};
	const cartJson = $derived(JSON.stringify(cart.items));
	const totalPieces = $derived(
		cart.items.reduce((total, item) => total + Math.max(1, Number(item.quantity || 0)), 0)
	);
	const codShippingTotal = $derived(getCodShippingCharge(totalPieces));
	const shippingTotal = $derived(paymentMethod === 'ADVANCE' ? 0 : codShippingTotal);
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

	const handlePlaceOrder = (event: SubmitEvent) => {
		if (!validateRequiredDetails()) {
			event.preventDefault();
			return;
		}

		checkoutError = '';
	};

	onMount(() => {
		if (!cart.items.length) return;

		trackInitiateCheckout(cartPixelPayload(cart.items, orderTotal));
	});
</script>

<svelte:head>
	<title>Checkout | Shahzad Abaya's</title>
</svelte:head>

<div class="min-h-screen bg-[linear-gradient(180deg,#f7f3ec_0%,#fbf9f5_36%,#f8f4ee_100%)]">
	<header class="border-b border-black/5 bg-white/80 py-4 backdrop-blur">
		<div class="mx-auto flex max-w-6xl justify-center px-4">
			<a href="/" class="font-serif text-xl tracking-[0.32em] uppercase sm:text-2xl">Shahzad Abaya's</a>
		</div>
	</header>

	<div class="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 md:flex-row md:gap-8 lg:py-10">
		<div class="w-full md:w-[64%] lg:w-[68%]">
			<nav class="mb-6 flex items-center gap-3 text-[11px] tracking-[0.24em] uppercase sm:mb-8">
				<a href="/cart" class="text-gray-400 hover:text-black">Cart</a>
				<span class="text-gray-300">/</span>
				<span class={step >= 1 ? 'font-semibold text-black' : 'text-gray-400'}>Information</span>
				<span class="text-gray-300">/</span>
				<span class={step >= 2 ? 'font-semibold text-black' : 'text-gray-400'}>
					Shipping & Payment
				</span>
			</nav>

			{#if form?.error || checkoutError}
				<div class="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm">
					{form?.error || checkoutError}
				</div>
			{/if}

			{#if step === 1}
				<div class="rounded-[1.75rem] border border-black/6 bg-white p-5 shadow-[0_20px_60px_rgba(35,28,20,0.06)] sm:p-7">
					<div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<p class="text-[11px] font-semibold tracking-[0.24em] text-[#9b7b42] uppercase">Step 1</p>
							<h2 class="mt-1 font-serif text-xl text-[#1d1814] sm:text-2xl">Contact & Address</h2>
						</div>
						<span class="text-xs text-gray-500 sm:text-sm">
							Already have an account? <a href="/login" class="text-black underline">Log in</a>
						</span>
					</div>
					<div class="mb-7">
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
							class="w-full rounded-2xl border-gray-200 px-4 py-3 text-sm shadow-sm transition-all duration-150 focus:border-black focus:ring-2 focus:ring-black/10"
						/>
						<label class="mt-3 flex cursor-pointer items-center space-x-2">
							<input
								type="checkbox"
								class="form-checkbox h-4 w-4 rounded-none border-gray-300 text-black focus:ring-black"
							/>
							<span class="text-xs text-gray-500">Email me with news and offers</span>
						</label>
					</div>

					<h2 class="mb-4 font-serif text-lg sm:text-xl">Shipping Address</h2>
					<div class="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
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
								class="w-full rounded-2xl border-gray-200 px-4 py-3 text-sm shadow-sm transition-all duration-150 focus:border-black focus:ring-2 focus:ring-black/10"
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
								class="w-full rounded-2xl border-gray-200 px-4 py-3 text-sm shadow-sm transition-all duration-150 focus:border-black focus:ring-2 focus:ring-black/10"
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
								class="w-full rounded-2xl border-gray-200 px-4 py-3 text-sm shadow-sm transition-all duration-150 focus:border-black focus:ring-2 focus:ring-black/10"
							/>
						</div>
						<input
							type="text"
							placeholder="Apartment, suite, etc. (optional)"
							bind:value={addressLine2}
							autocomplete="address-line2"
							class="col-span-2 rounded-2xl border-gray-200 px-4 py-3 text-sm shadow-sm transition-all duration-150 focus:border-black focus:ring-2 focus:ring-black/10"
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
								class="w-full rounded-2xl border-gray-200 px-4 py-3 text-sm shadow-sm transition-all duration-150 focus:border-black focus:ring-2 focus:ring-black/10"
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
								class="w-full rounded-2xl border-gray-200 px-4 py-3 text-sm shadow-sm transition-all duration-150 focus:border-black focus:ring-2 focus:ring-black/10"
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
								class="w-full rounded-2xl border-gray-200 px-4 py-3 text-sm shadow-sm transition-all duration-150 focus:border-black focus:ring-2 focus:ring-black/10"
							/>
						</div>
					</div>

					<div class="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
						<a href="/cart" class="flex items-center text-sm text-gray-500 transition-colors hover:text-black">
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
							class="inline-flex min-h-12 items-center justify-center rounded-2xl bg-black px-6 py-3 text-sm font-semibold tracking-[0.2em] text-white uppercase shadow-[0_16px_35px_rgba(0,0,0,0.16)] transition-all duration-150 hover:-translate-y-0.5 hover:bg-[#b9965b] active:translate-y-0"
							onclick={continueToShipping}
						>
							Continue
						</button>
					</div>
				</div>
			{:else}
				<form method="POST" action="?/placeOrder" onsubmit={handlePlaceOrder} class="rounded-[1.75rem] border border-black/6 bg-white p-5 shadow-[0_20px_60px_rgba(35,28,20,0.06)] sm:p-7">
					<input type="hidden" name="cartJson" value={cartJson} />
					<input type="hidden" name="email" value={email} />
					<input type="hidden" name="firstName" value={firstName} />
					<input type="hidden" name="lastName" value={lastName} />
					<input type="hidden" name="addressLine1" value={addressLine1} />
					<input type="hidden" name="addressLine2" value={addressLine2} />
					<input type="hidden" name="city" value={city} />
					<input type="hidden" name="postalCode" value={postalCode} />
					<input type="hidden" name="phone" value={phone} />
					<input type="hidden" name="shippingMethod" value="STANDARD" />

					<div class="mb-5">
						<p class="text-[11px] font-semibold tracking-[0.24em] text-[#9b7b42] uppercase">Step 2</p>
						<h2 class="mt-1 font-serif text-xl text-[#1d1814] sm:text-2xl">Shipping & Payment</h2>
						<p class="mt-2 text-sm leading-6 text-gray-500">
							Review your details, shipping charge, and COD confirmation info before placing the order.
						</p>
					</div>

					<div class="mb-6 rounded-2xl border border-gray-200 bg-[#fcfaf6] p-4 text-sm">
						<div class="mb-3 flex flex-col gap-2 border-b border-gray-200 pb-3 sm:flex-row sm:items-center sm:justify-between">
							<span class="text-gray-500">Contact</span>
							<span class="min-w-0 text-[#1d1814]">{email}</span>
							<button
								type="button"
								class="text-left text-xs font-semibold text-gray-500 underline transition-colors hover:text-black"
								onclick={() => (step = 1)}
							>
								Change
							</button>
						</div>
						<div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
							<span class="text-gray-500">Ship to</span>
							<span class="min-w-0 text-[#1d1814] sm:mx-4 sm:truncate sm:text-right">
								{addressLine1}, {city}
							</span>
							<button
								type="button"
								class="text-left text-xs font-semibold text-gray-500 underline transition-colors hover:text-black"
								onclick={() => (step = 1)}
							>
								Change
							</button>
						</div>
					</div>

					<div class="mb-6 grid gap-5 xl:grid-cols-[0.92fr_1.08fr]">
						<div>
							<h2 class="mb-3 font-serif text-lg sm:text-xl">Shipping Method</h2>
							<div class="rounded-2xl border border-gray-200 bg-white shadow-sm">
								<div class="flex items-center justify-between gap-3 p-4">
									<div class="flex items-center">
										<span class="inline-flex h-4 w-4 rounded-full border-4 border-black"></span>
										<div class="ml-3">
											<p class="text-sm font-semibold text-black">
												{paymentMethod === 'ADVANCE'
													? 'Free Shipping (Advance Payment)'
													: 'Cash on Delivery Shipping'}
											</p>
											<p class="text-xs text-gray-500">
												{totalPieces} {totalPieces === 1 ? 'piece' : 'pieces'} in cart
											</p>
										</div>
									</div>
									<span class="text-sm font-semibold">
										{shippingTotal === 0 ? 'Free' : formatMoney(shippingTotal)}
									</span>
								</div>
							</div>

							{#if paymentMethod === 'ADVANCE'}
								<div
									class="mt-4 rounded-2xl border border-[#cfe3d6] bg-[#f4faf6] p-4 shadow-[0_8px_24px_rgba(45,120,80,0.08)]"
								>
									<div class="flex items-start justify-between gap-3">
										<div>
											<p class="text-[11px] font-semibold tracking-[0.22em] text-[#3f7a56] uppercase">
												Advance Payment
											</p>
											<h3 class="mt-1 font-serif text-base text-[#1f1a17] sm:text-lg">
												Shipping is free on full advance payment
											</h3>
										</div>
										<span
											class="rounded-full bg-[#e3f3e9] px-3 py-1 text-[10px] font-semibold tracking-[0.16em] text-[#2f6b48] uppercase"
										>
											Free
										</span>
									</div>

									<p class="mt-3 text-sm leading-6 text-[#4f463d]">
										Pay the full order amount in advance and delivery is free — no shipping charges added.
									</p>
									<p class="mt-2 text-sm leading-6 text-[#4f463d]" dir="rtl">
										مکمل ایڈوانس ادائیگی پر ڈیلیوری بالکل مفت ہے۔
									</p>
								</div>
							{:else}
								<div
									class="mt-4 rounded-2xl border border-[#eadfce] bg-[#fcfaf6] p-4 shadow-[0_8px_24px_rgba(161,137,92,0.08)]"
								>
									<div class="flex items-start justify-between gap-3">
										<div>
											<p class="text-[11px] font-semibold tracking-[0.22em] text-[#9b7b42] uppercase">
												COD Confirmation
											</p>
											<h3 class="mt-1 font-serif text-base text-[#1f1a17] sm:text-lg">
												Advance delivery charges apply
											</h3>
										</div>
										<span
											class="rounded-full bg-[#f7efe1] px-3 py-1 text-[10px] font-semibold tracking-[0.16em] text-[#8b6a35] uppercase"
										>
											COD
										</span>
									</div>

									<p class="mt-3 text-sm leading-6 text-[#4f463d]">
										If you choose Cash on Delivery, order confirmation requires advance payment of delivery charges.
									</p>
									<p class="mt-2 text-sm leading-6 text-[#4f463d]" dir="rtl">
										اگر آپ COD منتخب کرتے ہیں تو آرڈر کنفرم کرنے کے لیے ڈیلیوری چارجز ایڈوانس میں جمع کروانا ضروری ہے۔
									</p>
									<p class="mt-3 text-sm leading-6 font-semibold text-[#4f463d]">
										Tip: Choose Advance Payment instead to get free shipping.
									</p>

									<div class="mt-4 grid gap-2 sm:grid-cols-2">
										{#each codDeliveryCharges as charge}
											<div class="flex items-center justify-between rounded-xl bg-white px-3 py-2 text-sm text-[#2f2924]">
												<span>{charge.quantity}</span>
												<span class="font-semibold">{charge.label}</span>
											</div>
										{/each}
									</div>
								</div>
							{/if}
						</div>

						<div>
							<h2 class="mb-3 font-serif text-lg sm:text-xl">Payment</h2>
							<div class="rounded-2xl border border-gray-200 bg-white shadow-sm">
								<div class="border-b border-gray-200">
									<label class="flex cursor-pointer items-center justify-between bg-gray-50 p-4 transition-colors hover:bg-[#faf7f0]">
										<div class="flex items-center">
											<input
												type="radio"
												name="paymentMethod"
												value="COD"
												bind:group={paymentMethod}
												class="form-radio h-4 w-4 border-gray-300 text-black focus:ring-black"
											/>
											<span class="ml-3 text-sm font-semibold">Cash on Delivery (COD)</span>
										</div>
									</label>
								</div>

								<div class="border-b border-gray-200">
									<label class="flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-[#f4faf6]">
										<div class="flex items-center">
											<input
												type="radio"
												name="paymentMethod"
												value="ADVANCE"
												bind:group={paymentMethod}
												class="form-radio h-4 w-4 border-gray-300 text-black focus:ring-black"
											/>
											<span class="ml-3 text-sm font-semibold">Advance Payment (Bank / Easypaisa)</span>
										</div>
										<span class="rounded-full bg-[#e3f3e9] px-2.5 py-1 text-[10px] font-bold tracking-[0.14em] text-[#2f6b48] uppercase">
											Free shipping
										</span>
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
										<div class="rounded-full bg-gray-200 px-2.5 py-1 text-[10px] font-bold tracking-[0.14em] text-gray-600 uppercase">
											Coming soon
										</div>
									</label>
								</div>
							</div>

							{#if paymentMethod === 'ADVANCE'}
							<div class="mt-4 rounded-2xl border border-[#cfe3d6] bg-[#fbfffc] p-4 shadow-[0_10px_30px_rgba(45,120,80,0.08)] sm:p-5">
								<div class="mb-4 flex items-start justify-between gap-3">
									<div>
										<p class="text-[11px] font-semibold tracking-[0.22em] text-[#3f7a56] uppercase">
											Online Order Policy
										</p>
										<h3 class="mt-1 font-serif text-base text-[#1f1a17] sm:text-lg">Advance Payment Details</h3>
									</div>
									<span class="rounded-full bg-[#e3f3e9] px-3 py-1 text-[10px] font-semibold tracking-[0.16em] text-[#2f6b48] uppercase">
										Free shipping
									</span>
								</div>

								<div class="grid gap-4">
									<div class="rounded-xl border border-[#eee6d9] bg-white p-4">
										<h4 class="text-[11px] font-semibold tracking-[0.18em] text-[#7c6244] uppercase">
											Payment Methods
										</h4>
										<div class="mt-3 space-y-3 text-sm text-[#2f2924]">
											<div>
												<p class="font-semibold">Meezan Bank</p>
												<p class="mt-1 text-[#5f554c]">Account Title: Hassan Shahzad</p>
												<p class="text-[#5f554c]">Account No: 52010107846427</p>
											</div>
											<div class="h-px bg-[#efe6d8]"></div>
											<div>
												<p class="font-semibold">Easypaisa</p>
												<p class="mt-1 text-[#5f554c]">Account Title: Abdul Hanan Ali</p>
												<p class="text-[#5f554c]">Account No: 03129996424</p>
											</div>
										</div>
									</div>

									<div class="rounded-xl border border-[#f1dfc2] bg-[#fff8ec] p-4">
										<p class="text-[11px] font-semibold tracking-[0.18em] text-[#9a7330] uppercase">
											Note
										</p>
										<div class="mt-2 space-y-2 text-sm leading-6 text-[#55483b]">
											<p>Order confirm karne ke liye upar diye gaye kisi bhi account mein poori payment zaroor share karein.</p>
											<p>
												Payment bhejne ke baad screenshot WhatsApp par send karein:
												<span class="font-semibold">{SUPPORT_PHONE_DISPLAY}</span>
											</p>
											<p dir="rtl">بغیر ایڈوانس ادائیگی کے آرڈر کنفرم نہیں ہوگا۔</p>
											<p dir="rtl">
												ادائیگی کے بعد اسکرین شاٹ واٹس ایپ نمبر
												<span class="font-semibold">{SUPPORT_PHONE_DISPLAY}</span>
												پر بھیج دیں۔
											</p>
										</div>
									</div>
								</div>
							</div>
							{/if}
						</div>
					</div>
					<div class="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
						<button
							type="button"
							class="flex items-center text-sm text-gray-500 transition-colors hover:text-black"
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
							type="submit"
							disabled={cart.items.length === 0}
							class="inline-flex min-h-12 items-center justify-center rounded-2xl bg-black px-6 py-3 text-sm font-semibold tracking-[0.2em] text-white uppercase shadow-[0_16px_35px_rgba(0,0,0,0.16)] transition-all duration-150 hover:-translate-y-0.5 hover:bg-[#b9965b] active:translate-y-0 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
						>
							Complete order
						</button>
					</div>
				</form>
			{/if}
		</div>

		<div
			class="h-fit w-full rounded-[1.6rem] border border-black/8 bg-white p-4 shadow-[0_18px_50px_rgba(35,28,20,0.07)] md:sticky md:top-6 md:w-[36%] md:p-5 lg:w-[32%]"
		>
			{#if cart.items.length === 0}
				<div class="mb-5 rounded-2xl border border-gray-200 p-4 text-sm text-gray-500">
					Your bag is empty. Add a product before checkout.
				</div>
			{:else}
				{#each cart.items as item}
					<div class="mb-4 flex items-center rounded-2xl border border-black/6 bg-[#fcfaf6] p-3">
						<div class="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-100 sm:h-16 sm:w-16">
							<img
								src={cloudinaryUrl(item.image, 160)}
								alt={item.name}
								width="64"
								height="64"
								loading="lazy"
								decoding="async"
								class="h-full w-full object-cover"
							/>
							<span
								class="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-500 text-[10px] text-white"
							>
								{item.quantity}
							</span>
						</div>
						<div class="ml-4 flex-grow">
							<h4 class="font-serif text-sm leading-5">{item.name}</h4>
							<div
								class="mt-2 flex flex-wrap gap-1.5 text-[10px] font-bold tracking-wide uppercase"
							>
								{#if item.color && item.color !== 'Default'}<span
										class="rounded-full bg-white px-2 py-1 text-gray-600 ring-1 ring-black/8"
										>Colour · {item.color}</span
									>{/if}
								{#if item.size && item.size !== 'One Size'}<span
										class="rounded-full bg-black px-2 py-1 text-white">Size · {item.size}</span
									>{/if}
							</div>
						</div>
						<span class="ml-4 text-right text-sm font-medium"
							>{formatMoney(item.price * item.quantity)}</span
						>
					</div>
				{/each}
			{/if}

			<div class="mb-4 flex gap-2 border-y border-gray-200 py-4">
				<input
					type="text"
					placeholder="Gift card or discount code"
					class="min-w-0 flex-grow rounded-2xl border-gray-200 px-3 py-2.5 text-sm focus:border-black focus:ring-2 focus:ring-black/10"
				/>
				<button
					type="button"
					class="rounded-2xl bg-gray-200 px-4 text-xs font-semibold tracking-[0.16em] text-gray-600 uppercase transition-all duration-150 hover:bg-gray-300"
				>
					Apply
				</button>
			</div>

			<div class="mb-6 space-y-3 border-b border-gray-200 pb-4 text-sm font-light">
				<div class="flex justify-between">
					<span class="text-gray-600">Subtotal</span>
					<span class="font-medium text-black">{formatMoney(cart.subtotal)}</span>
				</div>
				<div class="flex justify-between gap-3">
					<span class="text-gray-600">Shipping</span>
					<span class="text-sm font-medium text-black">
						{shippingTotal === 0 ? 'Free' : formatMoney(shippingTotal)}
					</span>
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
