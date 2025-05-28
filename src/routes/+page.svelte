<script lang="ts">
    import type { ActionData } from './$types'
    import { enhance } from '$app/forms'
    import SEO from '$lib/components/layout/SEO.svelte'
	import PanelHeader from "$lib/components/PanelHeader.svelte"
    import NotificationModal from "src/lib/components/modals/NotificationModal.svelte"

    interface Props {
        form: ActionData;
    }

    let { form }: Props = $props();
</script>

<SEO></SEO>

<div class="panel-medium">
    <PanelHeader>
        {#snippet headerText()}
            welcome
        {/snippet}
    </PanelHeader>
    <div class="post-body">
        <p class="post-text">
            Welcome to Freq, a place for community-driven music discovery. 
            <br />
            <br />
            <span>Freq</span> (sounds like <em>freak</em>) is short for <em>frequency</em>: the rate a sound wave vibrates at, determining its pitch.
            <br />
            <br />
            Just enter your email address for a one-time link to log in or sign up.
        </p>
        <form class="vertical" method="POST" action="?/sendMagicLink" use:enhance>
            <label 
                class="text-label" 
                for="email"
            >
                email
            </label>
            <input 
                class="text" 
                id="email" 
                name="email"
                type="text"
                placeholder="enter your email..." 
            />
            <button class="double-border-top" type="submit"> 
                <div class="inner-border">
                    submit
                </div>
            </button>
        </form>
    </div>
</div>

{#if form?.permission == true }
<NotificationModal
    showModal={form?.showModal ?? false}
>
    {#snippet headerText()}
                <span >
            { form?.success ? 'Success' : 'Error'}
        </span>
            {/snippet}
    {#snippet message()}
                <span >
            <p>{ form?.success ? 'Check your inbox! And maybe also your spam.' : 'Something went wrong. Please try again.' }</p>
        </span>
            {/snippet}
</NotificationModal>
{:else if form?.permission == false}
<NotificationModal
    showModal={form?.showModal ?? false}
>
    {#snippet headerText()}
        <span >
            Not approved
        </span>
    {/snippet}
    {#snippet message()}
        <span >
            <p>You are not yet approved to sign up for Freq. You can <a href="/welcome/invite-request">request an invite.</a></p>
        </span>
    {/snippet}
</NotificationModal>
{/if}

<div class="panel-medium">
    <div class="post-body">
        <p class="post-text">
            Want to explore the site before you create an account? You can use the "Explore" menu above to check out anonymized posts and public collections of music created by users and read the "About" page to learn more about the project.
        </p>
    </div>
</div>

<style>
    .panel-medium p {
        color: var(--freq-color-reading-text);
        font-size: var(--freq-font-size-medium);
    }
    span {
        color: var(--freq-color-primary);
    }
    input {
        width: 50%;
    }
    form.vertical {
        margin-left: 0;
    }
</style>