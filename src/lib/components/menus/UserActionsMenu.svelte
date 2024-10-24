<script lang="ts">
    import { enhance } from '$app/forms'

    import { Popover } from "bits-ui";
    import { flyAndScale } from "$lib/utils/transitions.ts"

    import Ban from 'lucide-svelte/icons/ban'
    import Circle from 'lucide-svelte/icons/circle'
    import Ellipsis from 'lucide-svelte/icons/ellipsis'
    import Flag from 'lucide-svelte/icons/flag'
    import PenLine from 'lucide-svelte/icons/pen-line'
    import Trash2 from 'lucide-svelte/icons/trash-2'

    interface ComponentProps {
        editState?: boolean | null | undefined
        mode: 'profileMenu' | 'postMenu' | 'sessionUserPostMenu'
        profileUserId?: string | null
        blocked?: boolean
        flagged?: boolean
        postId?: string | null
        success?: boolean | null
    }

    let {
        editState = $bindable(false),
        mode,
        profileUserId = null,
        blocked = false,
        flagged = false,
        postId = null,
        success
    }: ComponentProps = $props()

    const actionSuccess = $derived(success)

    $effect(() => console.log('userActionMenu ', actionSuccess))

    let popOverOpenState: boolean = $state(false)
    let showModal: boolean = $state(false)
    let dialog: any
    
    const diaglogTitleOptions: App.Lookup = {
        blockUser: 'Block uesr?',
        deletePost: 'Delete post?',
        flagPost: 'Flag post?',
        reportUser: 'Report user?',
        unblockUser: 'Unblock user?'
    }
    const dialogTextOptions: App.Lookup = {
        blockUser: 'This user will no longer be able to see or interact with your profile data, posts, or private collections. They will be able to see your public and open collections.',
        deletePost: 'This post will be permanently removed.',
        flagPost: 'This will notify site admins that something about this post is fishy.',
        reportUser: 'This will notify site admins that something about this user is fishy.',
        unblockUser: 'This grants this user the same permission to see your activity that everyone else has.',
    }
    const successTextOptions: App.Lookup = {
        blockUser: 'User blocked',
        deletePost: 'Post deleted',
        flagPost: 'Post flagged',
        reportUser: 'User reported',
        unblockUser: 'User unblocked',
    }
    const dialogConfirmButtonOptions: App.Lookup = {
        blockUser: 'block',
        deletePost: 'delete',
        flagPost: 'flag',
        reportUser: 'report',
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

    let dialogMode = $state() as string

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
    bind:open={popOverOpenState}
>
    <Popover.Trigger>
        <Ellipsis size="16" color="var(--freq-color-text-muted)"></Ellipsis>
    </Popover.Trigger>
    <Popover.Content transition={flyAndScale}>
        {#if mode == 'profileMenu'}
            {#if !blocked}
                <button 
                    class="popover-item" 
                    onclick={() => openDialog('blockUser')}
                >
                    <Ban 
                        size="16" 
                        color="var(--freq-color-text-muted)"
                    ></Ban>
                    <span class="descriptor">
                        block user
                    </span>
                </button>
            {:else if blocked}
                <button 
                    class="popover-item" 
                    onclick={() => openDialog('unblockUser')}
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
            {#if !flagged}
                <button
                    class="popover-item" 
                    onclick={() => openDialog('reportUser')} 
                >
                    <Flag 
                        size="16" 
                        color="var(--freq-color-text-muted)"
                    ></Flag>
                    <span class="descriptor">
                        report user
                    </span>
                </button>
            {:else if flagged}
            <button
                class="popover-item" 
                onclick={() => openDialog('reportUser')} 
                disabled
            >
                <Flag 
                    size="16" 
                    color="var(--freq-color-text-muted)"
                ></Flag>
                <span class="descriptor">
                    user reported
                </span>
            </button>
            {/if}
        {:else if mode == 'sessionUserPostMenu'}
            <button 
                class="popover-item" 
                onclick={toggleEditState}
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
                onclick={() => openDialog('deletePost')} 
            >
                <Trash2 
                    size="16" 
                    color="var(--freq-color-text-muted)"
                ></Trash2>
                <span class="descriptor">
                    delete
                </span>
            </button>
        {:else if mode = 'postMenu'}
            <button
                class="popover-item" 
                onclick={() => openDialog('flagPost')} 
            >
                <Flag 
                    size="16" 
                    color="var(--freq-color-text-muted)"
                ></Flag>
                <span class="descriptor">
                    flag post
                </span>
            </button>
        {/if}
    </Popover.Content>
</Popover.Root>

<dialog
    aria-label="modal"
    bind:this={dialog}
	onclose={() => (showModal = false)}
>
    <form 
        method="POST" 
        id={formIDs[dialogMode]} 
        action={formActions[dialogMode]}
        use:enhance
    >
        <input
            type="hidden"
            id="profile-user-id"
            name="profile-user-id"
            value={profileUserId}
        />
        <input
            type="hidden"
            id="post-id"
            name="post-id"
            value={postId}
            form={formIDs[dialogMode]} 
        />
        {#if actionSuccess == null}
            <h2>{diaglogTitleOptions[dialogMode]}</h2>
            <p>
                {dialogTextOptions[dialogMode]}
            </p>
            <div class="dialog-options">
                <button 
                    aria-label="close modal" 
                    formmethod="dialog" 
                    class="standard"
                    onclick={closeDialog}
                >
                    cancel
                </button>
                <button 
                    aria-label="submit" 
                    type="submit"
                    class="standard"
                    formaction={formActions[dialogMode]}
                >
                    {dialogConfirmButtonOptions[dialogMode]}
                </button>
            </div>
        {:else if actionSuccess == true}
            <p>
                {successTextOptions[dialogMode]}
            </p>
            <div class="dialog-options">
                <button 
                    aria-label="close modal" 
                    formmethod="dialog" 
                    class="standard"
                    onclick={closeDialog}
                >
                    close
                </button>
            </div>
        {:else if actionSuccess == false}
            <p>
                Something went wrong
            </p>
            <div class="dialog-options">
                <button 
                    aria-label="close modal" 
                    formmethod="dialog" 
                    class="standard"
                    onclick={closeDialog}
                >
                    close
                </button>
            </div>
        {/if}
    </form>
</dialog>

<style>
    dialog {
        max-width: 300px;
    }
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