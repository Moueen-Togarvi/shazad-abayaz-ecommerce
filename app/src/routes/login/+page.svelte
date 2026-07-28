<script lang="ts">
	import AbayizaWordmark from '$lib/components/AbayizaWordmark.svelte';

	let activeTab = $state<'login' | 'register'>('login');
	let showPassword = $state(false);
</script>

<svelte:head>
	<title>{activeTab === 'login' ? 'Sign In' : 'Create Account'} | Abayiza</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-cream px-4 py-16">
	<div class="w-full max-w-md">
		<!-- Logo -->
		<div class="mb-10 text-center">
			<a href="/" class="text-3xl text-black"><AbayizaWordmark /></a>
			<div class="mx-auto mt-4 h-[1px] w-10 bg-gold"></div>
		</div>

		<!-- Tab Switcher -->
		<div class="mb-8 flex border-b border-gray-200">
			<button
				class="flex-1 border-b-2 py-3 text-sm font-medium tracking-widest uppercase transition-colors {activeTab ===
				'login'
					? 'border-black text-black'
					: 'border-transparent text-gray-400 hover:text-gray-600'}"
				onclick={() => (activeTab = 'login')}
			>
				Sign In
			</button>
			<button
				class="flex-1 border-b-2 py-3 text-sm font-medium tracking-widest uppercase transition-colors {activeTab ===
				'register'
					? 'border-black text-black'
					: 'border-transparent text-gray-400 hover:text-gray-600'}"
				onclick={() => (activeTab = 'register')}
			>
				Create Account
			</button>
		</div>

		{#if activeTab === 'login'}
			<!-- Login Form -->
			<form class="space-y-5">
				<div>
					<label for="email" class="mb-2 block text-xs tracking-widest text-gray-500 uppercase"
						>Email Address</label
					>
					<input
						type="email"
						id="email"
						required
						autocomplete="email"
						class="w-full rounded-none border border-gray-300 bg-white p-3.5 text-sm transition-colors outline-none focus:border-black focus:ring-0"
						placeholder="your@email.com"
					/>
				</div>
				<div>
					<label for="password" class="mb-2 block text-xs tracking-widest text-gray-500 uppercase"
						>Password</label
					>
					<div class="relative">
						<input
							type={showPassword ? 'text' : 'password'}
							id="password"
							required
							autocomplete="current-password"
							class="w-full rounded-none border border-gray-300 bg-white p-3.5 pr-12 text-sm transition-colors outline-none focus:border-black focus:ring-0"
							placeholder="••••••••"
						/>
						<button
							type="button"
							aria-label={showPassword ? 'Hide password' : 'Show password'}
							class="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 transition-colors hover:text-black"
							onclick={() => (showPassword = !showPassword)}
						>
							{#if showPassword}
								<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"
									><path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
									/></svg
								>
							{:else}
								<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"
									><path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
									/><path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
									/></svg
								>
							{/if}
						</button>
					</div>
				</div>
				<div class="flex justify-end">
					<a
						href="/forgot-password"
						class="text-xs text-gray-500 underline transition-colors hover:text-black"
						>Forgot your password?</a
					>
				</div>
				<button
					type="submit"
					class="w-full bg-black py-4 text-sm font-medium tracking-widest text-white uppercase transition-colors hover:bg-gold"
				>
					Sign In
				</button>
				<div class="relative flex items-center py-2">
					<div class="flex-grow border-t border-gray-200"></div>
					<span class="mx-4 text-xs tracking-widest text-gray-400 uppercase">or</span>
					<div class="flex-grow border-t border-gray-200"></div>
				</div>
				<p class="text-center text-sm font-light text-gray-500">
					Don't have an account?
					<button
						type="button"
						class="font-medium text-black underline transition-colors hover:text-gold"
						onclick={() => (activeTab = 'register')}>Create one</button
					>
				</p>
			</form>
		{:else}
			<!-- Register Form -->
			<form class="space-y-5">
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label
							for="firstName"
							class="mb-2 block text-xs tracking-widest text-gray-500 uppercase">First Name</label
						>
						<input
							type="text"
							id="firstName"
							required
							class="w-full rounded-none border border-gray-300 bg-white p-3.5 text-sm transition-colors outline-none focus:border-black focus:ring-0"
							placeholder="Fatima"
						/>
					</div>
					<div>
						<label for="lastName" class="mb-2 block text-xs tracking-widest text-gray-500 uppercase"
							>Last Name</label
						>
						<input
							type="text"
							id="lastName"
							required
							class="w-full rounded-none border border-gray-300 bg-white p-3.5 text-sm transition-colors outline-none focus:border-black focus:ring-0"
							placeholder="Zahra"
						/>
					</div>
				</div>
				<div>
					<label for="regEmail" class="mb-2 block text-xs tracking-widest text-gray-500 uppercase"
						>Email Address</label
					>
					<input
						type="email"
						id="regEmail"
						required
						class="w-full rounded-none border border-gray-300 bg-white p-3.5 text-sm transition-colors outline-none focus:border-black focus:ring-0"
						placeholder="your@email.com"
					/>
				</div>
				<div>
					<label
						for="regPassword"
						class="mb-2 block text-xs tracking-widest text-gray-500 uppercase">Password</label
					>
					<div class="relative">
						<input
							type={showPassword ? 'text' : 'password'}
							id="regPassword"
							required
							class="w-full rounded-none border border-gray-300 bg-white p-3.5 pr-12 text-sm transition-colors outline-none focus:border-black focus:ring-0"
							placeholder="Min. 8 characters"
						/>
						<button
							type="button"
							aria-label={showPassword ? 'Hide password' : 'Show password'}
							class="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 transition-colors hover:text-black"
							onclick={() => (showPassword = !showPassword)}
						>
							<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
								/><path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
								/></svg
							>
						</button>
					</div>
				</div>
				<label class="flex cursor-pointer items-start space-x-3">
					<input
						type="checkbox"
						class="mt-0.5 form-checkbox h-4 w-4 rounded-none border-gray-300 text-black focus:ring-0"
					/>
					<span class="text-xs leading-relaxed font-light text-gray-500"
						>I agree to the <a href="/policies/terms" class="text-black underline"
							>Terms of Service</a
						>
						and <a href="/policies/privacy" class="text-black underline">Privacy Policy</a></span
					>
				</label>
				<label class="flex cursor-pointer items-start space-x-3">
					<input
						type="checkbox"
						class="mt-0.5 form-checkbox h-4 w-4 rounded-none border-gray-300 text-black focus:ring-0"
					/>
					<span class="text-xs font-light text-gray-500"
						>Subscribe to exclusive offers & new collection alerts</span
					>
				</label>
				<button
					type="submit"
					class="w-full bg-black py-4 text-sm font-medium tracking-widest text-white uppercase transition-colors hover:bg-gold"
				>
					Create Account
				</button>
				<p class="text-center text-sm font-light text-gray-500">
					Already have an account?
					<button
						type="button"
						class="font-medium text-black underline transition-colors hover:text-gold"
						onclick={() => (activeTab = 'login')}>Sign in</button
					>
				</p>
			</form>
		{/if}
	</div>
</div>
