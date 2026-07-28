<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		title,
		description = '',
		icon
	}: { title: string; description?: string; icon?: Snippet } = $props();
</script>

<div class="flex flex-col items-center justify-center px-6 py-12 text-center">
	{#if icon}
		<div class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
			{@render icon()}
		</div>
	{/if}
	<p class="text-sm font-medium text-gray-500">{title}</p>
	{#if description}<p class="mt-1 text-sm text-gray-400">{description}</p>{/if}
</div>
