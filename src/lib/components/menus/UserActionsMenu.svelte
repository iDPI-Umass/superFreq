<script lang="ts">
    import { onMount, createEventDispatcher } from 'svelte'

    import { Popover } from "bits-ui";
    import { flyAndScale } from "$lib/utils/transitions.ts"

    import Ban from 'lucide-svelte/icons/ban'
    import Circle from 'lucide-svelte/icons/circle'
    import Ellipsis from 'lucide-svelte/icons/ellipsis'
    import Flag from 'lucide-svelte/icons/flag'
    import PenLine from 'lucide-svelte/icons/pen-line'
    import Trash2 from 'lucide-svelte/icons/trash-2'

    export let editState = false
    export let mode: string
    export let blocked = false
    
    //modes: profileMenu, postMenu, sessionUserPostMenu

    let popOverOpenState: boolean
    let showModal: boolean = false
    let dialog: any
    const diaglogTitleOptions: App.Lookup = {
        blockUser: 'Block uesr?',
        deletePost: 'Delete post?',
        flagPost: 'Flag post?',
        reportUser: 'Flag user?',
        unblockUser: 'Unblock user?'
    }
    const dialogTextOptions: App.Lookup = {
        blockUser: 'This user will no longer be able to see or interact with your profile data, posts, or private collections. They will be able to see your public and open collections.',
        deletePost: 'This post will be permanently removed.',
        flagPost: 'This will notify site admins that something about this post is fishy.',
        reportUser: 'This will notify site admins that something about this user is fishy.',
        unblockUser: 'This grants this user the same permission to see your activity that everyone else has.',
    }
    const dialogConfirmButtonOptions: App.Lookup = {
        blockUser: 'block',
        deletePost: 'delete',
        flagPost: 'flag',
        reportUser: 'flag',
        unblockUser: 'unblock'
    }
    const formIDs: App.StringLookupObject = {
        blockUser: 'block',
        deletePost: 'delete',
        flagPost: 'flagPost',
        reportUser: 'flag',
        unblockUser: 'unblock'
    }
    const formActions: App.StringLookupObject = {
        blockUser: '?/blockUser',
        deletePost: '?/deletePost',
        flagPost: '?/flagPost',
        reportUser: '?/reportUser',
        unblockUser: '?/blockUser'
    }

    let dialogMode: string

	$: if (dialog && ( showModal == true )) dialog.showModal()
	$: if (dialog && !showModal) dialog.close()

    function toggleEditState() {
        editState = !editState
        popOverOpenState = !popOverOpenState
    }

    function openDialog( mode: string ) {
        popOverOpenState = !popOverOpenState
        dialogMode = mode
        showModal = true
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
        {#if mode == 'profileMenu'}
            {#if blocked}
                <button 
                    class="popover-item" 
                    on:click|preventDefault={() => openDialog('blockUser')}
                >
                    <Ban 
                        size="16" 
                        color="var(--freq-color-text-muted)"
                    ></Ban>
                    <span class="descriptor">
                        block user
                    </span>
                </button>
            {:else}
                <button 
                    class="popover-item" 
                    on:click|preventDefault={() => openDialog('unblockUser')}
                >
                    <Circle 
                        size="16" 
                        color="var(--freq-color-text-muted)"
                    ></Circle>
                    <span class="descriptor">
                        unblock user
                    </span>
                </button>
            {/if}
            <button
                class="popover-item" 
                on:click|preventDefault={() => openDialog('reportUser')} 
            >
                <Flag 
                    size="16" 
                    color="var(--freq-color-text-muted)"
                ></Flag>
                <span class="descriptor">
                    report user
                </span>
            </button>
        {:else if mode = 'postMenu'}
            <button
                class="popover-item" 
                on:click|preventDefault={() => openDialog('flagPost')} 
            >
                <Flag 
                    size="16" 
                    color="var(--freq-color-text-muted)"
                ></Flag>
                <span class="descriptor">
                    flag post
                </span>
            </button>
        {:else if mode == 'sessionUserPostMenu'}
            <button 
                class="popover-item" 
                on:click|preventDefault={toggleEditState}
            >
                <PenLine 
                    size="16" 
                    color="var(--freq-color-text-muted)"
                ></PenLine>
                <span class="descriptor">
                    edit
                </span>
            </button>
            <button
                class="popover-item" 
                on:click|preventDefault={() => openDialog('deletePost')} 
            >
                <Trash2 
                    size="16" 
                    color="var(--freq-color-text-muted)"
                ></Trash2>
                <span class="descriptor">
                    delete
                </span>
            </button>
        {/if}
    </Popover.Content>
</Popover.Root>

<dialog
    aria-label="modal"
    bind:this={dialog}
	on:close={() => (showModal = false)}
>
<h2>{diaglogTitleOptions[dialogMode]}</h2>
    {dialogTextOptions[dialogMode]}
    <div class="dialog-options">
        <button 
            aria-label="close modal" 
            formmethod="dialog" 
            on:click={closeDialog}
        >
            cancel
        </button>
        <form class="POST" id={formIDs[dialogMode]} action={formActions[dialogMode]}>
            <button 
                aria-label="close modal" 
                formmethod="dialog" 
                formaction={formActions[dialogMode]}
                on:click={closeDialog}
            >
                {dialogConfirmButtonOptions[dialogMode]}
            </button>
        </form>
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
    .dialog-options {
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