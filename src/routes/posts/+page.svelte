<script lang="ts">
    import type { PageData, ActionData } from './$types'
    import NowPlayingPost from '$lib/components/Posts/NowPlayingPost.svelte'

    export let data
    export let form

    let { posts, postCount } = data
    $: ({ posts, postCount } = data)

    let displayPosts = [...posts]
</script>

{#each displayPosts as post}
    <NowPlayingPost post={post}></NowPlayingPost>
{/each}