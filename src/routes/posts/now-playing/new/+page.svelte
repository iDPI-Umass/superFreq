<script lang="ts">
	import type { ActionData } from './$types'
	import SEO from '$lib/components/layout/SEO.svelte'
    import NewNowPlayingPost from '$lib/components/Posts/NewNowPlayingPost.svelte'
	
	// export let form: ActionData
	// $: form

	let addedItem = $state({})
	let imgPromise = $state(null)
</script>

<!-- <svelte:options runes={true} /> -->

<SEO title="New Now Playing post"></SEO>

<NewNowPlayingPost
	bind:addedItem={addedItem}
	bind:imgPromise={imgPromise}
></NewNowPlayingPost>