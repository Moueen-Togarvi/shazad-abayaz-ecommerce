<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		title = '',
		description = '',
		class: klass = '',
		bodyClass = 'p-6',
		header,
		footer,
		children
	}: {
		title?: string;
		description?: string;
		class?: string;
		bodyClass?: string;
		header?: Snippet;
		footer?: Snippet;
		children: Snippet;
	} = $props();

	const hasHeader = $derived(Boolean(title || description || header));
</script>

<section class={`overflow-hidden rounded-xl border border-admin-border bg-white shadow-sm ${klass}`}>
	{#if hasHeader}
		<header class="flex items-center justify-between gap-4 border-b border-admin-border px-6 py-4">
			<div class="min-w-0">
				{#if title}<h3 class="text-base font-semibold text-gray-900">{title}</h3>{/if}
				{#if description}<p class="mt-0.5 text-sm text-gray-500">{description}</p>{/if}
			</div>
			{#if header}{@render header()}{/if}
		</header>
	{/if}

	<div class={bodyClass}>
		{@render children()}
	</div>

	{#if footer}
		<footer class="border-t border-admin-border px-6 py-4">{@render footer()}</footer>
	{/if}
</section>
