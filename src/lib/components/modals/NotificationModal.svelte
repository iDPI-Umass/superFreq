<script lang="ts">
	import type { Snippet } from 'svelte'

	interface ComponentProps {
        showModal: boolean
        headerText: Snippet
        message?: Snippet
    }

	let {         
		showModal = $bindable(),
        headerText,
        message
	}: ComponentProps = $props()

    let dialog: any = $state()

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

<!-- <svelte:options runes={true} /> -->

<dialog class="notification"
    aria-label="notification modal"
    bind:this={dialog}
	onclose={() => (showModal = false)}
>
	<div class="dialog-header">
		<h1 class="notification">
			{@render headerText()}
		</h1>
		<button 
			aria-label="close modal" 
			formmethod="dialog" 
			onclick={() => dialog.close()}
		>
			x
		</button>
	</div>
	<p class="notification">
		{@render message?.()}
	</p>
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
		max-width: 300px;
	}
</style>
