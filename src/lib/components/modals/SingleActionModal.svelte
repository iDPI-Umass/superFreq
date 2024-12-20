<script lang="ts">
    import { enhance } from '$app/forms'
	import type { Snippet } from 'svelte'

	interface ComponentProps {
        showModal: boolean
        headerText: Snippet
        message: Snippet
        formAction: string
        buttonText: string
        success: boolean | null
    }

	let {         
		showModal = $bindable(),
        headerText,
        message,
        formAction,
        buttonText,
        success = null
	}: ComponentProps = $props()

    let dialog: any = $state()

    function closeDialog() {
        showModal = false
        dialog.close()
        success = null
    }

    let buttonsInactive = $state(false)

    function runningAction () {
        buttonsInactive = true
        Promise.resolve(success).then(() => {
            buttonsInactive = false
            return
        })
    }

    $effect(() => {
		dialog.addEventListener("click", e => {
			const dialogDimensions = dialog.getBoundingClientRect()
			if (
				e.clientX < dialogDimensions.left ||
				e.clientX > dialogDimensions.right ||
				e.clientY < dialogDimensions.top ||
				e.clientY > dialogDimensions.bottom
			) {
				dialog.close()
			}
		})

		if ( dialog && showModal ) dialog.showModal()
		if ( dialog && !showModal ) dialog.close()
	})
</script>

<svelte:options runes={true} />

<dialog class="notification"
    aria-label="notification modal"
    bind:this={dialog}
	onclose={() => (showModal = false)}
>
	<div class="dialog-header">
		<h1 class="notification">
			{@render headerText()}
		</h1>
	</div>
	<p class="notification">
		{@render message?.()}
	</p>
    <div class="options">
        <form method="POST" action={formAction} use:enhance>
            <button
                class="standard"
                type="submit"
                aria-label="submit {buttonText}"
                onclick={runningAction}
                disabled={buttonsInactive}
            >
                {buttonText}
            </button>
        </form>
        <button
            class="standard"
            aria-label="close modal" 
            formmethod="dialog" 
            onclick={closeDialog}
            disabled={buttonsInactive}
        >
            cancel
        </button>
    </div>
</dialog>

<svelte:window
	onkeydown={(e) => {
		if (e.key === 'Escape') {
			() => dialog.close();
		}
	}}
/>

<style>
	dialog {
		max-width: 70%;
	}
    .options {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: space-between;
    }
</style>
