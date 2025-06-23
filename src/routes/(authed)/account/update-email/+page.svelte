<script lang="ts">
    import type { PageData, ActionData } from './$types'

    import SEO from '$lib/components/layout/SEO.svelte'
    import PanelHeader from "src/lib/components/layout/PanelHeader.svelte"

    interface Props {
        data: PageData;
        form: ActionData;
    }

    let { data, form }: Props = $props();

    let newEmail = $state('')
    let confirmEmail = $state('')

	let { sessionUserEmail } = $derived(data)

</script>

<SEO title="Update email"></SEO>

<div class="panel" id="profile-info">
    <PanelHeader>
        {#snippet headerText()}
            <span >
                update email address
            </span>
        {/snippet}
	</PanelHeader>
	<form
		class="horizontal"
		id="account-data"
		method="POST"
	>
    <div class="form-column">
        <label 
            class="text-label"  
            for="current-username"
            form="account-data"
        >
            Current Email Address
        </label>
        <input
            class="text"
            type="email"
            name="current-email"
            id="current-email"
            form="account-data"
            defaultValue={sessionUserEmail} 
            disabled
        />
        <label 
            class="text-label"  
            for="new-email"
            form="account-data"
        >
            New Email Address
        </label>
        <input
            class="text"
            type="text"
            name="new-email"
            id="new-email"
            form="account-data"
            bind:value={newEmail} 
        />
        <label 
            class="text-label"  
            for="confirm-email"
            form="account-data"
        >
            Confirm New Email Address
        </label>
        <input
            class="text"
            type="text"
            name="confirm-email"
            id="confirm-email"
            form="account-data"
            bind:value={confirmEmail} 
        />
        <button
            type="submit"
            class="standard"
            disabled={( newEmail == '' ) || ( newEmail != confirmEmail )}
        >
                update email address
        </button>

        {#if form?.success == true}
        <dialog open>
            <button class="standard">
                x
            </button>
            <p>Check your inbox to confirm your new email address</p>
        </dialog>
        {:else if form?.success == false}
        <dialog open>
            <button class="standard">
                x
            </button>
            <p>Something went wrong, please reload this page and try again.</p>
        </dialog>
        {/if}
    </div>

    </form>
    {#if form?.success == false }
    <dialog open>
        <form method="dialog">
            <button class="standard">x</button>
            <p>That username is not available. Please try another.</p>
        </form>
    </dialog>
    {/if}
</div>

<style>
    button:hover, :focus {
        scale: 100%;
    }
    .panel {
        max-width: 500px;
    }
    input {
        max-width: 300px;
    }
</style>