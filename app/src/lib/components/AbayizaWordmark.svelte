<script lang="ts">
	let { class: className = '', ariaLabel = "Shahzad Abaya's" } = $props<{
		class?: string;
		ariaLabel?: string;
	}>();
</script>

<span class={`abayiza-wordmark ${className}`} aria-label={ariaLabel}>Shahzad Abaya's</span>
