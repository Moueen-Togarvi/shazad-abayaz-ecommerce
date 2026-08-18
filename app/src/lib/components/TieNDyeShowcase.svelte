<script lang="ts">
	import { cloudinaryUrl } from '$lib/shared/cloudinary-image';

	let { products = [] } = $props<{ products?: Array<any> }>();
	let showcaseProducts = $derived(products.slice(0, 4));

	function productHref(product: any) {
		return `/shop/${product.slug}`;
	}

	function primaryImage(product: any) {
		return cloudinaryUrl(product.images?.[0]?.url || '/image.webp', 720);
	}

	function detailImage(product: any) {
		return cloudinaryUrl(product.images?.[0]?.url || '/image.webp', 320);
	}

	function primaryVariant(product: any) {
		return (
			product.variants?.find((variant: any) => Number(variant.stockCount || 0) > 0) ||
			product.variants?.[0]
		);
	}

	function colorLabel(product: any) {
		return product.images?.[0]?.color || primaryVariant(product)?.color || 'Signature shade';
	}

	function productCaption(product: any) {
		const caption = String(
			product.description || product.fabricDetails || 'Graceful gradient abaya.'
		).trim();
		return caption.length > 92 ? `${caption.slice(0, 89).trimEnd()}...` : caption;
	}
</script>

{#if showcaseProducts.length}
	<section
		class="bg-[#f5f1e9] px-4 py-10 text-[#282725] sm:px-6 sm:py-14 lg:px-8"
		aria-label="Tie N Die Abaya products"
	>
		<div class="mx-auto max-w-6xl">
			<div class="grid grid-cols-2 items-stretch gap-3 sm:gap-5 lg:grid-cols-4">
				{#each showcaseProducts as product}
					<article
						class="flex min-w-0 flex-col items-center rounded-xl border border-[#d8d0c4] bg-[#f8f5ef] px-2 pt-4 pb-5 text-center sm:px-3 sm:pt-5"
					>
						<h3
							class="line-clamp-1 min-h-5 text-[0.68rem] font-semibold tracking-[0.04em] uppercase sm:text-sm"
						>
							{product.name}
						</h3>
						<span
							class="mt-1 inline-flex rounded bg-[#4d4b49] px-2 py-1 text-[0.52rem] leading-none text-white sm:text-[0.65rem]"
						>
							{colorLabel(product)}
						</span>

						<a
							href={productHref(product)}
							class="mt-3 block aspect-[5/6] w-full overflow-hidden bg-[#eee8df] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#282725]"
							aria-label={`View ${product.name}`}
						>
							<img
								src={primaryImage(product)}
								alt={product.images?.[0]?.altText || product.name}
								width="720"
								height="900"
								class="h-full w-full object-contain object-bottom"
								loading="lazy"
								decoding="async"
							/>
						</a>

						<div
							class="-mt-10 size-20 overflow-hidden rounded-full border-2 border-white bg-[#ded6ca] shadow-[0_4px_12px_rgba(0,0,0,0.15)] sm:-mt-14 sm:size-28"
						>
							<img
								src={detailImage(product)}
								alt={`${product.name} fabric detail`}
								width="320"
								height="320"
								class="h-full w-full scale-[1.8] object-cover object-bottom"
								loading="lazy"
								decoding="async"
							/>
						</div>

						<a
							href={productHref(product)}
							class="mt-3 line-clamp-2 max-w-[14rem] text-[0.58rem] leading-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#282725] sm:text-xs sm:leading-5"
						>
							{productCaption(product)}
						</a>
					</article>
				{/each}
			</div>
		</div>
	</section>
{/if}
