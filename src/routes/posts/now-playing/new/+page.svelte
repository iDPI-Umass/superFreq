<script lang="ts">
	import type { ActionData } from './$types'
    import NewNowPlayingPost from '$lib/components/Posts/NewNowPlayingPost.svelte'
	
	// export let form: ActionData
	// $: form
</script>

<svelte:options runes={true} />

<svelte:head>
	<title>
		New Now Playing Post
	</title>
</svelte:head>


<NewNowPlayingPost
></NewNowPlayingPost>