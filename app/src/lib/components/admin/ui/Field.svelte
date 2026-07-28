<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		label = '',
		forId = '',
		help = '',
		required = false,
		class: klass = '',
		children
	}: {
		label?: string;
		forId?: string;
		help?: string;
		required?: boolean;
		class?: string;
		children: Snippet;
	} = $props();
</script>

<div class={klass}>
	{#if label}
		<label for={forId} class="mb-1.5 block text-sm font-medium text-gray-700">
			{label}{#if required}<span class="ml-0.5 text-red-500">*</span>{/if}
		</label>
	{/if}
	{@render children()}
	{#if help}<p class="mt-1.5 text-xs text-gray-400">{help}</p>{/if}
</div>
