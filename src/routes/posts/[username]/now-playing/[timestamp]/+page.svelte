<script lang="ts">
	import SEO from '$lib/components/layout/SEO.svelte';
	import NowPlayingPost from 'src/lib/components/Posts/NowPlayingPost.svelte';
	import PostReply from 'src/lib/components/Posts/PostReply.svelte';
	import PostReplyEditor from 'src/lib/components/Posts/PostReplyEditor.svelte';

	let { data, form } = $props();

	let { post, replies, collections, postTimestamp } = $derived(data);

	let sessionUserId = data?.sessionUserId as string;

	let actionSuccess = $derived(form?.success as boolean);

	let showCollectionsListModal = $derived(form?.showCollectionsModal ?? false);
	let showSaveSucessModal = $derived(form?.updateSuccess ?? false);

	function replyId(username: string, createdAt: Date) {
		const replyTimestampString = createdAt.toISOString();
		const replyTimestamp = Date.parse(replyTimestampString).toString();
		const slug = username?.concat(replyTimestamp);
		return slug;
	}

	let editState = $state(false);
</script>

<SEO
	title="{post?.display_name}'s Now Playing post"
	description="{post?.artist_name ?? post?.user_added_artist_name}: {post?.release_group_name ??
		post.user_added_release_group_name ??
		post?.recording_name ??
		post?.user_added_recording_name ??
		post?.episode_title}"
></SEO>

{#snippet formInputs(formName: string)}
	<input type="hidden" name="post-id" id="post-id" form={formName} value={post?.id} />
	<input type="hidden" name="reaction-type" id="reaction-type" form="submitReaction" value="like" />
	<input
		type="hidden"
		name="post-username"
		id="post-username"
		form={formName}
		value={post?.username}
	/>
	<input
		type="hidden"
		name="post-timestamp"
		id="post-timestamp"
		form={formName}
		value={postTimestamp}
	/>
{/snippet}

<div class="post-panel">
	{@render formInputs('submitReply')}
	{@render formInputs('submitReaction')}
	{@render formInputs('delete')}
	{@render formInputs('edit')}
	{@render formInputs('flagPost')}
	{#if post?.status != 'deleted'}
		<NowPlayingPost
			{sessionUserId}
			{post}
			userActionSuccess={actionSuccess}
			{collections}
			showCollectionsModal={showCollectionsListModal}
			{showSaveSucessModal}
		></NowPlayingPost>
		<PostReplyEditor></PostReplyEditor>
		{#each replies as reply}
			<div id={replyId(reply.username, reply.created_at)}>
				<div class="comment-panel">
					<PostReply {reply} {sessionUserId} userActionSuccess={actionSuccess} allowReply={true}
					></PostReply>
				</div>
			</div>
		{/each}
	{:else}
		<div class="panel">
			<p>This post has been deleted.</p>
		</div>
	{/if}
</div>
