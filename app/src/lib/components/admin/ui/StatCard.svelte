<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		label,
		value,
		sub,
		icon,
		tone = 'neutral'
	}: {
		label: string;
		value: string | number;
		sub?: string;
		icon?: Snippet;
		tone?: 'neutral' | 'amber' | 'blue' | 'red' | 'emerald';
	} = $props();

	const swatches: Record<string, string> = {
		neutral: 'bg-gray-100 text-gray-600',
		amber: 'bg-amber-50 text-amber-600',
		blue: 'bg-blue-50 text-blue-600',
		red: 'bg-red-50 text-red-600',
		emerald: 'bg-emerald-50 text-emerald-600'
	};
</script>

<div class="rounded-xl border border-admin-border bg-white p-5 shadow-sm">
	<div class="flex items-center gap-4">
		{#if icon}
			<span class={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${swatches[tone]}`}>
				{@render icon()}
			</span>
		{/if}
		<div class="min-w-0">
			<p class="truncate text-sm font-medium text-gray-500">{label}</p>
			<div class="mt-0.5 flex items-baseline gap-2">
				<p class="text-2xl font-semibold tracking-tight text-gray-900">{value}</p>
				{#if sub}<p class="text-sm font-medium text-gray-400">{sub}</p>{/if}
			</div>
		</div>
	</div>
</div>
