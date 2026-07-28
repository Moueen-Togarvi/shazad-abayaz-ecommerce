<svelte:head>
	<title>Shipping Information | Abayiza</title>
	<meta
		name="description"
		content="Read Abayiza shipping options, delivery timelines, domestic and international shipping details, and free delivery rules."
	/>
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-20 lg:px-8">
	<div class="mb-12 text-center">
		<h1 class="mb-4 font-serif text-3xl tracking-widest text-black uppercase md:text-4xl">
			Shipping Information
		</h1>
		<div class="mx-auto h-[1px] w-12 bg-gold"></div>
	</div>

	<div class="space-y-10 leading-relaxed font-light text-gray-700">
		<!-- Shipping Methods Table -->
		<section>
			<h2 class="mb-6 font-serif text-lg tracking-widest text-black uppercase">Shipping Options</h2>
			<div class="overflow-x-auto">
				<table class="w-full border-collapse text-sm">
					<thead>
						<tr class="bg-black text-white">
							<th class="px-5 py-3 text-left text-xs font-medium tracking-widest uppercase"
								>Method</th
							>
							<th class="px-5 py-3 text-left text-xs font-medium tracking-widest uppercase"
								>Delivery Time</th
							>
							<th class="px-5 py-3 text-left text-xs font-medium tracking-widest uppercase">Cost</th
							>
						</tr>
					</thead>
					<tbody>
						{#each [{ method: 'Standard Shipping', time: '5-7 Business Days', cost: 'Rs. 300 (Free over Rs. 15,000)' }, { method: 'DHL Express', time: '2-3 Business Days', cost: 'Rs. 1,200' }, { method: 'Overnight (Domestic)', time: '1 Business Day', cost: 'Confirmed on WhatsApp' }, { method: 'International Standard', time: '10–15 Business Days', cost: 'Calculated at checkout' }, { method: 'International Express', time: '5–7 Business Days', cost: 'Calculated at checkout' }] as row, i}
							<tr class="{i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-b border-gray-100">
								<td class="px-5 py-4 font-medium text-black">{row.method}</td>
								<td class="px-5 py-4 text-gray-600">{row.time}</td>
								<td class="px-5 py-4 text-gray-600">{row.cost}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			<p class="mt-3 text-xs text-gray-400">
				*All orders placed before 2:00 PM GST are processed same day (Mon–Fri, excluding public
				holidays).
			</p>
		</section>

		<section class="border-t border-gray-100 pt-8">
			<h2 class="mb-4 font-serif text-lg tracking-widest text-black uppercase">Free Shipping</h2>
			<p>
				Enjoy complimentary standard shipping on all orders over <strong
					class="font-medium text-black">Rs. 15,000 PKR</strong
				>. This offer applies automatically at checkout. Free shipping is valid on domestic orders
				only.
			</p>
		</section>

		<section class="border-t border-gray-100 pt-8">
			<h2 class="mb-4 font-serif text-lg tracking-widest text-black uppercase">
				International Shipping
			</h2>
			<p class="mb-4">
				We ship to over 50 countries worldwide. International orders may be subject to customs
				duties and import taxes, which are the responsibility of the recipient. We are not
				responsible for delays caused by customs processing.
			</p>
			<div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
				{#each ['United Arab Emirates', 'Saudi Arabia', 'Pakistan', 'United Kingdom', 'United States', 'Canada', 'Australia', 'Germany'] as country}
					<div class="border border-gray-200 bg-cream p-3 text-center">
						<p class="text-xs font-medium text-black">{country}</p>
					</div>
				{/each}
			</div>
			<p class="mt-3 text-xs text-gray-400">
				And 40+ more countries. Shipping availability is confirmed at checkout.
			</p>
		</section>

		<section class="border-t border-gray-100 pt-8">
			<h2 class="mb-4 font-serif text-lg tracking-widest text-black uppercase">Order Tracking</h2>
			<p>
				Once your order has shipped, you will receive an email containing your tracking number. You
				can track your shipment at any time using our <a
					href="/track"
					class="text-black underline transition-colors hover:text-gold">Order Tracking</a
				> page or directly on the carrier's website.
			</p>
		</section>

		<section class="border-t border-gray-100 bg-cream p-6 pt-8">
			<div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
				<div>
					<h3 class="mb-1 text-sm font-bold tracking-widest text-black uppercase">
						Questions About Your Shipment?
					</h3>
					<p class="text-sm font-light text-gray-500">We're here to help every step of the way.</p>
				</div>
				<div class="flex gap-3">
					<a
						href="/track"
						class="border border-black px-6 py-3 text-sm tracking-widest whitespace-nowrap text-black uppercase transition-colors hover:bg-gray-50"
						>Track Order</a
					>
					<a
						href="/contact"
						class="bg-black px-6 py-3 text-sm tracking-widest whitespace-nowrap text-white uppercase transition-colors hover:bg-gold"
						>Contact Us</a
					>
				</div>
			</div>
		</section>
	</div>
</div>
