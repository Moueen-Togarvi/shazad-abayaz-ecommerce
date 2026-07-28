<script lang="ts">
	let { class: className = '', ariaLabel = 'Abayiza' } = $props<{
		class?: string;
		ariaLabel?: string;
	}>();
</script>

<span class={`abayiza-wordmark ${className}`} aria-label={ariaLabel}>
	<span>A</span><span>B</span><span>A</span><span>Y</span><span>I</span><span
		class="abayiza-wordmark__z">Z</span
	><span>A</span>
</span>
