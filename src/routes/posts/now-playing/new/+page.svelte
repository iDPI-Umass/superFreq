<script lang="ts">
	import { onMount } from 'svelte'
	import SEO from '$lib/components/layout/SEO.svelte'
    import NewNowPlayingPost from 'src/lib/components/Posts/NewNowPlayingPost.svelte'
	import { promiseStates } from '$lib/resources/states.svelte';

    const { data } = $props()
    const { parsedUrlInfo } = $derived(data)

	onMount(() => {
		promiseStates.imgPromise =  null
	})

</script>

<SEO title="New Now Playing post"></SEO>

<NewNowPlayingPost
	parsedUrlInfo={parsedUrlInfo}
></NewNowPlayingPost>