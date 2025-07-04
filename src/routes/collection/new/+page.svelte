<script lang="ts">
	import { onMount } from 'svelte';
	import SEO from '$lib/components/layout/SEO.svelte';
	import PanelHeader from 'src/lib/components/layout/PanelHeader.svelte';
	import Tooltip from 'src/lib/components/layout/Tooltip.svelte';
	import InfoBox from 'src/lib/components/layout/InfoBox.svelte';
	import CollectionEditor from 'src/lib/components/collections/CollectionEditor.svelte';

	import { promiseStates, collectionData, searchResults } from 'src/lib/resources/states.svelte';

	interface Props {
		data: any;
	}

	let { data }: Props = $props();
	let { infoBoxText, collectionSearchResults } = $derived(data);

	collectionData.title = null;
	collectionData.type = null;
	collectionData.status = null;
	collectionData.defaultSort = null;
	collectionData.collectionItems = [];

	onMount(() => {
		promiseStates.newItemAdded = false;
		promiseStates.imgPromise = null;
		collectionData.title = null;
		collectionData.type = null;
		collectionData.status = null;
		collectionData.defaultSort = null;
		collectionData.collectionItems = [];
	});

	$effect(() => {
		searchResults.results = collectionSearchResults;
		searchResults.category = 'collections';
	});
</script>

<SEO title="New collection"></SEO>

<InfoBox mode="compact">
	A collection is a list of albums, tracks, mixes, or artists. Among many other things, you can make
	a colleciton to keep track of music you want to listen to or create a resource for other people
	who might want to learn more about music you love.
</InfoBox>

<div class="collection-container">
	<PanelHeader>
		{#snippet headerText()}
			<span> new collection </span>
		{/snippet}
	</PanelHeader>
	<form class="horizontal" method="POST" action="?/insertCollection">
		<div class="form-column">
			<input
				type="hidden"
				name="collection-contents"
				id="collection-contents"
				value={JSON.stringify(collectionData.collectionItems)}
			/>
			<div class="label-group">
				<label class="text-label" for="collection-title"> collection name </label>
				<span class="label-explainer"> * required </span>
			</div>
			<input
				class="text"
				type="text"
				name="collection-title"
				id="collection-title"
				bind:value={collectionData.title}
				required
			/>
			<fieldset>
				<div class="label-group">
					<legend>view sort</legend>
					<Tooltip>
						This how your collection is sorted by default when other users view it. This does not
						change or effect the order of the items in the editor below.
					</Tooltip>
				</div>
				<ul>
					<li>
						<input
							class="radio"
							type="radio"
							name="view-sort"
							id="default"
							value="default"
							checked
						/>
						<label for="default">default</label>
					</li>
					<li>
						<input class="radio" type="radio" name="view-sort" id="reverse" value="reverse" />
						<label for="reverse">reverse</label>
					</li>
					<li>
						<input class="radio" type="radio" name="view-sort" id="artist-asc" value="artist_asc" />
						<label for="artist-asc">artists a --> z</label>
					</li>
					<li>
						<input
							class="radio"
							type="radio"
							name="view-sort"
							id="artist-desc"
							value="artist_desc"
						/>
						<label for="artist-desc">artists z --> a</label>
					</li>
				</ul>
			</fieldset>
			<fieldset>
				<div class="label-group">
					<legend>Status of collection</legend>
					<Tooltip>
						<u>Open</u> collections can be viewed and edited by anyone.
						<br />
						<br />
						<u>Public</u> collections can be viewed by anyone, but only edited by you.
						<br />
						<br />
						<u>Private</u> collections can only be viewed and edited by you.
					</Tooltip>
				</div>
				<span class="label-explainer"> * required </span>
				<ul>
					<li>
						<input
							class="radio"
							type="radio"
							name="status"
							id="open"
							value="open"
							bind:group={collectionData.status}
						/>
						<label for="open">open</label>
					</li>
					<li>
						<input
							class="radio"
							type="radio"
							name="status"
							id="public"
							value="public"
							bind:group={collectionData.status}
						/>
						<label for="public">public</label>
					</li>
					<li>
						<input
							class="radio"
							type="radio"
							name="status"
							id="private"
							value="private"
							bind:group={collectionData.status}
						/>
						<label for="private">private</label>
					</li>
				</ul>
			</fieldset>
			{#if collectionData.status && collectionData.status != 'public'}
				<InfoBox mode="inline">
					{infoBoxText[collectionData.status]}
				</InfoBox>
			{/if}
		</div>
		<div class="form-column">
			<label class="text-label" for="description"> Collection Description </label>
			<textarea id="description" name="description" rows="10" cols="1" spellcheck="true" required
			></textarea>
			<div class="collection-info-button-spacing">
				<button
					class="double-border-top"
					type="submit"
					formAction="?/insertCollection"
					disabled={!(
						collectionData.status &&
						collectionData.title &&
						collectionData.collectionItems.length > 0
					)}
				>
					<div class="inner-border">create new collection</div>
				</button>
			</div>
		</div>
	</form>
	<CollectionEditor></CollectionEditor>
	<div class="bottom-double-border"></div>
</div>

<div class="buffer"></div>

<style>
	.bottom-double-border {
		padding-top: var(--freq-spacing-3x-small);
	}
	.buffer {
		padding-bottom: var(--freq-spacing-large);
	}
</style>
