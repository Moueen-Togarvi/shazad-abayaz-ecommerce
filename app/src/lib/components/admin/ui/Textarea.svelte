<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';
	import Field from './Field.svelte';

	let {
		label = '',
		help = '',
		required = false,
		rows = 4,
		class: klass = '',
		value = '',
		...rest
	}: {
		label?: string;
		help?: string;
		required?: boolean;
		rows?: number;
		class?: string;
		value?: string | number | null;
	} & HTMLTextareaAttributes = $props();

	const generatedId = `ta-${Math.random().toString(36).slice(2, 9)}`;
	const id = $derived(rest.id ?? generatedId);
</script>

<Field {label} forId={id} {help} {required} class={klass}>
	<textarea
		id={id}
		{rows}
		{...rest}
		value={String(value ?? '')}
		class="block w-full rounded-lg border border-admin-border bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-admin-primary focus:ring-2 focus:ring-admin-primary/20 focus:outline-none"
	></textarea>
</Field>
