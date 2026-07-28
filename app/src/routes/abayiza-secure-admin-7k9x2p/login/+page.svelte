<script lang="ts">
	let { data, form } = $props();
	let showPassword = $state(false);
</script>

<svelte:head>
	<title>Admin Login | Abayiza</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-white px-4 py-12">
	<div
		class="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-[0_24px_80px_rgba(0,0,0,0.08)]"
	>
		<div class="mb-8 text-center">
			<div
				class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-black font-serif text-xl font-bold text-white"
			>
				A
			</div>
			<p class="text-xs font-black tracking-[0.18em] text-blue-600 uppercase">Secure Admin</p>
			<h1 class="mt-2 text-2xl font-black text-gray-950">Sign in to Abayiza</h1>
			<p class="mt-2 text-sm text-gray-500">
				Protected with scrypt password hashing and signed sessions.
			</p>
		</div>

		{#if form?.error}
			<div
				class="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700"
			>
				{form.error}
			</div>
		{/if}

		<form method="POST" action="?/login" class="space-y-5">
			<input type="hidden" name="redirectTo" value={form?.redirectTo || data.redirectTo} />
			<div>
				<label for="email" class="mb-1 block text-sm font-bold text-gray-700">Admin email</label>
				<input
					id="email"
					name="email"
					type="email"
					required
					autocomplete="email"
					value={form?.email || ''}
					class="w-full rounded-md border-gray-300 text-sm focus:border-black focus:ring-black"
					placeholder="admin@abayiza.com"
				/>
			</div>
			<div>
				<label for="password" class="mb-1 block text-sm font-bold text-gray-700">Password</label>
				<div class="relative">
					<input
						id="password"
						name="password"
						type={showPassword ? 'text' : 'password'}
						required
						autocomplete="current-password"
						class="w-full rounded-md border-gray-300 pr-11 text-sm focus:border-black focus:ring-black"
						placeholder="Enter admin password"
					/>
					<button
						type="button"
						aria-label={showPassword ? 'Hide password' : 'Show password'}
						title={showPassword ? 'Hide password' : 'Show password'}
						class="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-gray-500 hover:text-black"
						onclick={() => (showPassword = !showPassword)}
					>
						{#if showPassword}
							<svg
								class="h-4 w-4"
								aria-hidden="true"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
							>
								<path
									d="M17.94 17.94A10.07 10.07 0 0 1 12 20C7 20 2.73 16.89 1 12a18.45 18.45 0 0 1 5.06-6.94"
								/>
								<path
									d="M9.9 4.24A9.12 9.12 0 0 1 12 4c5 0 9.27 3.11 11 8a18.5 18.5 0 0 1-2.16 3.19"
								/>
								<path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
								<path d="m1 1 22 22" />
							</svg>
						{:else}
							<svg
								class="h-4 w-4"
								aria-hidden="true"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
							>
								<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
								<circle cx="12" cy="12" r="3" />
							</svg>
						{/if}
					</button>
				</div>
				<p class="mt-2 text-xs text-gray-500">
					First login for an admin with no password will set this password.
				</p>
			</div>
			<button
				type="submit"
				class="w-full rounded-full bg-black px-6 py-3 text-sm font-black text-white hover:bg-gray-800"
			>
				Sign In
			</button>
		</form>
	</div>
</div>
