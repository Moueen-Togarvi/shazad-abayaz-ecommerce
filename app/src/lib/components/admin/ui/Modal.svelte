<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		open = false,
		title = '',
		description = '',
		onClose,
		children,
		actions
	}: {
		open?: boolean;
		title?: string;
		description?: string;
		onClose?: () => void;
		children?: Snippet;
		actions?: Snippet;
	} = $props();

	function handleBackdrop(event: MouseEvent) {
		if (event.target === event.currentTarget) onClose?.();
	}

	function handleKey(event: KeyboardEvent) {
		if (event.key === 'Escape') onClose?.();
	}
</script>

{#if open}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
		role="dialog"
		aria-modal="true"
		tabindex="-1"
		onclick={handleBackdrop}
		onkeydown={handleKey}
	>
		<div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
			<div class="flex items-start justify-between gap-4">
				<div class="min-w-0">
					{#if title}<h2 class="text-lg font-semibold text-gray-900">{title}</h2>{/if}
					{#if description}<p class="mt-2 text-sm leading-6 text-gray-500">{description}</p>{/if}
				</div>
				{#if onClose}
					<button
						type="button"
						class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700"
						aria-label="Close dialog"
						onclick={onClose}
					>
						<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				{/if}
			</div>

			{#if children}<div class="mt-4">{@render children()}</div>{/if}

			{#if actions}
				<div class="mt-6 flex justify-end gap-3">{@render actions()}</div>
			{/if}
		</div>
	</div>
{/if}
