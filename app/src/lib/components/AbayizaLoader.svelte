<script lang="ts">
	let { class: className = '' } = $props<{ class?: string }>();
</script>

<svg
	class={className}
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 56 56"
	role="img"
	aria-label="Needle"
>
	<title>Needle</title>
	<desc>A 3-cell needle pivots around the center through eight directions.</desc>
	<defs>
		<circle id="b" r="2.4" fill="#ffffff" opacity="0.07" />
		<circle id="l" r="3.1" />
	</defs>
	<style>
		.b {
			fill: #ffffff;
			opacity: 0.1;
		}
		.l {
			fill: #ffffff;
			opacity: 1;
			animation: icon-41-k 900ms ease-in-out infinite both;
		}
		.loader-orbit {
			transform-origin: 28px 28px;
		}
		.loader-reduced {
			display: none;
		}
		@media (prefers-reduced-motion: reduce) {
			.loader-orbit {
				display: none;
			}
			.loader-reduced {
				display: block;
			}
			.l {
				animation: none;
				opacity: 0.82;
			}
		}
		@keyframes icon-41-k {
			0% {
				opacity: 0.6;
			}
			50% {
				opacity: 1;
			}
			100% {
				opacity: 0.6;
			}
		}
	</style>
	<use class="b" href="#b" x="6" y="6" />
	<use class="b" href="#b" x="17" y="6" />
	<use class="b" href="#b" x="28" y="6" />
	<use class="b" href="#b" x="39" y="6" />
	<use class="b" href="#b" x="50" y="6" />
	<use class="b" href="#b" x="6" y="17" />
	<use class="b" href="#b" x="17" y="17" />
	<use class="b" href="#b" x="28" y="17" />
	<use class="b" href="#b" x="39" y="17" />
	<use class="b" href="#b" x="50" y="17" />
	<use class="b" href="#b" x="6" y="28" />
	<use class="b" href="#b" x="17" y="28" />
	<use class="b" href="#b" x="28" y="28" />
	<use class="b" href="#b" x="39" y="28" />
	<use class="b" href="#b" x="50" y="28" />
	<use class="b" href="#b" x="6" y="39" />
	<use class="b" href="#b" x="17" y="39" />
	<use class="b" href="#b" x="28" y="39" />
	<use class="b" href="#b" x="39" y="39" />
	<use class="b" href="#b" x="50" y="39" />
	<use class="b" href="#b" x="6" y="50" />
	<use class="b" href="#b" x="17" y="50" />
	<use class="b" href="#b" x="28" y="50" />
	<use class="b" href="#b" x="39" y="50" />
	<use class="b" href="#b" x="50" y="50" />
	<g class="loader-orbit">
		<animateTransform
			attributeName="transform"
			type="rotate"
			from="0 28 28"
			to="360 28 28"
			dur="0.9s"
			repeatCount="indefinite"
		/>
		<use class="l" href="#l" x="28" y="6" />
		<use class="l" href="#l" x="28" y="17" />
		<use class="l" href="#l" x="28" y="28" />
	</g>
	<g class="loader-reduced">
		<use class="l" href="#l" x="28" y="6" />
		<use class="l" href="#l" x="28" y="17" />
		<use class="l" href="#l" x="28" y="28" />
	</g>
</svg>
