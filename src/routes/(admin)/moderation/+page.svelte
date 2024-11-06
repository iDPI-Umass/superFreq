<script lang="ts">
	import { enhance } from '$app/forms'
    import { parseTimestamp } from 'src/lib/resources/parseData'

    let { data } = $props()

    let { items } = $derived(data)
    let resolvePromise = $state(false)
</script>

<svelte:head>
    <title>
        Moderation Dashboard
    </title>
</svelte:head>

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
                    Changelog
                </th>
                <th scope="col">
                    Resolved
                </th>
            </tr>
        </thead>
        <tbody>
            {#each items as item}
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
                            <a href="/posts/{item.target_post_username}/now-playing/{parseTimestamp(item.target_post_timestamp)}">
                                {item.target_post_username}: {item.target_post_timestamp}
                            </a>
                        {/if}
                    </td>
                    <td>
                        {item.changelog}
                    </td>
                    <td>
                        <form
                            method="POST"
                            action="?/archive"
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
                            <button
                                class="standard"
                                type="submit"
                                disabled={resolvePromise}
                            >
                            archive
                        </button>
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
    th, td {
        border-right:  var(--freq-border-panel);
        padding: var(--freq-spacing-small);
    }
    tr {
        border-top:  var(--freq-border-panel);
    }
    th:last-child, 
    td:last-child,
    tr:last-child {
        border: none;
    }
</style>