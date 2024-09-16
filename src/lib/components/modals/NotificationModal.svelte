<script lang="ts">
    import { onMount, createEventDispatcher } from 'svelte'

	export let showModal: boolean
    let dialog: any

	$: if (dialog && showModal) dialog.showModal()
	$: if (dialog && !showModal) dialog.close()

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

<dialog class="notification"
    aria-label="notification modal"
    bind:this={dialog}
	on:close={() => (showModal = false)}
>
	<div class="dialog-header">
		<h1 class="notification">
			<slot name="header-text" />
		</h1>
		<button 
			aria-label="close modal" 
			formmethod="dialog" 
			on:click={() => dialog.close()}
		>
			x
		</button>
	</div>
	<p class="notification">
		<slot name="message" />
	</p>
</dialog>

<svelte:window
	on:keydown={(e) => {
		if (e.key === 'Escape') {
			dispatch(dialog.close());
		}
	}}
/>

<style>
	dialog {
		max-width: 300px;
	}
</style>
