<script lang="ts">
	import { onMount } from 'svelte'
	import SEO from '$lib/components/layout/SEO.svelte'
    import NewNowPlayingPost from 'src/lib/components/Posts/NewNowPlayingPost.svelte'
	import { promiseStates } from '$lib/resources/states.svelte';
	
	let addedItem = $state({})

	onMount(() => {
		promiseStates.imgPromise =  null
	})
</script>

<!-- <svelte:options runes={true} /> -->

<SEO title="New Now Playing post"></SEO>

<NewNowPlayingPost
	bind:addedItem={addedItem}
></NewNowPlayingPost>