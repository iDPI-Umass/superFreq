<script lang="ts">
    import SEO from '$lib/components/layout/SEO.svelte'
    import PanelHeader from "src/lib/components/layout/PanelHeader.svelte"
    import CoverArt from "src/lib/components/layout/CoverArt.svelte"
    import wave from "$lib/assets/images/logo/freq-wave.svg"

    let { data } = $props();
    let { users } = $derived(data)

    let item = {
            'img_url': null,
            'last_fm_img_url': null,
            'artist_name': null,
            'release_group_name': null
        }

    function avatarItem(user: App.RowData) {
        item = {
            'img_url': user.avatar_url ?? null,
            'last_fm_img_url': user.avatar_last_fm_img_url ?? null,
            'artist_name': user.avatar_artist_name ?? null,
            'release_group_name': user.avatar_release_group_name ?? null
        }
        return item
    }
</script>

<!-- <svelte:options runes={true} /> -->

<SEO title="Explore users"></SEO>

<div class="panel">
    <PanelHeader>
        {#snippet headerText()}
        users
        {/snippet}
    </PanelHeader>
    {#each users as user}
        <ul>
            {#if user.username}
            <li>
                <a href="/user/{user.username}">
                        <CoverArt
                            altText={`${user.display_name}'s avatar`}
                            item={avatarItem(user)}
                            imgClass={"avatar-large"}
                        >
                        </CoverArt>
                    <span class="display-name">{user.display_name}</span>
                </a>
            </li>
            {/if}
        </ul>
    {/each}
</div>


<style>
    li {
        list-style: none;
    }
    a {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 1rem;
    }
</style>