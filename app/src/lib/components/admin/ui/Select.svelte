<script lang="ts">
	import type { HTMLSelectAttributes } from 'svelte/elements';
	import Field from './Field.svelte';

	let {
		label = '',
		help = '',
		required = false,
		class: klass = '',
		...rest
	}: {
		label?: string;
		help?: string;
		required?: boolean;
		class?: string;
	} & HTMLSelectAttributes = $props();

	const generatedId = `sel-${Math.random().toString(36).slice(2, 9)}`;
	const id = $derived(rest.id ?? generatedId);
</script>

<Field {label} forId={id} {help} {required} class={klass}>
	<select
		id={id}
		{...rest}
		class="block w-full rounded-lg border border-admin-border bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition-colors focus:border-admin-primary focus:ring-2 focus:ring-admin-primary/20 focus:outline-none"
	></select>
</Field>
