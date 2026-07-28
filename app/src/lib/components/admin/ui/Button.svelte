<script lang="ts" module>
	export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
	export type ButtonSize = 'sm' | 'md';
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

	type Props = {
		variant?: ButtonVariant;
		size?: ButtonSize;
		href?: string;
		type?: 'button' | 'submit' | 'reset';
		class?: string;
		children: Snippet;
	};

	let {
		variant = 'primary',
		size = 'md',
		href,
		type = 'button',
		class: klass = '',
		children,
		...rest
	}: Props & HTMLAnchorAttributes & HTMLButtonAttributes = $props();

	const base =
		'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

	const sizes: Record<ButtonSize, string> = {
		sm: 'px-3 py-1.5 text-xs',
		md: 'px-4 py-2.5 text-sm'
	};

	const variants: Record<ButtonVariant, string> = {
		primary:
			'bg-admin-primary text-white shadow-sm hover:bg-admin-primary-hover focus-visible:ring-admin-primary/40',
		secondary:
			'border border-admin-border bg-white text-gray-700 shadow-sm hover:bg-gray-50 focus-visible:ring-gray-400/40',
		ghost: 'text-gray-600 hover:bg-gray-100 focus-visible:ring-gray-400/40',
		danger:
			'border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 focus-visible:ring-red-400/40'
	};

	const classes = $derived(`${base} ${sizes[size]} ${variants[variant]} ${klass}`);
</script>

{#if href}
	<a {href} class={classes} {...rest}>{@render children()}</a>
{:else}
	<button {type} class={classes} {...rest}>{@render children()}</button>
{/if}
