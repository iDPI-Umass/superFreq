<script lang="ts">
    import type { PageData, ActionData } from './$types';
    import PanelHeader from "$lib/components/PanelHeader.svelte"

    export let data: PageData
	export let form: ActionData

    let newEmail = ''
    let confirmEmail = ''

	let { sessionUserId, sessionUserEmail } = data
	$: ({ sessionUserId, sessionUserEmail } = data)

</script>

<svelte:head>
	<title>
		Update Email
	</title>
</svelte:head>


<div class="panel" id="profile-info">
    <PanelHeader>
		update email address
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
            type="text"
            name="current-email"
            id="current-email"
            form="account-data"
            value={sessionUserEmail} 
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
            <form method="dialog">
            <button class="standard">
                x
            </button>
            <p>Check your inbox to confirm your new email address</p>
            </form>
        </dialog>
        {:else if form?.success == false}
        <dialog open>
            <form method="dialog">
            <button class="standard">
                x
            </button>
            <p>Something went wrong, please reload this page and try again.</p>
            </form>
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