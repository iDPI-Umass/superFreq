<script lang="ts">
    import { onDestroy, onMount, tick } from 'svelte'
    import type { Snippet } from 'svelte'
    import { goto, preloadData } from '$app/navigation'

    interface ComponentProps {
        showModal: boolean
        redirectPath: string,
        headerText?: Snippet,
        message?: Snippet,
        delay: number
    }

    let { 
        showModal = $bindable(),
        redirectPath, // expects format '/route'
        headerText,
        message,
        delay = $bindable()
    }: ComponentProps = $props()

    let dialog: any = $state()
    
    let delayMs = $state(delay * 1000) 

    // $effect (() => {
    //     if ( showModal == true ) {
    //         tick().then(() => {
    //             setTimeout(() => {
    //                 goto(redirectPath)
    //             }, delayMs)
    //         })
    //         // .then(() => setInterval(() => {
    //         //         delay -= 1
    //         //         console.log(delay)
    //         //     }, 1000))
    //     }
    // })

    $effect (() => {
        if ( dialog && showModal ) dialog.showModal()
		if ( dialog && !showModal ) dialog.close()

        preloadData(redirectPath)

        if ( showModal == true ) {
            setTimeout(() => {
                goto(redirectPath)
            }, delayMs)
        }
    })

</script>

<svelte:options runes={true} />

<dialog class="notification"
    aria-label="redirect-modal"
    bind:this={dialog}
    onclose={() => (showModal = false)}
>
    <div class="dialog-column">
        <div class="dialog-header">
            <h1 class="notification">
                {@render headerText?.()}
            </h1>
        </div>
        {@render message?.()}
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