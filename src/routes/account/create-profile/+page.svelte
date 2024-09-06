<script lang="ts">
    import type { PageData, ActionData } from "../$types"
    import { beforeUpdate, tick } from "svelte"
    import { enhance } from "$app/forms"
    import { goto } from "$app/navigation"

    import PanelHeader from "$lib/components/PanelHeader.svelte"
    import MusicBrainzSearch from "$lib/components/MusicBrainzSearch.svelte"
    import NotificationModal from "src/lib/components/modals/NotificationModal.svelte"
    import RedirectModal from "$lib/components/modals/RedirectModal.svelte"

    export let data: PageData
    export let form: ActionData

    let { email } = data
    $: ({ email } =  data)
    $: form

    let username = ''
    let displayName = ''
    let about = ''
    let website = ''
    let newItemAdded = false
    let avatarItem = {
        'img_url': '',
        'release_group_mbid': '',
        'release_group_name': ''
    }
    let profileForm: any

	console.log(form?.success)

    // beforeUpdate ( async () => {
    //     const success = form?.success
    //     await tick
    //     if ( success == true ) {
    //         setTimeout(() => goto('/about/rules'), 5000)
    //     }
    // })

</script>

<div class="panel" id="profile-info">
	<PanelHeader>
		create profile
	</PanelHeader>
	<div class="form-wrapper">
		<form
			id="account-data"
			class="form-column"
			method="POST"
			action="?/create"
			use:enhance
			bind:this={profileForm}
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
				value={username}
                required
			/>
            <div class="label-group">
                <label 
                    class="text-label"
                    for="displayName"
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
				name="displayName" 
				id="displayName" 
				value={displayName} 
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
				name="avatarUrl" 
				id="avatarUrl" 
				value={avatarItem.img_url} 
			/>
			<input 
				type="hidden" 
				name="avatarMbid" 
				id="avatarMbid" 
				value={avatarItem.release_group_mbid} 
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
			{#if avatarItem.img_url.length > 0}
				<img src={avatarItem.img_url} alt="user avatar"/>
			{/if}
			{#if form?.success}
				<p>update submitted</p>
			{/if}
			<div class="actions">
				<button
					class="double-border-top"
					type="submit"
					disabled={!( username && displayName )}
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
<span slot="header-text">
    Try Another Username
</span>
<span slot="message">
    That Username is already taken, but you can use it for your Display Name.
    <br />
    <br />
    Your Display Name is what other people on the site will actually see.
</span>
</NotificationModal>

<RedirectModal
    showModal={ form?.success ? form?.success : false }
    redirectPath={'/about/guidelines'}
>
    <span slot="header-text">
        Profiled created!
    </span>
    <span slot="message">
        Automatically redirecting to our Community Guidelines in 5 seconds.
    </span>
</RedirectModal>

<form
    method="POST"
    action="?/test"
>
    <button class="standard">
        test redirect
    </button>
</form>

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