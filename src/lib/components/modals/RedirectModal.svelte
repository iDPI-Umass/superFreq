<script lang="ts">
    import { tick } from 'svelte'
    import type { Snippet } from 'svelte'
    import { goto } from '$app/navigation'

    interface ComponentProps {
        showModal: boolean
        redirectPath: string,
        headerText: Snippet,
        message: Snippet
    }

    let { 
        showModal = $bindable(),
        redirectPath, // expects format '/route'
        headerText,
        message
    }: ComponentProps = $props()

    let dialog: any = $state()

	$: if (dialog && showModal) dialog.showModal()
	$: if (dialog && !showModal) dialog.close()

    $effect.pre ( async () => {
        await tick
        if ( showModal == true ) {
            setTimeout(() => goto(redirectPath), 5000)
        }
    })
</script>

<dialog class="notification"
    aria-label="redirect-modal"
    bind:this={dialog}
    onclose={() => (showModal = false)}
>
    <div class="dialog-column">
        <div class="dialog-header">
            <h1 class="notification">
                {@render headerText()}
            </h1>
        </div>
        {@render message()}
        <button class="standard" onclick={() => goto(redirectPath)}>
            Go now
        </button>
    </div>
</dialog>


<style>
    .dialog-column {
        display: flex;
        flex-direction: column;
        gap: var(--freq-height-spacer);
    }
    button {
        margin: 0 auto;
    }
</style>