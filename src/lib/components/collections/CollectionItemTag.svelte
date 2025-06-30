<script lang="ts">
	import BoomBox from '@lucide/svelte/icons/boom-box';
	import Disc from '@lucide/svelte/icons/disc-2';
	import MusicNote from '@lucide/svelte/icons/music';
	import Palette from '@lucide/svelte/icons/palette';
	import File from '@lucide/svelte/icons/file-music';
	import SquareLibrary from '@lucide/svelte/icons/square-library';

	interface ComponentProps {
		display?: boolean;
		itemType: string;
	}

	let { display = true, itemType }: ComponentProps = $props();
</script>

{#if display}
	<span class="inline-block">
		<div class="collection-item-tag">
			{#if itemType && itemType.includes('artist')}
				<Palette size="12" color="var(--freq-color-text-medium-dark)"></Palette>
				<span>artist</span>
			{:else if itemType && itemType.includes('release_group')}
				<Disc size="12" color="var(--freq-color-text-medium-dark)"></Disc>
				<span>album</span>
			{:else if itemType && itemType.includes('recording')}
				<MusicNote size="12" color="var(--freq-color-text-medium-dark)"></MusicNote>
				<span>track</span>
			{:else if itemType && itemType.includes('episode')}
				<BoomBox size="12" color="var(--freq-color-text-medium-dark)"></BoomBox>
				<span>mix</span>
			{:else if itemType && itemType.includes('collection')}
				<SquareLibrary size="12" color="var(--freq-color-text-medium-dark)"></SquareLibrary>
				<br />
				<span>collection</span>
			{:else}
				<span>item</span>
			{/if}
		</div>
	</span>
{/if}

<style>
	.collection-item-tag {
		display: flex;
		flex-flow: row wrap;
		max-width: fit-content;
		padding: var(--freq-spacing-2x-small);
		align-items: center;
		gap: var(--freq-inline-gap-double);
		background-color: var(--freq-color-background-badge-medium);
		background: var(--freq-grid-dark-background);
		color: var(--freq-color-text-medium);
		font-size: var(--freq-font-size-x-small);
		text-transform: uppercase;
		font-weight: var(--freq-font-weight-semi-bold);
		letter-spacing: var(--freq-letter-spacing-looser);
	}
	.inline-block {
		width: 100%;
		display: inline-block;
	}
	.collection-item-tag span {
		/* width: 85%; */
		hyphens: auto;
		overflow-wrap: break-word;
	}
	@media screen and (max-width: 770px) {
		.collection-item-tag {
			gap: var(--freq-inline-gap);
			font-size: var(--freq-font-size-2x-small);
			letter-spacing: var(--freq-letter-spacing-loose);
		}
	}
</style>
