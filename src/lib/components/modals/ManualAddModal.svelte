<script lang="ts">
	import { add } from 'date-fns';
	import type { Snippet } from 'svelte'


	interface ComponentProps {
        showModal: boolean
        itemType: string
        items: App.RowData[]
        headerText: Snippet
    }

	let {         
		showModal = $bindable(false),
        itemType,
        items = $bindable([]),
        headerText, 
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

    let itemTemplate = {
        'item_type': null,
        'artist_name': null,
        'release_group_name': null,
        'recording_name': null,
        'release_date': null,
        'label': null,
        'episode_title': null,
        'show_name': null,
        'listen_url': null,
        'item_position': null,
        'id': null
    } as App.RowData

    let newItem = $state(itemTemplate)
    let collectionLength = $derived(items.length ?? 0)

    function addItem() {
        // showModal = true
        // dialog.showModal()
        newItem.item_type = itemType
        const thisItemIndex = collectionLength
        newItem.item_position = thisItemIndex
        newItem.id = thisItemIndex
        items.push(newItem)
        newItem = itemTemplate
        console.log(items, items.length, collectionLength)
        // showModal = false
        dialog.close()
    }
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
		<h2>
			{@render headerText?.()}
		</h2>
		<button 
			aria-label="close modal" 
			formmethod="dialog" 
			onclick={() => dialog.close()}
		>
			x
		</button>
	</div>
    <form
        class="vertical"
    >
        <input
            type="hidden"
            name="item-type"
            id="item-type"
            value={itemType}
        />
        <div class="label-group">
            <label 
                class="text-label" 
                for="artist"
            >
                artist
            </label>
            <span class="label-explainer">
                * required
            </span>
        </div>
        <input 
            class="text" 
            type="text" 
            name="artist" 
            id="artist" 
            bind:value={newItem.artist_name} required 
        />
        {#if itemType == "recording"}
            <div class="label-group">
                <label 
                    class="text-label" 
                    for="recording"
                >
                    track
                </label>
                <span class="label-explainer">
                    * required
                </span>
            </div>
            <input 
                class="text" 
                type="text" 
                name="recording" 
                id="recording" 
                bind:value={newItem.recording_name} required 
            />
        {/if}
        {#if itemType == "release_group" || itemType == "recording"}
            <div class="label-group">
                <label 
                    class="text-label" 
                    for="release_group"
                >
                    album
                </label>
                {#if itemType == "release_group"}
                    <span class="label-explainer">
                        * required
                    </span>
                {/if}
            </div>
            <input 
                class="text" 
                type="text" 
                name="release_group" 
                id="release_group" 
                bind:value={newItem.release_group_name} required 
            />
            <label 
                class="text-label" 
                for="release_date"
            >
                release date
            </label>
            <input 
                class="text" 
                type="text" 
                name="release_date" 
                id="release_date" 
                bind:value={newItem.release_date} 
            />
            <label 
                class="text-label" 
                for="label"
            >
                label
            </label>
            <input 
                class="text" 
                type="text" 
                name="label" 
                id="label" 
                bind:value={newItem.label} 
            />
        {/if}
        {#if itemType == "episode"}
            <div class="label-group">
                <label 
                    class="text-label" 
                    for="episode_title"
                >
                    episode / dj mix title
                </label>
                <span class="label-explainer">
                    * required
                </span>
            </div>
            <input 
                class="text" 
                type="text" 
                name="episode_title" 
                id="episode_title" 
                bind:value={newItem.episode_title} required 
            />
            <div class="label-group">
                <label 
                    class="text-label" 
                    for="show_name"
                >
                   show name / mix series
                </label>
                <span class="label-explainer">
                    * required
                </span>
            </div>
            <input 
                class="text" 
                type="text" 
                name="show_name" 
                id="show_name" 
                bind:value={newItem.show_name} required 
            />
            <div class="label-group">
                <label 
                    class="text-label" 
                    for="listen_url"
                >
                   listen URL
                </label>
            </div>
            <input 
                class="text" 
                type="text" 
                name="listen_url" 
                id="listen_url" 
                bind:value={newItem.listen_url} 
            />
        {/if}
        <button
            class="standard"
            type="button"
            onclick={() => addItem()}
        >
            add item
        </button>
    </form>
</dialog>

<style>
	dialog {
		max-width: 500px;
        text-decoration: none;
		margin-top: 15%;
    }
	.dialog-header {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}
	h2 {
		font-size: var(--freq-font-size-x-small);
		color: var(--freq-color-primary);
	}
	.dialog-header button {
		width: fit-content;
		text-transform: uppercase;
		padding: var(--freq-spacing-2x-small) var(--freq-spacing-x-small);
		font-weight: var(--freq-font-weight-bold);
		text-align: center;
	}
</style>