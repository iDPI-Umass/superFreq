<script lang="ts">
    import { beforeUpdate, tick } from 'svelte'
    import { goto } from '$app/navigation'

    export let showModal: boolean 
    export let redirectPath: string // expects format '/route'
    let dialog: any

    console.log(showModal)
	$: if (dialog && showModal) dialog.showModal()
	$: if (dialog && !showModal) dialog.close()

    beforeUpdate ( async () => {
        await tick
        if ( showModal == true ) {
            setTimeout(() => goto(redirectPath), 5000)
        }
    })
</script>

<dialog class="notification"
    aria-label="redirect-modal"
    bind:this={dialog}
    on:close={() => (showModal = false)}
>
    <div class="dialog-column">
        <div class="dialog-header">
            <h1 class="notification">
                <slot name="header-text" />
            </h1>
        </div>
        <slot name="message" />
        <button class="standard" on:click={() => goto(redirectPath)}>
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