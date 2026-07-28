<script lang="ts" module>
	export type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		tone = 'neutral',
		class: klass = '',
		children
	}: { tone?: BadgeTone; class?: string; children: Snippet } = $props();

	const tones: Record<BadgeTone, string> = {
		neutral: 'bg-gray-100 text-gray-700 ring-gray-200',
		success: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
		warning: 'bg-amber-50 text-amber-800 ring-amber-200',
		danger: 'bg-red-50 text-red-700 ring-red-200',
		info: 'bg-blue-50 text-blue-700 ring-blue-200'
	};
</script>

<span
	class={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${tones[tone]} ${klass}`}
>
	{@render children()}
</span>
