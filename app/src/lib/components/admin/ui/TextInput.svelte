<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import Field from './Field.svelte';

	let {
		label = '',
		help = '',
		required = false,
		prefix = '',
		class: klass = '',
		...rest
	}: {
		label?: string;
		help?: string;
		required?: boolean;
		prefix?: string;
		class?: string;
	} & HTMLInputAttributes = $props();

	const generatedId = `in-${Math.random().toString(36).slice(2, 9)}`;
	const id = $derived(rest.id ?? generatedId);
</script>

<Field {label} forId={id} {help} {required} class={klass}>
	{#if prefix}
		<div class="relative">
			<span
				class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-gray-400"
			>
				{prefix}
			</span>
			<input
				id={id}
				{...rest}
				class="block w-full rounded-lg border border-admin-border bg-white py-2 pr-3 pl-8 text-sm text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-admin-primary focus:ring-2 focus:ring-admin-primary/20 focus:outline-none"
			/>
		</div>
	{:else}
		<input
			id={id}
			{...rest}
			class="block w-full rounded-lg border border-admin-border bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-admin-primary focus:ring-2 focus:ring-admin-primary/20 focus:outline-none"
		/>
	{/if}
</Field>
