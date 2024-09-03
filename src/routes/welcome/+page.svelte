<script lang="ts">
    import type { ActionData } from './$types'
    import '$lib/styles/posts.css'
	import PanelHeader from "$lib/components/PanelHeader.svelte"
    import NotificationModal from "$lib/components/NotificationModal.svelte"

    let form: ActionData
</script>

<div class="panel-medium">
    <PanelHeader>
        welcome
    </PanelHeader>
    <div class="post-body">
        <p class="post-text">
            Welcome to Freq, a place for community-driven music discovery.
            <br />
            <br />
            Just enter your email address for a one-time link to log in or sign up.
        </p>
        <form class="vertical" method="POST" action="?/sendMagicLink">
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

<NotificationModal
    showModal={form?.showModal ?? false}
>
    <span slot="message">
        {#if form?.success}
        <p>check your inbox!</p>
        {:else}
        <p>Something went wrong. Please try again.</p>
        {/if}
    </span>
</NotificationModal>

<div class="panel-medium">
    <div class="post-body">
        <p class="post-text">
            Want to explore the site? You can use "Explore" menu above to check out anonymized posts and public collections of music created by users.
        </p>
        <p class="post-text">
            To learn more about Freq, check out the About page linked above.
        </p>
    </div>
</div>

<style>
    input {
        width: 50%;
    }
    form.vertical {
        margin-left: 0;
    }
</style>