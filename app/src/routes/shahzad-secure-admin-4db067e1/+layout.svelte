<script lang="ts">
	import { page } from '$app/state';
	import { onDestroy } from 'svelte';
	import { Badge } from '$lib/components/admin/ui';

	let { children, data } = $props();
	let isSidebarOpen = $state(true);
	let isMobileMenuOpen = $state(false);
	let adminUser = $derived(data.adminUser);
	let isAuthPage = $derived(page.url.pathname === '/abayiza-secure-admin-7k9x2p/login');
	let toast = $state<{ type: string; message: string } | null>(null);
	let toastTimer: ReturnType<typeof setTimeout> | undefined;

	const isActive = (href: string) => {
		if (href === '/abayiza-secure-admin-7k9x2p') return page.url.pathname === href;
		if (href === '/abayiza-secure-admin-7k9x2p/orders/completed')
			return page.url.pathname.startsWith(href);
		if (href === '/abayiza-secure-admin-7k9x2p/orders/cancelled')
			return page.url.pathname.startsWith(href);
		if (href === '/abayiza-secure-admin-7k9x2p/orders') {
			return (
				page.url.pathname === href ||
				/^\/abayiza-secure-admin-7k9x2p\/orders\/(?!(completed|cancelled))/.test(page.url.pathname)
			);
		}
		return page.url.pathname.startsWith(href);
	};

	type NavItem = { href: string; label: string; icon: string; badge?: string };
	type NavGroup = { heading: string; items: NavItem[] };

	// Inline SVG paths keep the shell self-contained; no icon dependency needed.
	const icons: Record<string, string> = {
		dashboard:
			'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
		orders: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
		completed: 'M5 13l4 4L19 7',
		cancelled: 'M6 18L18 6M6 6l12 12',
		products:
			'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
		categories: 'M4 7h16M4 12h16M4 17h10',
		reviews:
			'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2 1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
		customers:
			'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
		users:
			'M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87M12 12a4 4 0 100-8 4 4 0 000 8z',
		analytics:
			'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
		storefront:
			'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9',
		settings:
			'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
		settingsCog: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z'
	};

	const navGroups: NavGroup[] = [
		{
			heading: 'Overview',
			items: [{ href: '/abayiza-secure-admin-7k9x2p', label: 'Dashboard', icon: 'dashboard' }]
		},
		{
			heading: 'Orders',
			items: [
				{ href: '/abayiza-secure-admin-7k9x2p/orders', label: 'Active', icon: 'orders' },
				{ href: '/abayiza-secure-admin-7k9x2p/orders/completed', label: 'Completed', icon: 'completed' },
				{ href: '/abayiza-secure-admin-7k9x2p/orders/cancelled', label: 'Cancelled', icon: 'cancelled' }
			]
		},
		{
			heading: 'Catalog',
			items: [
				{ href: '/abayiza-secure-admin-7k9x2p/products', label: 'Products', icon: 'products' },
				{ href: '/abayiza-secure-admin-7k9x2p/categories', label: 'Categories', icon: 'categories' },
				{ href: '/abayiza-secure-admin-7k9x2p/reviews', label: 'Review Photos', icon: 'reviews' }
			]
		},
		{
			heading: 'Customers',
			items: [
				{ href: '/abayiza-secure-admin-7k9x2p/customers', label: 'Customers', icon: 'customers' },
				{ href: '/abayiza-secure-admin-7k9x2p/users', label: 'Team & Roles', icon: 'users' }
			]
		},
		{
			heading: 'Insights',
			items: [
				{ href: '/abayiza-secure-admin-7k9x2p/analytics', label: 'Analytics', icon: 'analytics' },
				{ href: '/abayiza-secure-admin-7k9x2p/storefront', label: 'Storefront', icon: 'storefront' }
			]
		}
	];

	const toastTone = $derived(
		toast?.type === 'error' ? 'danger' : toast?.type === 'info' ? 'info' : 'success'
	);
	const toastIconPath = $derived(toast?.type === 'error' ? 'M6 18 18 6M6 6l12 12' : 'M5 13l4 4L19 7');

	$effect(() => {
		if (!data.flash?.message) return;

		toast = data.flash;
		if (toastTimer) clearTimeout(toastTimer);
		toastTimer = setTimeout(() => {
			toast = null;
		}, 3000);
	});

	onDestroy(() => {
		if (toastTimer) clearTimeout(toastTimer);
	});

	const showLabels = $derived(isSidebarOpen || isMobileMenuOpen);
</script>

<svelte:head>
	<title>Abayiza Admin</title>
</svelte:head>

{#if toast}
	<div
		class="fixed top-4 right-4 z-[90] flex w-[min(22rem,calc(100vw-2rem))] items-start gap-3 rounded-xl border border-admin-border bg-white p-4 shadow-2xl"
		role="status"
		aria-live="polite"
	>
		<span
			class={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white ${toast?.type === 'error' ? 'bg-red-600' : toast?.type === 'info' ? 'bg-blue-600' : 'bg-emerald-600'}`}
		>
			<svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2.4"
					d={toastIconPath}
				/>
			</svg>
		</span>
		<div class="min-w-0 flex-1">
			<p class="flex items-center gap-2 text-sm font-semibold text-gray-900">
				{toast?.type === 'error' ? 'Something went wrong' : 'Done'}
				<Badge tone={toastTone}>{toast?.type === 'error' ? 'Error' : toast?.type === 'info' ? 'Info' : 'Success'}</Badge>
			</p>
			<p class="mt-0.5 text-sm text-gray-500">{toast?.message}</p>
		</div>
		<button
			type="button"
			class="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
			aria-label="Dismiss notification"
			onclick={() => (toast = null)}
		>
			<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M6 18 18 6M6 6l12 12"
				/>
			</svg>
		</button>
	</div>
{/if}

{#if isAuthPage}
	{@render children()}
{:else}
	<div class="flex min-h-screen bg-admin-canvas font-sans text-gray-900">
		{#if isMobileMenuOpen}
			<button
				type="button"
				class="fixed inset-0 z-30 bg-black/45 md:hidden"
				aria-label="Close admin menu"
				onclick={() => (isMobileMenuOpen = false)}
			></button>
		{/if}

		<!-- Sidebar -->
		<aside
			class={`fixed inset-y-0 left-0 z-40 flex h-screen flex-col border-r border-admin-border bg-white transition-all duration-300 md:sticky md:top-0 md:z-20 ${showLabels ? 'w-64' : 'md:w-20'} ${isMobileMenuOpen ? 'w-64 translate-x-0' : '-translate-x-full md:translate-x-0'}`}
		>
			<div
				class={`flex h-16 shrink-0 items-center border-b border-admin-border ${showLabels ? 'justify-between px-5' : 'justify-center px-2'}`}
			>
				{#if showLabels}
					<a href="/abayiza-secure-admin-7k9x2p" class="flex items-baseline gap-2">
						<span class="font-serif text-lg font-bold tracking-widest text-gray-900">ABAYIZA</span>
						<span class="text-[10px] font-semibold tracking-[0.2em] text-admin-primary uppercase"
							>Admin</span
						>
					</a>
				{/if}
				<button
					type="button"
					class="hidden rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 md:block"
					aria-label="Toggle admin sidebar"
					onclick={() => (isSidebarOpen = !isSidebarOpen)}
				>
					<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h16"
						/>
					</svg>
				</button>
				<button
					type="button"
					class="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 md:hidden"
					aria-label="Close admin menu"
					onclick={() => (isMobileMenuOpen = false)}
				>
					<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18 18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>

			<nav class="flex-1 overflow-y-auto px-3 py-4">
				{#each navGroups as group}
					<h3
						class={`mb-1 px-3 text-[11px] font-semibold tracking-wider text-gray-400 uppercase ${showLabels ? '' : 'hidden'}`}
					>
						{group.heading}
					</h3>
					<ul class={`mb-4 space-y-0.5 ${showLabels ? '' : 'flex flex-col items-center'}`}>
						{#each group.items as item}
							{@const active = isActive(item.href)}
							<li>
								<a
									href={item.href}
									title={showLabels ? '' : item.label}
									class={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${showLabels ? '' : 'justify-center px-0'} ${active ? 'bg-admin-primary text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
								>
									<svg
										class="h-5 w-5 shrink-0"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="1.8"
											d={icons[item.icon]}
										/>
									</svg>
									{#if showLabels}<span>{item.label}</span>{/if}
								</a>
							</li>
						{/each}
					</ul>
				{/each}
			</nav>

			<div class="shrink-0 border-t border-admin-border p-3">
				<a
					href="/abayiza-secure-admin-7k9x2p/settings"
					title={showLabels ? '' : 'Settings'}
					class={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${showLabels ? '' : 'justify-center px-0'} ${isActive('/abayiza-secure-admin-7k9x2p/settings') ? 'bg-admin-primary text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
				>
					<svg class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.8"
							d={icons.settings}
						/>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.8"
							d={icons.settingsCog}
						/>
					</svg>
					{#if showLabels}<span>Settings</span>{/if}
				</a>
			</div>
		</aside>

		<!-- Main content area -->
		<div class="flex min-w-0 flex-1 flex-col">
			<!-- Top header -->
			<header
				class="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b border-admin-border bg-white/90 px-4 backdrop-blur sm:px-6"
			>
				<!-- Mobile brand + menu -->
				<div class="flex items-center gap-3 md:hidden">
					<button
						type="button"
						class="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 focus:outline-none"
						aria-label="Open admin menu"
						onclick={() => (isMobileMenuOpen = true)}
					>
						<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
					</button>
					<span class="font-serif text-lg font-bold tracking-widest text-gray-900">Abayiza</span>
				</div>

				<!-- Search bar (Desktop) -->
				<div class="hidden max-w-md flex-1 md:block">
					<div class="relative w-full text-gray-400 focus-within:text-admin-primary">
						<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
							<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/>
							</svg>
						</div>
						<input
							class="block h-10 w-full rounded-lg border border-admin-border bg-gray-50 py-2 pr-3 pl-10 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:border-admin-primary focus:bg-white focus:ring-2 focus:ring-admin-primary/20 focus:outline-none"
							placeholder="Search orders, products, customers…"
							type="search"
						/>
					</div>
				</div>

				<!-- Right actions -->
				<div class="flex items-center gap-3">
					<div class="relative">
						<form
							method="POST"
							action="/abayiza-secure-admin-7k9x2p/logout"
							class="flex items-center gap-3"
						>
							<div class="hidden text-right sm:block">
								<p class="text-sm font-semibold text-gray-900">
									{adminUser?.firstName || 'Admin'}
									{adminUser?.lastName || ''}
								</p>
								<p class="text-xs font-medium text-gray-400">{adminUser?.role}</p>
							</div>
							<button
								type="submit"
								class="flex items-center gap-2 rounded-full border border-admin-border bg-white py-1 pr-3 pl-1 text-sm transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-admin-primary/30 focus:outline-none"
								title="Logout"
							>
								<span
									class="flex h-7 w-7 items-center justify-center rounded-full bg-admin-primary text-xs font-bold text-white"
								>
									{(adminUser?.firstName || 'A').charAt(0)}
								</span>
								<span class="hidden font-medium text-gray-600 sm:inline">Logout</span>
							</button>
						</form>
					</div>
				</div>
			</header>

			<!-- Main content -->
			<main class="flex-1 overflow-y-auto bg-admin-canvas p-4 sm:p-6 lg:p-8">
				{@render children()}
			</main>
		</div>
	</div>
{/if}
