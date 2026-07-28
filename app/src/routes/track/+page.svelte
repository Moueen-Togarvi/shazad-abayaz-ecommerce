<script lang="ts">
	import { formatMoney } from '$lib/shared/money';

	let { form } = $props();
	let order = $derived(form?.order as any);
</script>

<svelte:head>
	<title>Track Your Order | Abayiza</title>
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-20 lg:px-8">
	<div class="mb-12 text-center">
		<h1 class="mb-4 font-serif text-3xl tracking-widest text-black uppercase md:text-4xl">
			Track Your Order
		</h1>
		<div class="mx-auto h-[1px] w-12 bg-gold"></div>
	</div>

	<div class="border border-gray-200 bg-white p-8 shadow-sm md:p-12">
		<p class="mb-8 text-center font-light text-gray-500">
			Enter the order number and email used at checkout.
		</p>
		<form class="space-y-5" method="POST" action="?/track">
			<div>
				<label for="orderNum" class="mb-2 block text-xs tracking-widest text-gray-500 uppercase">
					Order Number
				</label>
				<input
					type="text"
					id="orderNum"
					name="orderNumber"
					value={form?.query?.orderNumber ?? ''}
					placeholder="ABY-0001"
					class="w-full rounded-none border border-gray-300 bg-white p-3.5 text-sm transition-colors outline-none focus:border-black focus:ring-0"
				/>
			</div>
			<div>
				<label for="trackEmail" class="mb-2 block text-xs tracking-widest text-gray-500 uppercase">
					Email Address
				</label>
				<input
					type="email"
					id="trackEmail"
					name="email"
					value={form?.query?.email ?? ''}
					placeholder="your@email.com"
					class="w-full rounded-none border border-gray-300 bg-white p-3.5 text-sm transition-colors outline-none focus:border-black focus:ring-0"
				/>
			</div>
			<button
				type="submit"
				class="w-full bg-black py-4 text-sm tracking-widest text-white uppercase transition-colors hover:bg-gold"
			>
				Track Order
			</button>
		</form>
		{#if form?.error}
			<p
				class="mt-4 rounded border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800"
			>
				{form.error}
			</p>
		{/if}
	</div>

	{#if order}
		<div class="mt-8 space-y-6">
			<div
				class="flex flex-col gap-4 bg-black p-6 text-white sm:flex-row sm:items-center sm:justify-between"
			>
				<div>
					<p class="mb-1 text-xs tracking-widest text-white/60 uppercase">
						Order {order.orderNumber}
					</p>
					<h2 class="font-serif text-xl">{order.status}</h2>
					<p class="mt-1 text-sm font-light text-white/70">
						Placed {new Date(order.createdAt).toLocaleDateString()}
					</p>
				</div>
				<div class="text-left sm:text-right">
					<p class="mb-1 text-xs tracking-widest text-white/60 uppercase">Tracking</p>
					<p class="font-mono text-sm">{order.trackingNumber || 'Not assigned yet'}</p>
				</div>
			</div>

			<div class="border border-gray-200 bg-white p-6 shadow-sm">
				<h3 class="mb-4 text-sm font-bold tracking-widest text-black uppercase">Items in Order</h3>
				<div class="space-y-4">
					{#each order.items as item}
						<div class="flex items-center gap-4">
							<div class="h-16 w-12 flex-shrink-0 bg-gray-100">
								{#if item.image}
									<img src={item.image} alt={item.productName} class="h-full w-full object-cover" />
								{/if}
							</div>
							<div class="min-w-0 flex-1">
								<p class="font-serif text-sm">{item.productName}</p>
								<p class="text-xs font-light text-gray-400">
									{[item.variantColor, item.variantSize].filter(Boolean).join(' / ')}
								</p>
								<p class="mt-1 text-xs font-medium text-gray-500">
									Qty: {item.quantity} · {formatMoney(item.priceAtPurchase)}
								</p>
							</div>
						</div>
					{/each}
				</div>
				<div class="mt-6 border-t border-gray-100 pt-4 text-right font-medium">
					Total {formatMoney(order.totalAmount)}
				</div>
			</div>
		</div>
	{/if}

	<div class="mt-12 border-t border-gray-200 pt-12 text-center">
		<p class="mb-4 text-sm font-light text-gray-500">Need help with your order?</p>
		<a
			href="https://wa.me/923116857822"
			target="_blank"
			rel="noreferrer"
			class="text-sm font-medium tracking-widest text-green-700 uppercase transition-colors hover:text-green-800"
		>
			WhatsApp Abayiza
		</a>
		<a
			href="https://wa.me/923346657779"
			target="_blank"
			rel="noreferrer"
			class="ml-4 text-sm font-medium tracking-widest text-green-700 uppercase transition-colors hover:text-green-800"
		>
			WhatsApp 2
		</a>
	</div>
</div>
