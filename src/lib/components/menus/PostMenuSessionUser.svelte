<script lang="ts">
    import { Popover } from "bits-ui";
    import { flyAndScale } from "$lib/utils/transitions.ts"

    import Ellipsis from 'lucide-svelte/icons/ellipsis'
    import PenLine from 'lucide-svelte/icons/pen-line'
    import Trash2 from 'lucide-svelte/icons/trash-2'

    let { editState = $bindable(false) }: { editState: boolean } = $props()

    let popOverOpenState = $state(false)
    let showModal = $state(false)
    let dialog: any = $state()

    function toggleEditState() {
        editState = !editState
        popOverOpenState = !popOverOpenState
    }

    function deletePost() {
        popOverOpenState = !popOverOpenState
        showModal = true
    }

    function closeDialog() {
        showModal = false
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

        if (dialog && ( showModal == true )) dialog.showModal()
        if (dialog && !showModal) dialog.close()
	})
</script>

<svelte:options runes={true} />
<svelte:window
	onkeydown={(e) => {
		if (e.key === 'Escape') {
		    dialog.close()
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
        <button class="popover-item" onclick={toggleEditState}>
            <PenLine size="16" color="var(--freq-color-text-muted)"></PenLine>
            <span class="descriptor">
                edit
            </span>
        </button>
        <button
            class="popover-item" 
            onclick={() => {deletePost()}}
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
	onclose={() => (showModal = false)}
>
    Are you sure you want to delete this post?
    <div class="delete-submit-options">
        <button 
            aria-label="close modal" 
            formmethod="dialog" 
            onclick={closeDialog}
        >
            cancel
        </button>
        <button 
            aria-label="close modal" 
            formmethod="dialog" 
            onclick={closeDialog}
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