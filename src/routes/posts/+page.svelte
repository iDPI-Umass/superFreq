<script lang="ts">
    import { run } from 'svelte/legacy';

    import type { PageData, ActionData } from './$types'
    import NowPlayingPost from '$lib/components/Posts/NowPlayingPost.svelte'
    import PanelHeader from '$lib/components/PanelHeader.svelte'

    interface Props {
        data: any;
        form: any;
    }

    let { data, form }: Props = $props();

    let { posts, postCount } = $state(data)
    run(() => {
        ({ posts, postCount } = data)
    });

    let displayPosts = [...posts]
</script>

<svelte:options runes={true} />
<svelte:head>
	<title>
		Anonymous Posts
	</title>
</svelte:head>

<div class="panel-medium">
    <PanelHeader>
        {#snippet headerText()}
            <span >
                Some anonymized Now Playing posts
            </span>
        {/snippet}
    </PanelHeader>
    <div class="posts-spacing">
    {#each displayPosts as post}
        <NowPlayingPost
            post={post}
            mode="feed"
        >
        </NowPlayingPost>
    {/each}
    </div>
</div>
<div class="post-panel">


</div>

<style>
    .posts-spacing {
        display: flex;
        flex-direction: column;
        padding: var(--freq-spacing-medium);
        gap: var(--freq-spacer-gap);
    }
</style>