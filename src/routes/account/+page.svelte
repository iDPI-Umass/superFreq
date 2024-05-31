<!-- src/routes/account/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import MusicBrainzSearch from '$lib/components/MusicBrainzSearch.svelte';

	export let data;
	export let form;

	let { session, supabase, profile } = data;
	$: ({ session, supabase, profile } = data);

	console.log( session )

	let profileForm: HTMLFormElement
	let loading = false
	let complete = false
	let displayName: string = profile?.display_name ?? ''
	let username: string = profile?.username ?? ''
	let website: string = profile?.website ?? ''
	let avatarUrl: string = profile?.avatar_url ?? ''

	let avatarItem: any
	let newItemAdded: boolean

	// adds item from MusicBrainz search results to collection editor

	const handleSubmit: SubmitFunction = () => {
		loading = true
		console.log(avatarItem)
		return async ({ result }) => {
			loading = false
		}
	}

	const handleSignOut: SubmitFunction = () => {
		loading = true
		return async ({ update }) => {
			loading = false
			update()
		}
	}
</script>

<div class="account-form">
	<form
		method="post"
		action="?/update"
		use:enhance={handleSubmit}
		bind:this={profileForm}
	>
		<div class="form-item">
			<p>Email: {session.user.email}</p>
		</div>

		<div class="form-item">
			<label for="username">Username</label>
			<input id="username" name="username" type="text" value={form?.username ?? username} />
		</div>

		<div class="form-item">
			<label for="displayName">Display name</label>
			<input id="displayName" name="displayName" type="text" value={form?.displayName ?? displayName} />
		</div>

		<div class="form-item">
			<label for="website">Website</label>
			<input id="website" name="website" type="url" value={form?.website ?? website} />
		</div>

		<div class="form-item">
			<label for="avatarUrl">avatarUrl</label>
			<input id="avatarUrl" name="avatarUrl" type="url" value={form?.avatarUrl ?? (avatarItem?.imgUrl ?? avatarUrl)} />
		</div>

		<!-- add alt text and change column in postgres -->
		{#if avatarUrl && !newItemAdded}
			<img src={avatarUrl} alt="user avatar"/>
		{:else if avatarItem && newItemAdded}
			<img src={avatarItem.imgUrl} alt="user avatar"/>
		{/if}

		<div class="form-item">
			<input
				type="submit"
				value={loading ? 'Loading...' : 'Update'}
				disabled={loading}
			/>
		</div>
	</form>
	{#if form?.success}
		<p>update submitted</p>
	{/if}
	<form method="post" action="?/signout" use:enhance={handleSignOut}>
		<div>
			<button disabled={loading}>Sign Out</button>
		</div>
	</form>
</div>

<!--
	Form to search for avatar url
-->
<MusicBrainzSearch
	collectionType="release_groups"
	searchButtonText="search"
	searchPlaceholder="enter album name"
	bind:addedItems={avatarItem}
	bind:newItemAdded={newItemAdded}
	mode="single"
>
</MusicBrainzSearch>

<style>
	.account-form {
		max-width: 100%;
	}
	.form-item{
		flex-flow: row wrap;
	}
	img {
		width: 200px;
	}
</style>