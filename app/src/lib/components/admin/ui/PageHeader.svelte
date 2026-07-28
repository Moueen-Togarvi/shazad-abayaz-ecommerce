<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		title,
		subtitle = '',
		backHref = '',
		actions
	}: {
		title: string;
		subtitle?: string;
		backHref?: string;
		actions?: Snippet;
	} = $props();
</script>

<div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
	<div class="flex items-start gap-3">
		{#if backHref}
			<a
				href={backHref}
				class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-admin-border bg-white text-gray-500 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-700"
				aria-label="Go back"
			>
				<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10 19l-7-7m0 0l7-7m-7 7h18"
					/>
				</svg>
			</a>
		{/if}
		<div>
			<h1 class="text-2xl font-bold tracking-tight text-gray-900">{title}</h1>
			{#if subtitle}<p class="mt-1 text-sm text-gray-500">{subtitle}</p>{/if}
		</div>
	</div>
	{#if actions}
		<div class="flex flex-wrap items-center gap-2">{@render actions()}</div>
	{/if}
</div>
