<script lang="ts">
	import { productPixelPayload, trackAddToWishlist } from '$lib/client/pixels';
	import { wishlist, type WishlistItem } from '$lib/client/wishlist.svelte';

	let {
		product,
		class: className = '',
		savedClass = 'border-[#c5a880] bg-[#c5a880] text-white',
		iconClass = 'h-4 w-4'
	} = $props<{
		product: any;
		class?: string;
		savedClass?: string;
		iconClass?: string;
	}>();

	let saved = $derived(wishlist.has(product?.id));

	function primaryVariant(item: any) {
		return (
			item?.variants?.find((variant: any) => Number(variant.stockCount || 0) > 0) ||
			item?.variants?.[0]
		);
	}

	function productImage(item: any) {
		return (
			item?.images?.[0]?.url || item?.image || item?.collections?.[0]?.imageUrl || '/image.png'
		);
	}

	function productCategory(item: any) {
		return item?.collections?.[0]?.name || item?.category || 'Abayiza';
	}

	function wishlistItem(item: any): WishlistItem {
		const variant = primaryVariant(item);

		return {
			id: String(item?.id || ''),
			slug: item?.slug || String(item?.id || ''),
			name: item?.name || 'Abayiza abaya',
			price: Number(item?.price || item?.salePrice || 0),
			salePrice: item?.salePrice ? Number(item.salePrice) : null,
			image: productImage(item),
			category: productCategory(item),
			color: variant?.color || item?.color,
			size: variant?.size || item?.size,
			description: item?.description || ''
		};
	}

	function toggleWishlist(event: MouseEvent) {
		event.preventDefault();
		event.stopPropagation();
		const wasSaved = saved;

		wishlist.toggle(wishlistItem(product));

		if (!wasSaved) {
			trackAddToWishlist(productPixelPayload(product));
		}
	}
</script>

<button
	type="button"
	class={`${className} ${saved ? savedClass : ''}`}
	aria-label={saved
		? `Remove ${product?.name || 'item'} from wishlist`
		: `Add ${product?.name || 'item'} to wishlist`}
	aria-pressed={saved}
	onclick={toggleWishlist}
>
	<svg
		class={iconClass}
		fill={saved ? 'currentColor' : 'none'}
		viewBox="0 0 24 24"
		stroke="currentColor"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="1.8"
			d="M12 20.25l-1.45-1.32C5.4 14.36 2 11.28 2 7.5A4.5 4.5 0 016.5 3c1.74 0 3.41.81 4.5 2.09A5.96 5.96 0 0115.5 3 4.5 4.5 0 0120 7.5c0 3.78-3.4 6.86-8.55 11.43L12 20.25z"
		/>
	</svg>
</button>
