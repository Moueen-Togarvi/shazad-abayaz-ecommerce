<svelte:head>
	<title>My Account | Abayiza</title>
</svelte:head>

<div class="mx-auto max-w-5xl px-4 py-12 sm:px-6 md:py-20 lg:px-8">
	<div class="mb-12 text-center">
		<h1 class="mb-4 font-serif text-3xl tracking-widest text-black uppercase md:text-4xl">
			My Account
		</h1>
		<div class="mx-auto h-[1px] w-12 bg-gold"></div>
	</div>

	<div class="grid gap-6 md:grid-cols-3">
		<section class="border border-gray-200 bg-white p-6 md:col-span-2">
			<h2 class="mb-3 font-serif text-xl text-black">No customer session is active</h2>
			<p class="text-sm leading-6 font-light text-gray-600">
				Order history, addresses, and profile details will show here after customer login is wired
				to the database. This page now avoids showing sample customer records.
			</p>
			<div class="mt-6 flex flex-col gap-3 sm:flex-row">
				<a
					href="/login"
					class="inline-flex justify-center bg-black px-8 py-3 text-sm tracking-widest text-white uppercase transition-colors hover:bg-gold"
				>
					Log In
				</a>
				<a
					href="/shop"
					class="inline-flex justify-center border border-black px-8 py-3 text-sm tracking-widest text-black uppercase transition-colors hover:bg-gray-50"
				>
					Shop Collection
				</a>
			</div>
		</section>

		<aside class="border border-gray-200 bg-gray-50 p-6">
			<h3 class="mb-3 text-sm font-bold tracking-widest text-black uppercase">Need help?</h3>
			<p class="mb-5 text-sm leading-6 font-light text-gray-600">
				Use WhatsApp for real order support and product availability.
			</p>
			<a
				href="https://wa.me/923116857822"
				target="_blank"
				rel="noreferrer"
				class="text-sm font-medium tracking-widest text-green-700 uppercase hover:text-green-800"
			>
				Contact Abayiza
			</a>
			<a
				href="https://wa.me/923346657779"
				target="_blank"
				rel="noreferrer"
				class="mt-3 block text-sm font-medium tracking-widest text-green-700 uppercase hover:text-green-800"
			>
				Contact Abayiza 2
			</a>
		</aside>
	</div>
</div>
