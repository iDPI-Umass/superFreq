<script lang="ts">
    import SEO from '$lib/components/layout/SEO.svelte'
    import PanelHeader from "$lib/components/PanelHeader.svelte"
    import CoverArt from "$lib/components/CoverArt.svelte"
    import wave from "$lib/assets/images/logo/freq-wave.svg"
    interface Props {
        data: any;
    }

    let { data }: Props = $props();

    let { users, profileDisplayName, username } = $derived(data)
</script>

<SEO title="Users {profileDisplayName} follows"></SEO>

<div class="panel">
    <PanelHeader>
        {#snippet headerText()}
        Users {profileDisplayName} follows
        {/snippet}
    </PanelHeader>
    {#each users as user}
        <ul>
            {#if user.username}
            <li>
                <a href="/user/{user.username}">
                        <CoverArt
                            altText={`${user.display_name}'s avatar`}
                            imgUrl={user.avatar_url}
                            lastFmImgUrl={user.last_fm_avatar_url}
                            artistName={user.avatar_artist_name}
                            releaseGroupName={user.avatar_release_group_name}
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
    a {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: var(--freq-inline-gap-double);
        color: var(--freq-color-text);
        
    }
    li {
        list-style: none;
        font-size: var(--freq-font-size-x-large);
    }
</style>