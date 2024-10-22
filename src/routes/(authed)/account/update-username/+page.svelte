<script lang="ts">
    import { run } from 'svelte/legacy';

    import type { PageData, ActionData } from './$types'
    import PanelHeader from "$lib/components/PanelHeader.svelte"
    import Tooltip from '$lib/components/Tooltip.svelte'
    import NotificationModal from '$lib/components/modals/NotificationModal.svelte'
	import RedirectModal from '$lib/components/modals/RedirectModal.svelte'

    interface Props {
        data: PageData;
        form: ActionData;
    }

    let { data, form }: Props = $props();

	let { profile } = $state(data)
	run(() => {
        ({ profile } = data)
    });

    let loading = false
    let username = profile?.username as string

</script>

<svelte:head>
	<title>
		Update Username
	</title>
</svelte:head>


<div class="panel" id="profile-info">
    <PanelHeader>
        {#snippet text()}
                <span >
                update username
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
            Current Username
        </label>
        <input
            class="text"
            type="text"
            name="current-username"
            id="current-username"
            form="account-data"
            value={profile?.username} 
            disabled
        />
        <label 
            class="text-label"  
            for="new-username"
            form="account-data"
        >
            New Username
        </label>
        <input
            class="text"
            type="text"
            name="new-username"
            id="new-username"
            form="account-data"
            value={profile?.username} 
        />
        <button
            type="submit"
            class="double-border-top"
        >
            <div class="inner-border">
                submit
            </div>
        </button>
    </div>


    </form>
    <NotificationModal
        showModal={(form?.success ? !form?.success : false)}
    >
        {#snippet header-text()}
                <span >Username taken</span>
            {/snippet}
        {#snippet message()}
                <span >Please try another username.</span>
            {/snippet}
    </NotificationModal>
</div>

<RedirectModal
    showModal={form?.success ?? false}
    redirectPath='/account'
>
Username updated successfully. Redirecting to your account page in 5 seconds.
</RedirectModal>

<style>
    .panel {
        max-width: 500px;
    }
    input {
        max-width: 300px;
    }
</style>