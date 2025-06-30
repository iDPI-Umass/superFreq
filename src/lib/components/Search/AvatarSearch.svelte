<script lang="ts">
	import MusicBrainzSearch from 'src/lib/components/Search/MusicBrainzSearch.svelte';
	import CoverArt from 'src/lib/components/layout/CoverArt.svelte';

	import wave from '$lib/assets/images/logo/freq-wave.svg';

	import { promiseStates, collectionData } from '$lib/resources/states.svelte';

	interface ComponentProps {
		displayName: string;
		avatarUrl: string;
		avatarInfo: App.RowData;
	}

	let { displayName, avatarUrl, avatarInfo }: ComponentProps = $props();

	let avatarArtistName = $derived(avatarInfo['artist_name']) as string;
	let avatarReleaseGroupName = $derived(avatarInfo['release_group_name']) as string;
</script>

{#snippet editorItemImage(avatarItem: any, altText: string)}
	{#await promiseStates.imgPromise}
		<img src={wave} alt="loading cover art" />
		<p>Loading cover art.</p>
	{:then}
		<img
			src={avatarItem['img_url'] ?? avatarItem['last_fm_img_url'] ?? wave}
			alt="{(avatarItem['img_url'] ?? avatarItem['last_fm_img_url'])
				? altText
				: 'no available'} cover art"
		/>
	{/await}
{/snippet}

<div class="mb-search">
	<MusicBrainzSearch
		searchCategory="release_groups"
		searchButtonText="search"
		searchPlaceholder="Search for an album"
		mode="single"
		limit="10"
	></MusicBrainzSearch>
</div>
<span class="tip"> search for album cover to make your profile image </span>
{#if avatarUrl && !promiseStates.newItemAdded}
	<CoverArt
		item={avatarInfo}
		altText="{displayName}'s avatar: {avatarReleaseGroupName} by {avatarArtistName}"
	></CoverArt>
{:else if collectionData.singleItem && promiseStates.newItemAdded}
	{@render editorItemImage(collectionData.singleItem, avatarReleaseGroupName)}
{/if}

<style>
	.mb-search {
		margin: var(--freq-height-spacer-half) 0;
	}
	img {
		margin: var(--freq-height-spacer-half) 0 0 0;
		width: 90%;
	}
</style>
