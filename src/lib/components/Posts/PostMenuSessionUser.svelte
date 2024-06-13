<script lang="ts">
    import { onMount, createEventDispatcher } from 'svelte'

    import { Popover } from "bits-ui";
    import { flyAndScale } from "$lib/utils/transitions.ts"

    import Ellipsis from 'lucide-svelte/icons/ellipsis'
    import PenLine from 'lucide-svelte/icons/pen-line'
    import Trash2 from 'lucide-svelte/icons/trash-2'

    export let editState: boolean = false

    let popOverOpenState: boolean
    let showModal: boolean = false
    let dialog: any

	$: if (dialog && ( showModal == true )) dialog.showModal()
	$: if (dialog && !showModal) dialog.close()

    function toggleEditState() {
        editState = !editState
        popOverOpenState = !popOverOpenState
    }

    function deletePost() {
        popOverOpenState = !popOverOpenState
    }

    function closeDialog() {
        showModal = false
    }

    onMount(() => {
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
	})

	const dispatch = createEventDispatcher();

</script>

<svelte:window
	on:keydown={(e) => {
		if (e.key === 'Escape') {
			dispatch(dialog.close());
		}
	}}
/>

<Popover.Root
    closeOnEscape={true}
    closeOnOutsideClick={true}
    bind:open={popOverOpenState}
>
    <Popover.Trigger>
        <Ellipsis size="16" color="var(--freq-color-text-muted)"></Ellipsis>
    </Popover.Trigger>
    <Popover.Content transition={flyAndScale}>
        <button class="popover-item" on:click|preventDefault={toggleEditState}>
            <PenLine size="16" color="var(--freq-color-text-muted)"></PenLine>
            <span class="descriptor">
                edit
            </span>
        </button>
        <button
            class="popover-item" 
            on:click|preventDefault={() => deletePost()} 
            on:click|preventDefault={() => ( showModal = true )}
        >
            <Trash2 size="16" color="var(--freq-color-text-muted)"></Trash2>
            <span class="descriptor">
                delete
            </span>
        </button>
    </Popover.Content>
</Popover.Root>

<dialog
    aria-label="modal"
    bind:this={dialog}
	on:close={() => (showModal = false)}
>
    Are you sure you want to delete this post?
    <div class="delete-submit-options">
        <button 
            aria-label="close modal" 
            formmethod="dialog" 
            on:click={closeDialog}
        >
            cancel
        </button>
        <button 
            aria-label="close modal" 
            formmethod="dialog" 
            on:click={closeDialog}
        >
            delete
        </button>
    </div>
</dialog>

<style>
	dialog[open] {
        display: flex;
        flex-direction: column;
        margin-top: 35%;
        text-decoration: none;
        gap: var(--freq-height-spacer-gap);
    }
    dialog[open]::backdrop {
        background-color: rgb(0 0 0 / 50%);
    }
    .delete-submit-options {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
	dialog button {
		width: fit-content;
		text-transform: uppercase;
		padding: var(--freq-spacing-2x-small) var(--freq-spacing-x-small);
		font-weight: var(--freq-font-weight-bold);
		text-align: center;
	}
</style>