<script lang="ts">
	import { enhance } from '$app/forms'
	import type { SubmitFunction } from '@sveltejs/kit'
	import MusicBrainzSearch from '$lib/components/MusicBrainzSearch.svelte'
	import PanelHeader from '$lib/components/PanelHeader.svelte';
	import type { ActionData, PageData } from './$types'
	export let data: PageData;
	export let form: ActionData;

	let { user, sessionUserId, profile } = data
	$: ({ user, sessionUserId, profile } = data)

	let avatarItem: any
	let newItemAdded: boolean
	let profileForm: HTMLFormElement
	let loading = false
	let complete = false
	let displayName: string = profile?.display_name ?? ''
	let username: string = profile?.username ?? ''
	let website: string = profile?.website ?? ''
	$: avatarMbid = avatarItem?.release_group_mbid ??profile?.avatar_mbid ?? ''
	let avatarUrl: string = avatarItem?.avatar_url ?? profile?.avatar_url ?? ''
	let about: string = profile?.about ?? ''
	let email: string = user?.email as string


	// sets avatar to local storage
	// const handleSubmit: SubmitFunction = () => {
	// 	loading = true
	// 	console.log(avatarItem ? avatarItem : "no avatar")

	// 	const profileStorageItem = {
	// 		"displayName": displayName,
	// 		"username": username,
	// 		"avatarUrl": avatarItem?.img_url
	// 	}

	// 	localStorage.setItem("profile", JSON.stringify(profileStorageItem))

	// 	profileStoresObject.set(profileStorageItem)

	// 	return async ({ result }) => {
	// 		loading = false
	// 	}
	// }
</script>

<div class="panel" id="profile-info">
	<PanelHeader>
		profile info
	</PanelHeader>
	<div class="form-wrapper">
		<form
			id="account-data"
			class="form-column"
			method="post"
			action="?/update"
			use:enhance
			bind:this={profileForm}
		>
			<div class="label-group">
				<label 
					class="text-label" 
					for="email"
					form="account-data"
				>
					Email
				</label>
				<a href="/account/update-email">
					update email
				</a>
			</div>
			<input
				class="text" 
				type="text" 
				name="email" 
				id="email"
				form="account-data"
				value={email} 
				disabled 
			/>
			<div class="label-group">
				<label 
					class="text-label"  
					for="username"
					form="account-data"
				>
					Username
				</label>
				<a href="/account/update-username">
					update username
				</a>
			</div>
			<input
				class="text"
				type="text"
				name="username"
				id="username"
				form="account-data"
				value={username}
				disabled 
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
				value={displayName} 
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
				value={about}
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
				value={website} 
			/>
			<input 
				type="text" 
				name="avatarUrl" 
				id="avatarUrl" 
				value={avatarItem?.img_url ?? avatarUrl} 
			/>
			<input 
				type="text" 
				name="avatarMbid" 
				id="avatarMbid" 
				value={avatarMbid} 
			/>
			<input 
				type="text" 
				name="avatarName" 
				id="avatarName" 
				value={avatarItem?.release_group_name} 
				disabled
			/>
		</form>
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
			<div class="mb-search">
				<MusicBrainzSearch
					searchCategory="release_groups"
					searchButtonText="search"
					searchPlaceholder="Search for an album"
					bind:addedItems={avatarItem}
					bind:newItemAdded={newItemAdded}
					mode="single"
				>
				</MusicBrainzSearch>
			</div>
			<!-- add alt text and change column in postgres -->
			{#if avatarUrl && !newItemAdded}
				<img src={avatarUrl} alt="user avatar"/>
			{:else if avatarItem && newItemAdded}
				<img src={avatarItem.img_url} alt="user avatar"/>
			{/if}
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
	</div>
</div>



<style>
	.form-wrapper {
		display: flex;
		flex-direction: row;
		gap: var(--freq-width-spacer);
		margin: var(--freq-height-spacer) var(--freq-width-spacer);
	}
	.mb-search {
		margin: var(--freq-height-spacer-half) 0;
	}
	.actions {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin: var(--freq-height-spacer-quarter) 0;
	}
	img {
		margin: var(--freq-height-spacer-half) 0 0 0;
		width: 90%;
	}
	@media screen and (max-width: 700px) {
		.form-wrapper {
			max-width: 700px;
			display: flex;
			flex-direction: column;
			gap: var(--freq-width-spacer);
			margin: var(--freq-height-spacer) var(--freq-width-spacer);
		}
		img {
			width: 50%;
		}
	}
</style>