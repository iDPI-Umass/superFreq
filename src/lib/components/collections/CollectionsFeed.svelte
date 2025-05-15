<script lang="ts">
	import CoverArt from '../CoverArt.svelte';

	interface ComponentProps {
		sessionUserId: string;
		feedItems: App.RowData[];
		mode: string;
		remaining?: number;
		postEditState?: boolean;
		userActionSuccess?: boolean | null;
		collections?: App.RowData[];
		showCollectionsListModal?: boolean;
		showSaveSucessModal?: boolean;
	}

	let {
		sessionUserId,
		feedItems,
		mode,
		remaining,
		postEditState,
		userActionSuccess = null,
		collections = [],
		showCollectionsListModal = $bindable(false),
		showSaveSucessModal = $bindable(false)
	}: ComponentProps = $props();

	function avatarItem(item: App.RowData) {
		const avatar = {
			img_url: item.avatar_url,
			last_fm_img_url: item.last_fm_avatar_url,
			artist_name: item.avatar_artist_name,
			release_group_name: item.avatar_release_group_name
		};
		return avatar;
	}

	let loadingMore = $state(false);
</script>

<div class="collection-feed-wrapper"></div>
{#if feedItems.length == 0}
	<div class="feed-item-one-liner">
		<p>
			Nothing in your feed? Try following some more <a href="/users">users</a> and
			<a href="/collections">collections</a>.
		</p>
	</div>
{/if}
{#each feedItems as item}
	<div class="feed-item">
		{#if item.item_type == 'collection_follow' && item.user_id != item.collection_owner_id}
			<a href={`/collection/${item.collection_id}`}>
				<div class="feed-item-one-liner">
					<CoverArt
						item={avatarItem(item)}
						altText={`${item.display_name}'s avatar`}
						imgClass="feed-avatar"
					></CoverArt>
					<span class="blurb">
						{item.user_id == sessionUserId ? 'You' : item.display_name}
						followed {item.collection_owner_id == sessionUserId ? 'your' : 'a'} collection:
						<span class="feed-item-subject">
							{item.collection_title}
						</span>
					</span>
				</div>
			</a>
			<!-- Collection edit -->
		{:else if item.item_type == 'collection_edit' && !item.item_type.is_top_albums}
			<a href={`/collection/${item.collection_id}`}>
				<div class="feed-item-one-liner">
					<CoverArt
						item={avatarItem(item)}
						altText={`${item.display_name}'s avatar`}
						imgClass="feed-avatar"
					></CoverArt>
					<span class="blurb">
						{item.user_id == sessionUserId ? 'You' : item.display_name}
						edited the collection:
						<span class="feed-item-subject">
							{item.collection_title}
						</span>
					</span>
				</div>
			</a>
			<!-- Top albums collection edit -->
		{:else if item.item_type == 'collection_edit' && item.item_type.is_top_albums}
			<a href={`/user/${item.username}`}>
				<div class="feed-item-one-liner">
					<CoverArt
						item={avatarItem(item)}
						altText={`${item.display_name}'s avatar`}
						imgClass="feed-avatar"
					></CoverArt>
					<span class="blurb">
						{item.user_id == sessionUserId ? 'You' : item.display_name}
						edited their
						<span class="feed-item-subject"> Top Albums </span>
						collection
					</span>
				</div>
			</a>
		{/if}
	</div>
{/each}
<div class="button-spacer">
	<button class="standard"> load more </button>
</div>

<style>
    .button-spacer {
        width: 100%;
        display: flex;
        justify-content: center;
    }
</style>
