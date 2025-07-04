<script lang="ts">
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	import SEO from '$lib/components/layout/SEO.svelte';
	import PanelHeader from 'src/lib/components/layout/PanelHeader.svelte';
	import NotificationModal from '$lib/components/modals/NotificationModal.svelte';
	import AvatarSearch from 'src/lib/components/Search/AvatarSearch.svelte';

	import { collectionData, promiseStates } from '$lib/resources/states.svelte.js';

	let { data, form } = $props();

	let { user, profile } = $derived(data);

	let success = $derived(form?.success) as boolean;

	let displayName = $derived(profile?.display_name ?? '') as string;
	let username = $derived(profile?.username ?? '') as string;
	let website = $derived(profile?.website ?? '') as string;

	let about = $derived(profile?.about ?? '') as string;
	let email = $derived(user?.email as string) as string;

	let avatarItem = $state({}) as App.RowData;
	let avatarMbid = $derived(avatarItem?.release_group_mbid ?? profile?.avatar_mbid ?? '') as string;
	let avatarUrl = $derived(avatarItem?.avatar_url ?? profile?.avatar_url ?? '') as string;
	let lastFmImgUrl = $derived(
		avatarItem?.last_fm_img_url ?? profile?.avatar_last_fm_img_url ?? ''
	) as string;
	let avatarArtist = $derived(
		avatarItem?.artist_name ?? profile?.avatar_artist_name ?? ''
	) as string;
	let avatarReleaseGroupName = $derived(
		avatarItem?.release_group_name ?? profile?.avatar_release_group_name ?? ''
	) as string;
	let avatarReleaseGroupMbid = $derived(
		avatarItem?.release_group_mbid ?? profile?.avatar_release_group_mbid ?? ''
	) as string;

	let avatarInfo = $derived({
		img_url: collectionData.singleItem.img_url ?? avatarUrl ?? null,
		last_fm_img_url: collectionData.singleItem.last_fm_img_url ?? lastFmImgUrl ?? null,
		artist_name: collectionData.singleItem.artist_name ?? avatarArtist ?? null,
		artist_mbid: collectionData.singleItem.artist_mbid ?? avatarMbid ?? null,
		release_group_name:
			collectionData.singleItem.release_group_name ?? avatarReleaseGroupName ?? null,
		release_group_mbid:
			collectionData.singleItem.release_group_mbid ?? avatarReleaseGroupMbid ?? null,
		label: collectionData.singleItem.label ?? avatarItem?.label ?? null
	}) as App.RowData;

	let updateLoading = $state(false);

	$effect.pre(() => {
		invalidateAll();
	});

	onMount(() => {
		promiseStates.newItemAdded = false;
		promiseStates.imgPromise = null;
		collectionData.singleItem = {};
	});
</script>

<SEO title="Account"></SEO>

<div class="panel" id="profile-info">
	<PanelHeader>
		{#snippet headerText()}
			<span> profile info </span>
		{/snippet}
	</PanelHeader>
	<div class="form-wrapper">
		<form
			id="account-data"
			class="form-column"
			method="post"
			action="?/update"
			use:enhance={() => {
				updateLoading = true;
				return async ({ update }) => {
					await update({ reset: false });
					updateLoading = false;
				};
			}}
		>
			<div class="label-group">
				<label class="text-label" for="email" form="account-data"> Email </label>
				<a class="label-link" href="/account/update-email"> update email </a>
			</div>
			<input
				class="text"
				type="text"
				name="email"
				id="email"
				form="account-data"
				defaultValue={email}
				disabled
			/>
			<div class="label-group">
				<label class="text-label" for="username" form="account-data"> Username </label>
				<a class="label-link" href="/account/update-username"> update username </a>
			</div>
			<input
				class="text"
				type="text"
				name="username"
				id="username"
				defaultValue={username}
				value={username}
				disabled
			/>
			<label class="text-label" for="display-name"> Display name </label>
			<input class="text" type="text" name="display-name" id="display-name" value={displayName} />

			<label class="text-label" for="description"> about me </label>
			<textarea
				id="about"
				name="about"
				rows="3"
				cols="1"
				maxlength="140"
				spellcheck="true"
				value={about}
			></textarea>

			<label class="text-label" for="website"> Website </label>
			<input class="text" type="text" name="website" id="website" value={website} />
			<input type="hidden" name="avatar-item" id="avatar-item" value={JSON.stringify(avatarInfo)} />
			<input type="hidden" name="avatar-url" id="avatar-url" value={avatarUrl} />
		</form>
		<div class="form-column">
			<label class="text-label" for="avatarUrl"> Avatar </label>
			<AvatarSearch {displayName} {avatarUrl} {avatarInfo}></AvatarSearch>
			<div class="actions">
				<button
					form="account-data"
					class="double-border-top"
					type="submit"
					disabled={updateLoading}
				>
					<div class="inner-border">
						{'Update profile'}
					</div>
				</button>
				<form class="signout" method="post" action="?/signout">
					<button class="double-border-top" type="submit" disabled={updateLoading}>
						<div class="inner-border">Sign Out</div>
					</button>
				</form>
			</div>
		</div>
	</div>
</div>

<NotificationModal showModal={success}>
	{#snippet headerText()}
		<span> Success! </span>
	{/snippet}
	{#snippet message()}
		<span> Your profile has been updated. </span>
	{/snippet}
</NotificationModal>

<style>
	.form-wrapper {
		display: flex;
		flex-direction: row;
		gap: var(--freq-width-spacer);
		margin: var(--freq-height-spacer) var(--freq-width-spacer);
	}
	@media screen and (max-width: 770px) {
		.form-wrapper {
			max-width: 700px;
			display: flex;
			flex-direction: column;
			gap: var(--freq-width-spacer);
			margin: var(--freq-height-spacer) var(--freq-width-spacer);
		}
	}
</style>
