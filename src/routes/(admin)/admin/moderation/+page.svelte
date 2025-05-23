<script lang="ts">
	import { enhance } from '$app/forms'
    import { parseTimestamp } from 'src/lib/resources/parseData'

    import SEO from '$lib/components/layout/SEO.svelte'
    import NotificationModal from '$lib/components/modals/NotificationModal.svelte'

    let { data } = $props()

    let { queueItems }: { queueItems: App.RowData[]} = $derived(data)
    let resolvePromise = $state(false)

    function itemType ( item: App.RowData ) {
        if ( item.target_user_id ) {
            return "user"
        }
        else if ( item.target_post_id ) {
            return "post"
        }
    }

    let showModerationLog = $state(false)
    let showChangelog = $state(false)
</script>

<svelte:head>
    <title>
        Moderation Dashboard
    </title>
</svelte:head>

<SEO title="Moderation Dashboard"></SEO>

<div class="panel">
    <h1>Moderation Dashboard</h1>
    <table>
        <thead>
            <tr>
                <th scope="col">
                    Time
                </th>
                <th scope="col">
                    Type
                </th>
                <th scope="col">
                    User
                </th>
                <th scope="col">
                    Target User
                </th>
                <th scope="col">
                    Target Post
                </th>
                <th scope="col">
                    Moderate
                </th>
            </tr>
        </thead>
        <tbody>
            {#each queueItems as item}
                <tr>
                    <td>
                        {item.timestamp}
                    </td>
                    <td>
                        {item.type}
                    </td>
                    <td>
                        <a href="/user/{item.username}">
                            {item.username}
                        </a>
                    </td>
                    <td>
                        {#if item.target_username}
                            <a href="/user/{item.target_username}">
                                {item.target_username}
                            </a>
                        {/if}
                    </td>
                    <td>
                        {#if item.target_post_timestamp}
                            {#if Object.keys(item.post_changelog).length > 0}
                                <button
                                    class="more-info"
                                    onclick={() => showChangelog = true}
                                >
                                    post changelog
                                </button>
                                <NotificationModal
                                    showModal={showChangelog}
                                >
                                    {#snippet headerText()}
                                    Post Changelog
                                    {/snippet}
                                    {#snippet message()}
                                    {JSON.stringify(item.post_changelog)}
                                    {/snippet}
                                </NotificationModal>
                            {/if}
                            <a href="/posts/{item.target_post_username}/now-playing/{parseTimestamp(item.target_post_timestamp)}">
                                {item.target_post_username}: {item.target_post_timestamp}
                            </a>
                        {/if}
                    </td>
                    <td>
                        {#if Object.keys(item.moderation_log).length > 0}
                            <button
                                class="more-info"
                                onclick={() => showModerationLog = true}
                            >
                                moderation log
                            </button>
                            <NotificationModal
                                showModal={showModerationLog}
                            >
                                {#snippet headerText()}
                                Moderation Log
                                {/snippet}
                                {#snippet message()}
                                {JSON.stringify(item.moderation_log)}
                                {/snippet}
                            </NotificationModal>
                        {/if}
                        <form
                            method="POST"
                            action="?/update"
                            use:enhance={() => {
                                resolvePromise = true
                                return async ({ update }) => {
                                    await update()
                                    resolvePromise = false
                                }
                            }}
                        >
                            <input
                                type="hidden"
                                name="item-id"
                                id="item-id"
                                value={item.moderation_item_id}
                            />
                            <input
                                type="hidden"
                                name="item-type"
                                id="item-type"
                                value={itemType(item)}
                            />
                            <textarea
                                name="notes"
                                id="notes"
                            ></textarea>
                            <div class="cell-row">
                                <div class="input-column">
                                    <label for="resolved">
                                        archive
                                    </label>
                                    <input 
                                        type="checkbox" 
                                        name="resolved"
                                        id="resolved"
                                    />
                                </div>
                                <button
                                    class="standard"
                                    type="submit"
                                    disabled={resolvePromise}
                                >
                                    update
                                </button>
                            </div>
                        </form>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<style>
    .panel {
        border: none;
    }
    table {
        border: var(--freq-border-panel);
    }
    tbody tr {
        border-bottom: var(--freq-border-panel);
    }
    th, td {
        border-right: var(--freq-border-panel);
        border-bottom: var(--freq-border-panel);
        padding: var(--freq-spacing-small);
    }
    th:last-child, 
    td:last-child {
        border-right: none;
    }
    tr:last-child > td {
        border-bottom: none;
    }
    .input-column {
        display: flex;
        flex-direction: column;
        align-items: start;
    }
    .cell-row {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
    .more-info {
        border: var(--freq-border-panel-light);
        margin-bottom: var(--freq-spacing-small);
    }
    .more-info:is(:hover, :focus) {
        border: var(--freq-border-panel-light);
        text-decoration: underline;
    }
</style>