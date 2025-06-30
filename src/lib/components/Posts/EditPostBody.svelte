<script lang="ts">
	import { enhance } from '$app/forms';
	import { interactionStates, feedData } from '$lib/resources/states.svelte';
	import { Reply } from '@lucide/svelte';

	interface ComponentProps {
		postData: App.RowData;
		editState: boolean;
	}
	let { postData, editState = $bindable(false) }: ComponentProps = $props();

	function toggleEditState() {
		editState = !editState;
	}

	let loading = $state(false);
	let editedText = $state() as string;
</script>

<form
	method="POST"
	name="editPostText"
	class="vertical"
	action="?/editPost"
	use:enhance={() => {
		loading = true;
		return async ({ update, result }) => {
			loading = false;
			toggleEditState();
			await update();
		};
	}}
>
	<input id="post-data" name="post-data" type="hidden" value={JSON.stringify(postData)} />
	<textarea
		cols="1"
		rows="4"
		id="edited-text"
		name="edited-text"
		spellcheck="true"
		bind:value={editedText}
		required>{postData.text}</textarea
	>
	<div class="edit-submit-options">
		<button class="standard" onclick={toggleEditState}> cancel </button>
		<button type="submit" class="standard" formaction="?/editPost" disabled={loading}>
			submit edit
		</button>
	</div>
</form>

<style>
	.edit-submit-options {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
</style>
