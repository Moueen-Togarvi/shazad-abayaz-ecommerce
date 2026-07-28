<script lang="ts">
	import { page } from '$app/state';
	import { SITE_NAME, absoluteUrl, jsonLdScript } from '$lib/shared/seo';

	let openFaq = $state(0);
	const contactDescription =
		'Contact Abayiza for abaya sizing help, order questions, WhatsApp support, and modest styling advice.';

	const faqs = [
		{
			question: 'What is your return policy?',
			answer:
				'We accept returns within 14 days of delivery for unworn, unwashed items with original tags attached. Please note that custom or personalized items are final sale.'
		},
		{
			question: 'How long does shipping take?',
			answer:
				'Standard shipping takes 5-7 business days. Express shipping via DHL takes 2-3 business days. International shipping times vary by location.'
		},
		{
			question: 'Do you offer custom sizing?',
			answer:
				'Yes, we offer custom sizing for an additional fee on select styles. Please contact our support team via WhatsApp before placing your order.'
		},
		{
			question: 'How do I care for my abaya?',
			answer:
				'We recommend dry cleaning for our silk and premium Nida fabrics to maintain their drape and quality. Hand washing in cold water with mild detergent is suitable for everyday pieces.'
		}
	];

	let contactJsonLd = $derived(
		jsonLdScript([
			{
				'@context': 'https://schema.org',
				'@type': 'ContactPage',
				name: `Contact Us | ${SITE_NAME}`,
				description: contactDescription,
				url: absoluteUrl('/contact', page.url.origin)
			},
			{
				'@context': 'https://schema.org',
				'@type': 'FAQPage',
				mainEntity: faqs.map((faq) => ({
					'@type': 'Question',
					name: faq.question,
					acceptedAnswer: {
						'@type': 'Answer',
						text: faq.answer
					}
				}))
			}
		])
	);
</script>

<svelte:head>
	<title>Contact Us | Abayiza</title>
	<meta name="description" content={contactDescription} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={`Contact Us | ${SITE_NAME}`} />
	<meta property="og:description" content={contactDescription} />
	<meta name="twitter:title" content={`Contact Us | ${SITE_NAME}`} />
	<meta name="twitter:description" content={contactDescription} />
	{@html contactJsonLd}
</svelte:head>

<!-- Header -->
<div class="bg-cream px-4 py-16 text-center md:py-24">
	<h1 class="mb-4 font-serif text-3xl tracking-widest text-black uppercase md:text-5xl">
		Contact Us
	</h1>
	<p class="mx-auto max-w-2xl text-lg font-light text-gray-600">
		We're here to assist you with styling advice, order inquiries, or any questions you may have.
	</p>
</div>

<div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
	<div class="flex flex-col gap-16 lg:flex-row lg:gap-24">
		<!-- Contact Info & FAQ -->
		<div class="w-full space-y-12 lg:w-5/12">
			<!-- Direct Contact -->
			<div>
				<h2 class="mb-6 font-serif text-xl tracking-widest text-black uppercase">Get in Touch</h2>
				<div class="space-y-6">
					<div class="flex items-start">
						<svg
							class="mt-0.5 mr-4 h-5 w-5 text-gold"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.5"
								d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
							/></svg
						>
						<div>
							<h3 class="mb-1 text-sm font-bold tracking-widest text-black uppercase">Email</h3>
							<a
								href="mailto:support@abayiza.com"
								class="text-sm font-light text-gray-500 transition-colors hover:text-black"
								>support@abayiza.com</a
							>
							<p class="mt-1 text-xs text-gray-400">Response time: 24-48 hours</p>
						</div>
					</div>

					<div class="flex items-start">
						<svg class="mt-0.5 mr-4 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 24 24"
							><path
								d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
							/></svg
						>
						<div>
							<h3 class="mb-1 text-sm font-bold tracking-widest text-black uppercase">WhatsApp</h3>
							<div class="space-y-1">
								<a
									href="https://wa.me/923116857822"
									target="_blank"
									rel="noreferrer"
									class="block text-sm font-light text-gray-500 transition-colors hover:text-black"
									>+92 311 685 7822</a
								>
								<a
									href="https://wa.me/923346657779"
									target="_blank"
									rel="noreferrer"
									class="block text-sm font-light text-gray-500 transition-colors hover:text-black"
									>+92 334 665 7779</a
								>
							</div>
							<p class="mt-1 text-xs text-gray-400">Available for catalog and order support</p>
						</div>
					</div>
				</div>
			</div>

			<!-- FAQ Accordion -->
			<div>
				<h2 class="mb-6 font-serif text-xl tracking-widest text-black uppercase">
					Frequently Asked
				</h2>
				<div class="border-t border-gray-200">
					{#each faqs as faq, i}
						<div class="border-b border-gray-200">
							<button
								class="flex w-full items-center justify-between py-4 text-left focus:outline-none"
								onclick={() => (openFaq = openFaq === i ? -1 : i)}
							>
								<span class="text-sm font-medium text-black">{faq.question}</span>
								<svg
									class="h-4 w-4 transform text-gray-400 transition-transform duration-200 {openFaq ===
									i
										? 'rotate-180'
										: ''}"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									><path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 9l-7 7-7-7"
									/></svg
								>
							</button>
							{#if openFaq === i}
								<div class="pr-8 pb-4">
									<p class="text-sm leading-relaxed font-light text-gray-500">{faq.answer}</p>
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- Contact Form -->
		<div class="w-full lg:w-7/12">
			<div class="border border-gray-200 bg-white p-8 shadow-sm md:p-12">
				<h2 class="mb-8 font-serif text-2xl tracking-widest text-black uppercase">
					Send a Message
				</h2>

				<form class="space-y-6">
					<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
						<div>
							<label
								for="firstName"
								class="mb-2 block text-xs tracking-widest text-gray-500 uppercase">First Name</label
							>
							<input
								type="text"
								id="firstName"
								class="w-full rounded-none border-gray-300 p-3 text-sm focus:border-black focus:ring-black"
							/>
						</div>
						<div>
							<label
								for="lastName"
								class="mb-2 block text-xs tracking-widest text-gray-500 uppercase">Last Name</label
							>
							<input
								type="text"
								id="lastName"
								class="w-full rounded-none border-gray-300 p-3 text-sm focus:border-black focus:ring-black"
							/>
						</div>
					</div>

					<div>
						<label for="email" class="mb-2 block text-xs tracking-widest text-gray-500 uppercase"
							>Email Address *</label
						>
						<input
							type="email"
							id="email"
							required
							class="w-full rounded-none border-gray-300 p-3 text-sm focus:border-black focus:ring-black"
						/>
					</div>

					<div>
						<label
							for="orderNumber"
							class="mb-2 block text-xs tracking-widest text-gray-500 uppercase"
							>Order Number (Optional)</label
						>
						<input
							type="text"
							id="orderNumber"
							class="w-full rounded-none border-gray-300 p-3 text-sm focus:border-black focus:ring-black"
						/>
					</div>

					<div>
						<label for="message" class="mb-2 block text-xs tracking-widest text-gray-500 uppercase"
							>Message *</label
						>
						<textarea
							id="message"
							required
							rows="6"
							class="w-full rounded-none border-gray-300 p-3 text-sm focus:border-black focus:ring-black"
						></textarea>
					</div>

					<button
						type="submit"
						class="w-full bg-black px-8 py-4 text-sm tracking-widest text-white uppercase transition-colors hover:bg-gold"
					>
						Submit Message
					</button>
				</form>
			</div>
		</div>
	</div>
</div>
