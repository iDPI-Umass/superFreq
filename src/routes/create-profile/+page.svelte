<script lang="ts">
    import type { PageData,  ActionData } from "../$types"
	import { invalidateAll } from "$app/navigation"
	import { enhance } from "$app/forms"

    import PanelHeader from "$lib/components/PanelHeader.svelte"
    import MusicBrainzSearch from "$lib/components/MusicBrainzSearch.svelte"
    import NotificationModal from "src/lib/components/modals/NotificationModal.svelte"
    import RedirectModal from "$lib/components/modals/RedirectModal.svelte"
	import AvatarSearch from "$lib/components/AvatarSearch.svelte"

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
	let delay = $state(5)
	let countdown = $state(0)

	let imgPromise = $state(null)
	let avatarPromise = $state(false)

	let avatarUrl = $derived(avatarItem?.avatar_url ?? '') as string

	let avatarInfo = $derived({
		'img_url': avatarUrl,
		'last_fm_img_url': avatarItem?.last_fm_img_url,
		'artist_name': avatarItem?.artist_name,
		'artist_mbid': avatarItem?.artist_mbid,
		'release_group_name': avatarItem?.release_group_name,
		'release_group_mbid': avatarItem?.release_group_mbid,
		'label': avatarItem?.label,
	}) as App.RowData

	let showModal = $derived(form?.success ? form?.success : false)

	$effect.pre(() => {
		invalidateAll()
	})

	$effect(() => {
        if ( showModal ) {
            countdown = delay
            setInterval(() => countdown -= 1, 1000)
        }
    })
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
				Avatar
			</label>
			<AvatarSearch
				bind:newItemAdded={newItemAdded}
				displayName={displayName}
				avatarUrl={avatarUrl}
				bind:avatarItem={avatarItem}
				avatarInfo={avatarInfo}
				bind:imgPromise={imgPromise}
			></AvatarSearch>
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
    showModal = {showModal}
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
    showModal={showModal}
	delay={delay}
    redirectPath={'/about/guidelines'}
>
    {#snippet headerText()}
		<span >
	        Profiled created!
	    </span>
	{/snippet}
    {#snippet message()}
		<span >
	        Automatically redirecting to our Community Guidelines in {countdown} seconds.
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