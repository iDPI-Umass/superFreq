<script lang="ts">
	import { enhance } from '$app/forms'
	import { invalidate, invalidateAll } from '$app/navigation'
	import MusicBrainzSearch from '$lib/components/MusicBrainzSearch.svelte'
	import PanelHeader from '$lib/components/PanelHeader.svelte'
	import NotificationModal from '$lib/components/modals/NotificationModal.svelte'
	import CoverArt from '$lib/components/CoverArt.svelte'

	import wave from "$lib/assets/images/logo/freq-wave.svg"
	import { tick } from 'svelte';

	let { data, form } = $props();

	let { user, profile } = $derived(data)

	let success = $derived(form?.success) as boolean

	let newItemAdded = $state(false) as boolean
	let displayName = $derived(profile?.display_name ?? '') as string
	let username = $derived(profile?.username ?? '') as string
	let website = $derived(profile?.website ?? '') as string

	let about = $derived(profile?.about ?? '') as string
	let email = $derived(user?.email as string) as string

	let avatarItem = $state({}) as App.RowData
	let avatarMbid = $derived(avatarItem?.release_group_mbid ?? profile?.avatar_mbid ?? '') as string
	let avatarUrl = $derived(avatarItem?.avatar_url ?? profile?.avatar_url ?? '') as string
	let lastFmImgUrl = $derived(avatarItem?.last_fm_img_url ?? profile?.avatar_last_fm_img_url ?? '') as string
	let avatarArtist = $derived(avatarItem?.artist_name ?? profile?.avatar_artist_name ?? '') as string
	let avatarReleaseGroup = $derived(avatarItem?.release_group_name ?? profile?.avatar_release_group_name ?? '') as string

	let avatarInfo = $derived({
		'img_url': avatarUrl,
		'last_fm_img_url': lastFmImgUrl,
		'artist_name': avatarArtist,
		'artist_mbid': avatarItem?.artist_mbid,
		'release_group_name': avatarReleaseGroup,
		'release_group_mbid': avatarItem?.release_group_mbid,
		'label': avatarItem?.label,
	})

	let imgPromise = $state(null)
	let loading = $derived(( newItemAdded && !imgPromise ) ? true : false )

	$effect.pre(() => {
		invalidateAll()
	})
</script>

<svelte:options runes={true} />

<svelte:head>
	<title>
		Account
	</title>
</svelte:head>

{#snippet editorItemImage(avatarItem: any, altText: string)}
    {#await imgPromise}
    <img 
        src={wave} 
        alt="loading cover art"
    />
	<p>Loading cover art.</p>
    {:then}
        <img 
            src={(avatarItem["img_url"] ?? avatarItem["last_fm_img_url"]) ?? wave } 
            alt="{(avatarItem["img_url"] ?? avatarItem["last_fm_img_url"]) ? altText : 'no available'} cover art"
        />
    {/await}
{/snippet}
 
<div class="panel" id="profile-info">
	<PanelHeader>
		{#snippet headerText()}
				<span >
				profile info
			</span>
		{/snippet}
	</PanelHeader>
	<div class="form-wrapper">
		<form
			id="account-data"
			class="form-column"
			method="post"
			action="?/update"

		>
			<div class="label-group">
				<label 
					class="text-label" 
					for="email"
					form="account-data"
				>
					Email
				</label>
				<a class="label-link" href="/account/update-email">
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
				<a class="label-link" href="/account/update-username">
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
				type="hidden" 
				name="avatarItem" 
				id="avatarmItem" 
				value={JSON.stringify(avatarInfo)} 
			/>
			<input 
				type="hidden" 
				name="avatarUrl" 
				id="avatarUrl" 
				value={avatarUrl} 
			/>
			<input 
				type="hidden" 
				name="newAvatarUrl" 
				id="newAvatarUrl" 
				value={avatarItem?.img_url ?? avatarItem?.last_fm_img_url ?? null} 
			/>
			<input 
				type="hidden" 
				name="avatarMbid" 
				id="avatarMbid" 
				value={avatarMbid} 
			/>
			<input 
				type="hidden" 
				name="newAvatarMbid" 
				id="newAvatarMbid" 
				value={avatarItem?.release_group_mbid ?? null} 
			/>
			<input 
				type="hidden" 
				name="avatarName" 
				id="avatarName" 
				value={avatarItem?.release_group_name ?? null} 
			/>
		</form>
		<div class="form-column">
			<label 
				class="text-label" 
				for="avatarUrl"
			>
				<strong>Avatar:</strong> search for an album to make your profile image
			</label>
			<div class="mb-search">
				<MusicBrainzSearch
					searchCategory="release_groups"
					searchButtonText="search"
					searchPlaceholder="Search for an album"
					bind:addedItems={avatarItem}
					bind:newItemAdded={newItemAdded}
					mode="single"
					limit="10"
					bind:imgPromise={imgPromise}
				>
				</MusicBrainzSearch>
			</div>
			{#if avatarUrl && !newItemAdded}
				<CoverArt
					item={avatarInfo}
					altText={`${displayName}'s avatar: ${avatarInfo['release_group_name']} by ${avatarInfo['artist_name']}`}
				></CoverArt>
			{:else if avatarItem && newItemAdded}
				{@render editorItemImage(avatarItem, avatarItem["release_group_name"])}
			{/if}
			<div class="actions">
				<button
					form="account-data"
					class="double-border-top"
					type="submit"
					disabled={loading}
					>
					<div class="inner-border">
						{( loading ) ? 'Loading...' : 'Update profile'}
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

<NotificationModal
	showModal={success}
>
	{#snippet headerText()}
		<span >
			Success!
		</span>
	{/snippet}
	{#snippet message()}
		<span >
			Your profile has been updated.
		</span>
	{/snippet}
</NotificationModal>

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