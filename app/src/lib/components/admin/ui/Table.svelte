<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		columns = [],
		emptyTitle = 'Nothing here yet',
		emptyDescription = '',
		isEmpty = false,
		colspan = 1,
		class: klass = '',
		children
	}: {
		columns?: string[];
		emptyTitle?: string;
		emptyDescription?: string;
		isEmpty?: boolean;
		colspan?: number;
		class?: string;
		children: Snippet;
	} = $props();
</script>

<div class={`overflow-hidden rounded-xl border border-admin-border bg-white shadow-sm ${klass}`}>
	<div class="overflow-x-auto">
		<table class="min-w-full divide-y divide-admin-border">
			<thead class="bg-gray-50/80">
				<tr>
					{#each columns as column}
						<th
							scope="col"
							class="px-6 py-3 text-left text-xs font-semibold tracking-wide text-gray-500 uppercase whitespace-nowrap"
						>
							{column}
						</th>
					{/each}
				</tr>
			</thead>
			<tbody class="divide-y divide-admin-border">
				{#if isEmpty}
					<tr>
						<td {colspan} class="px-6 py-12 text-center">
							<p class="text-sm font-medium text-gray-500">{emptyTitle}</p>
							{#if emptyDescription}
								<p class="mt-1 text-sm text-gray-400">{emptyDescription}</p>
							{/if}
						</td>
					</tr>
				{:else}
					{@render children()}
				{/if}
			</tbody>
		</table>
	</div>
</div>
