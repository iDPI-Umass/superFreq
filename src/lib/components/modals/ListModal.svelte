<!-- 
	Generates modal for lists, such as search results, list of user's collections, or list of users followed. 
	
	Expects slot names "header-text" and "list". <ol> recommended over <ul> for accessibility.

	Requires a button that executes the function dialog.showModal(). Something like this:

	    <button 
			on:click={() => ( showModal = true )}
			on:click|preventDefault={someFunction} 
			disabled={!(someProp)}
		>
			{someText}
		</button>
-->

<script lang="ts">
	import type { Snippet } from 'svelte'
    import { onMount, createEventDispatcher } from 'svelte'

	interface ComponentProps {
        showModal: boolean
        headerText: Snippet,
        list: Snippet
    }

	let {         
		showModal = $bindable(),
        headerText,
        list 
	}: ComponentProps = $props()

    let dialog: any = $state()

	// $: if (dialog && showModal) dialog.showModal()
	// $: if (dialog && !showModal) dialog.close()

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

<svelte:window
	on:keydown={(e) => {
		if (e.key === 'Escape') {
			() => dialog.close();
		}
	}}
/>

<dialog
    aria-label="modal"
    bind:this={dialog}
	onclose={() => (showModal = false)}
>
	<div class="dialog-header">
		<h1>
			{@render headerText?.()}
		</h1>
		<button 
			aria-label="close modal" 
			formmethod="dialog" 
			onclick={() => dialog.close()}
		>
			x
		</button>
	</div>
    {@render list?.()}
</dialog>

<style>
	dialog {
        text-decoration: none;
		margin-top: 15%;
    }
	.dialog-header {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}
	h1 {
		font-size: var(--freq-font-size-x-small);
	}
	.dialog-header button {
		width: fit-content;
		text-transform: uppercase;
		padding: var(--freq-spacing-2x-small) var(--freq-spacing-x-small);
		font-weight: var(--freq-font-weight-bold);
		text-align: center;
	}
</style>