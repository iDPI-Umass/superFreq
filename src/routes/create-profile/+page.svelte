<script lang="ts">
    import type { PageData,  ActionData } from "../$types"
	import { enhance } from "$app/forms"

    import PanelHeader from "$lib/components/PanelHeader.svelte"
    import MusicBrainzSearch from "$lib/components/MusicBrainzSearch.svelte"
    import NotificationModal from "src/lib/components/modals/NotificationModal.svelte"
    import RedirectModal from "$lib/components/modals/RedirectModal.svelte"

	import wave from "$lib/assets/images/logo/freq-wave.svg"

	interface Props {
		data: any;
		form: ActionData;
	}

	let { data, form }: Props = $props();

    const email = data.email as string

    let username = $state('')
    let displayName = $state('')
    let about = ''
    let website = ''
    let newItemAdded = $state(false)
    let avatarItem = $state({} as App.RowData)

	let imgPromise = $state(null)
	let avatarPromise = $state(false)
</script>

<svelte:options runes={true} />

<svelte:head>
	<title>
		Create Profile
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
				create profile
			</span>
		{/snippet}
	</PanelHeader>
	<div class="form-wrapper">
		<form
			id="account-data"
			class="form-column"
			method="POST"
			action="?/create"
			use:enhance={() => {
				avatarPromise = true
				return async ({ update }) => {
					avatarPromise = false
					await update()
				}}
			}
		>
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
                <span class="label-explainer">
                    * required
                </span>
			</div>
			<input
				class="text"
				type="text"
				name="username"
				id="username"
				form="account-data"
				bind:value={username}
                required
			/>
            <div class="label-group">
                <label 
                    class="text-label"
                    for="display-name"
                >
                    Display name
                </label>
                <span class="label-explainer">
                    * required
                </span>
            </div>
			<input 
				class="text" 
				type="text" 
				name="display-name" 
				id="display-name" 
				bind:value={displayName} 
				form="account-data"
                required
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
				id="avatarItem" 
				value={JSON.stringify(avatarItem)} 
			/>
			<input 
				type="hidden" 
				name="avatarUrl" 
				id="avatarUrl" 
				value={avatarItem?.img_url ?? null} 
			/>
			<input 
				type="hidden" 
				name="avatarMbid" 
				id="avatarMbid" 
				value={avatarItem.release_group_mbid ?? null} 
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
					bind:imgPromise={imgPromise}
				>
				</MusicBrainzSearch>
			</div>
			<!-- add alt text and change column in postgres -->
			{#if avatarItem.img_url && avatarItem.img_url.length > 0}
				{@render editorItemImage(avatarItem, avatarItem["release_group_name"])}
			{/if}
			<div class="actions">
				<button
					class="double-border-top"
					type="submit"
					disabled={( !( username && displayName ) || avatarPromise )}
					form="account-data"
					formaction="?/create"
					>
					<div class="inner-border">
						submit 
					</div>
				</button>
			</div>
		</div>
	</div>
</div>

<NotificationModal
    showModal = {( form?.success ? !form?.success : false )}
>
	{#snippet headerText()}
		<span >
			Try Another Username
		</span>
	{/snippet}
	{#snippet message()}
		<span >
			That Username is already taken, but you can use it for your Display Name.
			<br />
			<br />
			Your Display Name is what other people on the site will actually see.
		</span>
	{/snippet}
</NotificationModal>

<RedirectModal
    showModal={ form?.success ? form?.success : false }
    redirectPath={'/about#guidelines'}
>
    {#snippet headerText()}
		<span >
	        Profiled created!
	    </span>
	{/snippet}
    {#snippet message()}
		<span >
	        Automatically redirecting to our Community Guidelines in 5 seconds.
	    </span>
	{/snippet}
</RedirectModal>

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