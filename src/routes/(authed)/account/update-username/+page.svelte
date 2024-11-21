<script lang="ts">
    import { invalidateAll } from '$app/navigation'
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

	let { profile } = $derived(data)

    let loading = false
    let username = $derived(profile?.username as string)
    let delay = $state(5)
	let countdown = $state(0)

    let showNotificationModal = $derived( form?.success == false ? true : false )
	let showRedirectModal = $derived(form?.success ? form?.success : false)

    $effect.pre(() => {
		invalidateAll()
	})

    $effect(() => {
        if ( showRedirectModal ) {
            countdown = delay
            setInterval(() => countdown -= 1, 1000)
        }
    })

</script>

<svelte:options runes={true} />

<svelte:head>
	<title>
		Update Username
	</title>
</svelte:head>


<div class="panel" id="profile-info">
    <PanelHeader>
        {#snippet headerText()}
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
            value={username} 
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
            value={username} 
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
        showModal={(form?.success == false ? true : false)}
    >
        {#snippet headerText()}
            <span >Username taken</span>
        {/snippet}
        {#snippet message()}
            <span >Please try another username.</span>
        {/snippet}
    </NotificationModal>
</div>

<RedirectModal
    showModal={form?.success ?? false}
    delay={delay}
    redirectPath='/account'
>
    {#snippet message()}
        <span>
            Username updated successfully. Redirecting to your account page in 5 seconds.
        </span>
    {/snippet}
</RedirectModal>

<style>
    .panel {
        max-width: 500px;
    }
    input {
        max-width: 300px;
    }
</style>