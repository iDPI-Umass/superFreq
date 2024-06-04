<!-- src/routes/account/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import MusicBrainzSearch from '$lib/components/MusicBrainzSearch.svelte';
	import PanelHeader from '$lib/components/PanelHeader.svelte';

	export let data;
	export let form;

	let { session, supabase, profile } = data;
	$: ({ session, supabase, profile } = data);

	let profileForm: HTMLFormElement
	let loading = false
	let complete = false
	let displayName: string = profile?.display_name ?? ''
	let username: string = profile?.username ?? ''
	let website: string = profile?.website ?? ''
	let avatarMbid: string = profile?.avatar_mbid ?? ''
	let avatarUrl: string = profile?.avatar_url ?? ''
	let about: string = profile?.about ?? ''

	let avatarItem: any
	let newItemAdded: boolean


	// adds item from MusicBrainz search results to collection editor

	const handleSubmit: SubmitFunction = () => {
		loading = true
		console.log(avatarItem ? avatarItem : "no avatar")

		const profileStorageItem = {
			"displayName": displayName,
			"username": username,
			"avatarUrl": avatarUrl
		}

		localStorage.setItem("profile", JSON.stringify(profileStorageItem))

		return async ({ result }) => {
			loading = false
		}
	}

	const handleSignOut: SubmitFunction = () => {
		loading = true
		localStorage.removeItem("profile")
		return async ({ update }) => {
			loading = false
			update()
		}
	}
</script>

<div class="panel" id="profile-info">
	<PanelHeader>
		profile info
	</PanelHeader>
	<form
		class="horizontal"
		id="account-data"
		method="post"
		action="?/update"
		use:enhance={handleSubmit}
		bind:this={profileForm}
	>
		<div class="form-column">
			<label 
				class="text-label" 
				for="email"
				form="account-data"
			>
				Email
			</label>
			<input
				class="text" 
				type="text" 
				name="email" 
				id="email"
				form="account-data"
				value={form?.email ?? session.user.email} 
				disabled 
			/>
			<label 
				class="text-label"  
				for="username"
				form="account-data"
			>
				Username
			</label>
			<input
				class="text"
				type="text"
				name="username"
				id="username"
				form="account-data"
				value={form?.username ?? username} 
			/>
			<label 
				class="text-label"
				for="displayName"
			>
				Display name
			</label>
			<input 
				class="text" 
				type="text" 
				name="displayName" 
				id="displayName" 
				value={form?.displayName ?? displayName} 
			/>

			
			<label 
				class="text-label" 
				for="description"
			>
				about me
			</label>
			<textarea
				id="about"
				name="about"
				rows="3"
				cols="1"
				maxlength="140"
				spellcheck=true 
				value={form?.about ?? about}
			></textarea>

			<label 
				class="text-label" 
				for="website"
			>
				Website
			</label>
			<input 
				class="text" 
				type="url" 
				name="website" 
				id="website" 
				value={form?.website ?? website} 
			/>
			<input 
				type="hidden" 
				name="avatarUrl" 
				id="avatarUrl" 
				value={form?.avatarUrl ?? (avatarItem?.imgUrl ?? avatarUrl)} 
			/>
			<input 
				type="hidden" 
				name="avatarMbid" 
				id="avatarMbid" 
				value={form?.avatarMbid ?? (avatarItem?.releaseGroupMbid ?? avatarMbid)} 
			/>
		</div>
		<div class="form-column">
			<label 
				class="text-label" 
				for="avatarUrl"
			>
				choose an album cover for your avatar
			</label>
			<!--
				Form to search for avatar url
			-->
			<MusicBrainzSearch
				searchCategory="release_groups"
				searchButtonText="search"
				searchPlaceholder="Search for an album"
				bind:addedItems={avatarItem}
				bind:newItemAdded={newItemAdded}
				mode="single"
			>
			</MusicBrainzSearch>
			<!-- add alt text and change column in postgres -->
			{#if avatarUrl && !newItemAdded}
				<img src={avatarUrl} alt="user avatar"/>
			{:else if avatarItem && newItemAdded}
				<img src={avatarItem.imgUrl} alt="user avatar"/>
			{/if}
		</div>
	</form>

	{#if form?.success}
		<p>update submitted</p>
	{/if}
	<div class="actions">
		<button
			form="account-data"
			class="double-border-top"
			type="submit"
			disabled={loading}
			>
			<div class="inner-border">
				{loading ? 'Loading...' : 'Update profile'}
			</div>
		</button>
		<form 
			class="signout"
			method="post" 
			action="?/signout" 
			use:enhance={handleSignOut}
			>
			<button 
				class="double-border-top" 
				type="submit" 
				disabled={loading}
			>
				<div class="inner-border">
					Sign Out
				</div>
			</button>
		</form>

	</div>

</div>



<style>
	.actions {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin: var(--freq-height-spacer-quarter) var(--freq-width-spacer);
	}
	img {
		margin: var(--freq-height-spacer-half) 0 0 auto;
		width: 100%;
	}
</style>