<script lang="ts">
    import { goto } from '$app/navigation'
    import { page } from '$app/stores'
    
    import { Toolbar } from "bits-ui"
    import { Select } from "bits-ui"
    import ChevronDown from '@lucide/svelte/icons/chevron-down'
    import LayoutGrid from '@lucide/svelte/icons/layout-grid'
    import AlignJustify from '@lucide/svelte/icons/align-justify'

    import SEO from '$lib/components/layout/SEO.svelte'
    import GridList from "$lib/components/GridList.svelte"
    import InfoBox from '$lib/components/InfoBox.svelte'
    import InlineMarkdownText from '$lib/components/InlineMarkdownText.svelte'

    import PostReply from 'src/lib/components/Posts/PostReply.svelte'
    import PostReplyEditor from 'src/lib/components/Posts/PostReplyEditor.svelte'

    import LikeReact from '$lib/components/Posts/LikeReact.svelte'



    import { collectionData } from '$lib/resources/states.svelte.js'


    let { data, form } = $props();
    let { sessionUserId, collectionId, collectionMetadata, collectionContents, viewPermission, editPermission, followData, replies, infoBoxText } = $derived(data);

    let gridListSelect = $state("grid")

    let selected = $state('sort order') as any

    const categories: App.Lookup = {
        "artists": "artists",
        "release_groups": "albums",
        "recordings": "tracks"
    }

    const updatedAt = $derived(new Date(collectionMetadata?.updated_at).toLocaleDateString())

    const sortOptions = ['default', 'reverse', 'artist A --> Z', 'artist Z --> A'] as any

    let sortOption = $derived(collectionMetadata.default_view_sort ?? 'default') as string

    let sortedItems = $state()

    function sort ( option: string ) {
        const items = collectionContents
        if ( option == "default" ) {
            items.sort((a, b) => a.item_position - b.item_position)
        }
        else if ( option == "reverse" ) {
            items.sort((a, b) => b.item_position - a.item_position)
        }
        else if ( option == "artist A --> Z" || option == "artist_asc" ) {
            items.sort((a, b) => {
                const nameA = a.artist_name.toUpperCase()
                const nameB = b.artist_name.toUpperCase()
                if (nameA < nameB) {
                    return -1
                }
                if (nameA > nameB) {
                    return 1
                }
                return 0
            })
        }
        else if ( option == "artist Z --> A" || option == "artist_desc" ) {
            items.sort((a, b) => {
                const nameA = a.artist_name.toUpperCase()
                const nameB = b.artist_name.toUpperCase()
                if (nameA < nameB) {
                    return 1
                }
                if (nameA > nameB) {
                    return -1
                }
                return 0
            })
        }
        else {
            return items
        }

        return items
    }

    let actionSuccess = $derived(form?.success as boolean)

    function replyId ( username: string, createdAt: Date ) {
        const replyTimestampString = createdAt.toISOString()
        const replyTimestamp = Date.parse(replyTimestampString).toString()
        const slug = username?.concat(replyTimestamp)
        return slug
    }

    let reactionActive = $derived(collectionMetadata?.reaction_user_ids.includes(sessionUserId)) as boolean
    let reactionCount = $derived(collectionMetadata?.reaction_count) as number

    $effect(() => {
        sortedItems =  sort(sortOption)
        collectionData.type = collectionMetadata?.type as string
        collectionData.status = collectionMetadata?.status as string    
        collectionData.updatedAt = collectionMetadata?.updated_at as Date
        collectionData.collectionItems = collectionContents as App.RowData[]
    })

</script>

<!-- <svelte:options runes={true} /> -->
<svelte:head>
	<title>
		{collectionMetadata?.title}
	</title>
</svelte:head>

<SEO title={collectionMetadata?.title}></SEO>

<div class="two-column">
    <div class="collection-container">
        <div class="collection-info">
                <div class="collection-info-row">
                    <h1>{collectionMetadata?.title}</h1>
                    <div class="buttons-group">
                        {#if 
                            sessionUserId && ( sessionUserId != collectionMetadata?.owner_id )}
                            <form
                                method="POST"
                                action="?/followCollection"
                            >
                                <input 
                                    type="hidden"
                                    name="collection-id" 
                                    id="collection-id"
                                    value={collectionId}
                                />
                                <button 
                                    class="standard" 
                                    formaction="?/followCollection"
                                >
                                {#if followData && followData['follows_now'] == true}
                                    unfollow
                                {:else}
                                    + follow
                                {/if}
                                </button>
                            </form>
                        {/if}
                        {#if sessionUserId}
                            <LikeReact
                                collectionId={collectionId}
                                reactionCount={reactionCount}
                                reactionActive={reactionActive}
                                buttonClass="standard"
                            >
                            </LikeReact>
                        {/if}
                        {#if sessionUserId && editPermission}
                            <button 
                                class="standard"
                                onclick={() => goto($page.url.pathname + '/edit')}
                            >
                            edit
                            </button>
                        {/if}
                    </div>
                </div>
            <div class="collection-info-row">
                <div class="collection-info-attribution">
                    <p class="collection-info-text">
                        Collection by 
                        <a href="/user/{collectionMetadata?.username}">
                            {collectionMetadata?.display_name}
                        </a>
                    </p>
                    <p class="collection-date-text">Last updated on {updatedAt}</p>
                </div>
                {#if collectionMetadata?.status == 'open' || collectionMetadata?.status == 'private'}
                <InfoBox
                    mode="inline"
                >
                    {infoBoxText[collectionMetadata?.status]}
                </InfoBox>
                {/if}
            </div>
            <div class="collection-description-text">
                <InlineMarkdownText text={collectionMetadata?.description_text}></InlineMarkdownText>
            </div>
        </div>

        <div class="sort">
            <div class="sort-column">
                <Select.Root type="single" bind:value={selected}>
                    <Select.Trigger class="sort-options">
                        <span class="trigger-label">  
                            {selected ?? 'sort order'}
                        </span>
                        <span class="chevron">
                            <ChevronDown size={16}></ChevronDown>
                        </span>
                    </Select.Trigger>
                    <Select.Portal>
                        <Select.Content>
                            {#each sortOptions as option}
                            <Select.Item value={option} label={option}>
                                {option}
                            </Select.Item>
                            {/each}
                        </Select.Content>
                    </Select.Portal>
                </Select.Root>
            </div>
            <div class="sort-column">
                <Toolbar.Root>
                    <Toolbar.Group
                        bind:value={gridListSelect}
                        type="single"
                    >
                        <Toolbar.GroupItem
                            aria-label="grid"
                            value="grid"
                        >
                            <div class="toolbar-icon">
                                <LayoutGrid size={20}></LayoutGrid>
                            </div>
                        </Toolbar.GroupItem>
                        <Toolbar.GroupItem
                            aria-label="list"
                            value="list"
                        >
                            <div class="toolbar-icon">
                                <AlignJustify size={20}></AlignJustify>
                            </div>
                        </Toolbar.GroupItem>
                    </Toolbar.Group>
                </Toolbar.Root>
                <span class="view-mode">view mode: {gridListSelect}</span>
            </div>
        </div>
        <GridList
            collectionStatus={collectionMetadata.status}
            collectionReturned={viewPermission}
            layout={gridListSelect}
            mode="view"
        >
        </GridList>
    </div>
</div>

<div class="post-panel">
    <input
        type="hidden"
        form="submitReply"
        name="collection-id"
        id="collection-id"
        value={collectionId}
    />
    <PostReplyEditor
        styling="collection"
        placeholderText="Comment..."
    ></PostReplyEditor>
    {#each replies as reply}
        <div id={ replyId( reply.username, reply.created_at )}>
            <div class="comment-panel">
                <PostReply
                    reply={reply}
                    sessionUserId={sessionUserId}
                    userActionSuccess={actionSuccess}
                    allowReply={true}
                ></PostReply>
            </div>
        </div>
    {/each}
</div>

<style>
    span.view-mode {
        padding-top: 0;
        margin-top: 0;
    }
    .post-panel {
        border: none;
        margin-left: var(--freq-spacing-small);
    }
</style>
