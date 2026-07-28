<script lang="ts">
	let { data, form } = $props();
	let settings = $derived((form?.settings || data.settings) as Record<string, string>);
</script>

<svelte:head>
	<title>Settings | Abayiza Admin</title>
</svelte:head>

<div class="mx-auto max-w-6xl pb-12">
	<div class="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
		<div>
			<p class="text-xs font-black tracking-[0.16em] text-blue-600 uppercase">Admin Control</p>
			<h1 class="mt-1 text-3xl font-black text-gray-950">Settings</h1>
			<p class="mt-2 text-sm text-gray-500">
				Manage store identity, checkout, shipping, and notification values.
			</p>
		</div>
		<form method="POST" action="?/reset">
			<button
				type="submit"
				class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50"
			>
				Reset Defaults
			</button>
		</form>
	</div>

	{#if data.saved}
		<div
			class="mb-5 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm font-bold text-green-700"
		>
			Settings saved successfully.
		</div>
	{/if}
	{#if data.reset}
		<div
			class="mb-5 rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700"
		>
			Settings reset to defaults.
		</div>
	{/if}
	{#if form?.error}
		<div
			class="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700"
		>
			{form.error}
		</div>
	{/if}

	<div class="grid grid-cols-1 gap-8 lg:grid-cols-[16rem_1fr]">
		<aside class="lg:sticky lg:top-24 lg:self-start">
			<nav class="rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">
				<a href="#store" class="block rounded-xl bg-gray-950 px-4 py-3 text-sm font-bold text-white"
					>Store details</a
				>
				<a
					href="#standards"
					class="block rounded-xl px-4 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50"
					>Standards</a
				>
				<a
					href="#checkout"
					class="block rounded-xl px-4 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50"
					>Checkout</a
				>
				<a
					href="#notifications"
					class="block rounded-xl px-4 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50"
					>Notifications</a
				>
			</nav>
		</aside>

		<form method="POST" action="?/save" class="space-y-6">
			<section id="store" class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
				<div class="mb-5">
					<h2 class="text-lg font-black text-gray-950">Store details</h2>
					<p class="mt-1 text-sm text-gray-500">
						These values are used across admin, customer contact, and order support.
					</p>
				</div>

				<div class="grid gap-4 md:grid-cols-2">
					<div class="md:col-span-2">
						<label for="store_name" class="mb-1 block text-sm font-bold text-gray-700"
							>Store name</label
						>
						<input
							id="store_name"
							name="store_name"
							value={settings.store_name}
							required
							class="w-full rounded-md border-gray-300 text-sm focus:border-black focus:ring-black"
						/>
					</div>
					<div>
						<label for="store_contact_email" class="mb-1 block text-sm font-bold text-gray-700"
							>Store contact email</label
						>
						<input
							id="store_contact_email"
							name="store_contact_email"
							type="email"
							value={settings.store_contact_email}
							class="w-full rounded-md border-gray-300 text-sm focus:border-black focus:ring-black"
						/>
					</div>
					<div>
						<label for="sender_email" class="mb-1 block text-sm font-bold text-gray-700"
							>Sender email</label
						>
						<input
							id="sender_email"
							name="sender_email"
							type="email"
							value={settings.sender_email}
							class="w-full rounded-md border-gray-300 text-sm focus:border-black focus:ring-black"
						/>
					</div>
					<div>
						<label for="support_phone" class="mb-1 block text-sm font-bold text-gray-700"
							>Support phone</label
						>
						<input
							id="support_phone"
							name="support_phone"
							value={settings.support_phone}
							class="w-full rounded-md border-gray-300 text-sm focus:border-black focus:ring-black"
						/>
					</div>
					<div>
						<label for="support_phone_secondary" class="mb-1 block text-sm font-bold text-gray-700"
							>Support phone 2</label
						>
						<input
							id="support_phone_secondary"
							name="support_phone_secondary"
							value={settings.support_phone_secondary}
							class="w-full rounded-md border-gray-300 text-sm focus:border-black focus:ring-black"
						/>
					</div>
					<div>
						<label for="whatsapp_order_number" class="mb-1 block text-sm font-bold text-gray-700"
							>WhatsApp order number</label
						>
						<input
							id="whatsapp_order_number"
							name="whatsapp_order_number"
							value={settings.whatsapp_order_number}
							class="w-full rounded-md border-gray-300 text-sm focus:border-black focus:ring-black"
						/>
					</div>
					<div>
						<label
							for="whatsapp_order_number_secondary"
							class="mb-1 block text-sm font-bold text-gray-700">WhatsApp order number 2</label
						>
						<input
							id="whatsapp_order_number_secondary"
							name="whatsapp_order_number_secondary"
							value={settings.whatsapp_order_number_secondary}
							class="w-full rounded-md border-gray-300 text-sm focus:border-black focus:ring-black"
						/>
					</div>
					<div class="md:col-span-2">
						<label for="whatsapp_catalog" class="mb-1 block text-sm font-bold text-gray-700"
							>WhatsApp catalog URL</label
						>
						<input
							id="whatsapp_catalog"
							name="whatsapp_catalog"
							type="url"
							value={settings.whatsapp_catalog}
							class="w-full rounded-md border-gray-300 text-sm focus:border-black focus:ring-black"
						/>
					</div>
				</div>
			</section>

			<section id="standards" class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
				<div class="mb-5">
					<h2 class="text-lg font-black text-gray-950">Standards and formats</h2>
					<p class="mt-1 text-sm text-gray-500">Formatting defaults used for store operations.</p>
				</div>

				<div class="grid gap-4 md:grid-cols-3">
					<div>
						<label for="timezone" class="mb-1 block text-sm font-bold text-gray-700">Timezone</label
						>
						<select
							id="timezone"
							name="timezone"
							bind:value={settings.timezone}
							class="w-full rounded-md border-gray-300 text-sm focus:border-black focus:ring-black"
						>
							<option value="Asia/Karachi">Asia/Karachi</option>
							<option value="Asia/Dubai">Asia/Dubai</option>
							<option value="UTC">UTC</option>
						</select>
					</div>
					<div>
						<label for="unit_system" class="mb-1 block text-sm font-bold text-gray-700"
							>Unit system</label
						>
						<select
							id="unit_system"
							name="unit_system"
							bind:value={settings.unit_system}
							class="w-full rounded-md border-gray-300 text-sm focus:border-black focus:ring-black"
						>
							<option value="metric">Metric system</option>
							<option value="imperial">Imperial system</option>
						</select>
					</div>
					<div>
						<label for="store_currency" class="mb-1 block text-sm font-bold text-gray-700"
							>Store currency</label
						>
						<select
							id="store_currency"
							name="store_currency"
							bind:value={settings.store_currency}
							class="w-full rounded-md border-gray-300 text-sm focus:border-black focus:ring-black"
						>
							<option value="PKR">Pakistani Rupees (PKR)</option>
							<option value="AED">United Arab Emirates Dirham (AED)</option>
							<option value="USD">US Dollars (USD)</option>
						</select>
					</div>
				</div>
			</section>

			<section id="checkout" class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
				<div class="mb-5">
					<h2 class="text-lg font-black text-gray-950">Checkout and shipping</h2>
					<p class="mt-1 text-sm text-gray-500">
						Control payment availability and checkout support copy.
					</p>
				</div>

				<div class="grid gap-4 md:grid-cols-2">
					<div>
						<label for="default_country" class="mb-1 block text-sm font-bold text-gray-700"
							>Default country</label
						>
						<input
							id="default_country"
							name="default_country"
							value={settings.default_country}
							class="w-full rounded-md border-gray-300 text-sm focus:border-black focus:ring-black"
						/>
					</div>
					<div>
						<label for="free_shipping_threshold" class="mb-1 block text-sm font-bold text-gray-700"
							>Free shipping threshold</label
						>
						<input
							id="free_shipping_threshold"
							name="free_shipping_threshold"
							type="number"
							min="0"
							value={settings.free_shipping_threshold}
							class="w-full rounded-md border-gray-300 text-sm focus:border-black focus:ring-black"
						/>
					</div>
					<div>
						<label for="return_policy_days" class="mb-1 block text-sm font-bold text-gray-700"
							>Return policy days</label
						>
						<input
							id="return_policy_days"
							name="return_policy_days"
							type="number"
							min="0"
							value={settings.return_policy_days}
							class="w-full rounded-md border-gray-300 text-sm focus:border-black focus:ring-black"
						/>
					</div>
					<div>
						<label for="jazzcash_status" class="mb-1 block text-sm font-bold text-gray-700"
							>JazzCash status</label
						>
						<select
							id="jazzcash_status"
							name="jazzcash_status"
							bind:value={settings.jazzcash_status}
							class="w-full rounded-md border-gray-300 text-sm focus:border-black focus:ring-black"
						>
							<option value="coming_soon">Coming soon</option>
							<option value="enabled">Enabled</option>
							<option value="disabled">Disabled</option>
						</select>
					</div>
					<label
						class="flex items-center gap-3 rounded-xl border border-gray-200 p-4 md:col-span-2"
					>
						<input
							name="cod_enabled"
							type="checkbox"
							checked={settings.cod_enabled === 'true'}
							class="rounded border-gray-300 text-black focus:ring-black"
						/>
						<span>
							<span class="block text-sm font-bold text-gray-900">Cash on delivery enabled</span>
							<span class="block text-xs text-gray-500"
								>When off, checkout can block COD in future payment logic.</span
							>
						</span>
					</label>
					<div class="md:col-span-2">
						<label for="shipping_note" class="mb-1 block text-sm font-bold text-gray-700"
							>Shipping note</label
						>
						<textarea
							id="shipping_note"
							name="shipping_note"
							rows="3"
							class="w-full rounded-md border-gray-300 text-sm focus:border-black focus:ring-black"
							>{settings.shipping_note}</textarea
						>
					</div>
				</div>
			</section>

			<section id="notifications" class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
				<div class="mb-5">
					<h2 class="text-lg font-black text-gray-950">Notifications</h2>
					<p class="mt-1 text-sm text-gray-500">
						Order emails use the server Resend API key. Admin emails include a direct order detail
						link.
					</p>
				</div>

				<div class="grid gap-4 md:grid-cols-2">
					<div>
						<label for="order_notify_email" class="mb-1 block text-sm font-bold text-gray-700"
							>Admin order email</label
						>
						<input
							id="order_notify_email"
							name="order_notify_email"
							type="email"
							value={settings.order_notify_email}
							class="w-full rounded-md border-gray-300 text-sm focus:border-black focus:ring-black"
							placeholder="orders@abayiza.com"
						/>
					</div>
					<div>
						<label for="resend_from_email" class="mb-1 block text-sm font-bold text-gray-700"
							>Resend from email</label
						>
						<input
							id="resend_from_email"
							name="resend_from_email"
							type="text"
							value={settings.resend_from_email}
							class="w-full rounded-md border-gray-300 text-sm focus:border-black focus:ring-black"
							placeholder="Abayiza <orders@abayiza.com>"
						/>
					</div>
				</div>
			</section>

			<div class="sticky bottom-4 flex justify-end">
				<button
					type="submit"
					class="rounded-full bg-black px-8 py-3 text-sm font-black text-white shadow-[0_18px_40px_rgba(0,0,0,0.18)] hover:bg-gray-800"
				>
					Save Settings
				</button>
			</div>
		</form>
	</div>
</div>
