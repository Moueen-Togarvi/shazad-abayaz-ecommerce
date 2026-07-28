<svelte:head>
	<title>Returns & Exchanges | Abayiza</title>
	<meta
		name="description"
		content="Learn Abayiza return and exchange rules, eligibility, timelines, and how to request help for your abaya order."
	/>
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-20 lg:px-8">
	<div class="mb-12 text-center">
		<h1 class="mb-4 font-serif text-3xl tracking-widest text-black uppercase md:text-4xl">
			Returns & Exchanges
		</h1>
		<div class="mx-auto h-[1px] w-12 bg-gold"></div>
	</div>

	<div class="prose max-w-none space-y-10 leading-relaxed font-light text-gray-700 prose-gray">
		<section>
			<h2 class="not-prose mb-4 font-serif text-lg tracking-widest text-black uppercase">
				Our Promise
			</h2>
			<p>
				We want you to love every piece from Abayiza. If for any reason you are not completely
				satisfied with your purchase, we are here to help. We accept returns and exchanges within <strong
					class="font-medium text-black">14 days</strong
				> of your delivery date.
			</p>
		</section>

		<section class="border-t border-gray-100 pt-8">
			<h2 class="not-prose mb-4 font-serif text-lg tracking-widest text-black uppercase">
				Eligibility for Returns
			</h2>
			<p class="mb-4">To be eligible for a return, your item must meet the following conditions:</p>
			<ul class="not-prose space-y-3">
				{#each ['Item must be unworn, unwashed, and in its original condition', 'All original tags must still be attached to the garment', 'Item must be returned in its original packaging', 'A valid proof of purchase (order confirmation) must be provided', 'Return request must be initiated within 14 days of delivery'] as condition}
					<li class="flex items-start">
						<svg
							class="mt-0.5 mr-3 h-5 w-5 flex-shrink-0 text-gold"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M5 13l4 4L19 7"
							/></svg
						>
						<span class="text-sm text-gray-600">{condition}</span>
					</li>
				{/each}
			</ul>
		</section>

		<section class="border-t border-gray-100 pt-8">
			<h2 class="not-prose mb-4 font-serif text-lg tracking-widest text-black uppercase">
				Non-Returnable Items
			</h2>
			<p class="mb-4">
				The following items are <strong class="font-medium text-black">final sale</strong> and cannot
				be returned or exchanged:
			</p>
			<ul class="not-prose space-y-3">
				{#each ['Custom or personalised orders', 'Items purchased during a Final Sale event', 'Accessories including hijabs, pins, and pouches', 'Items that have been worn, washed, or altered', 'Gift cards'] as item}
					<li class="flex items-start">
						<svg
							class="mt-0.5 mr-3 h-5 w-5 flex-shrink-0 text-red-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/></svg
						>
						<span class="text-sm text-gray-600">{item}</span>
					</li>
				{/each}
			</ul>
		</section>

		<section class="border-t border-gray-100 pt-8">
			<h2 class="not-prose mb-4 font-serif text-lg tracking-widest text-black uppercase">
				How to Initiate a Return
			</h2>
			<div class="not-prose grid grid-cols-1 gap-6 sm:grid-cols-3">
				{#each [{ step: '01', title: 'Contact Us', desc: 'Email support@abayiza.com or WhatsApp us with your order number and reason for return.' }, { step: '02', title: 'Ship Item Back', desc: 'Pack your item securely and ship it to our returns address. You are responsible for return shipping costs.' }, { step: '03', title: 'Refund Processed', desc: 'Once we receive and inspect your return, your refund will be processed within 5–7 business days.' }] as item}
					<div class="border border-gray-200 bg-cream p-6 text-center">
						<div class="mb-3 font-serif text-3xl text-gold">{item.step}</div>
						<h3 class="mb-2 text-sm font-bold tracking-widest text-black uppercase">
							{item.title}
						</h3>
						<p class="text-sm leading-relaxed font-light text-gray-500">{item.desc}</p>
					</div>
				{/each}
			</div>
		</section>

		<section class="border-t border-gray-100 pt-8">
			<h2 class="not-prose mb-4 font-serif text-lg tracking-widest text-black uppercase">
				Refund Policy
			</h2>
			<p>
				Refunds will be issued to your original payment method. Please allow <strong
					class="font-medium text-black">5–10 business days</strong
				> for the funds to appear in your account after the refund has been processed. Shipping costs
				are non-refundable unless the item was received damaged or defective.
			</p>
		</section>

		<section class="not-prose border-t border-gray-100 bg-cream p-6 pt-8">
			<div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
				<div>
					<h3 class="mb-1 text-sm font-bold tracking-widest text-black uppercase">
						Have a Question?
					</h3>
					<p class="text-sm font-light text-gray-500">Our team is here to help with your return.</p>
				</div>
				<a
					href="/contact"
					class="bg-black px-8 py-3 text-sm tracking-widest whitespace-nowrap text-white uppercase transition-colors hover:bg-gold"
				>
					Contact Support
				</a>
			</div>
		</section>
	</div>
</div>
