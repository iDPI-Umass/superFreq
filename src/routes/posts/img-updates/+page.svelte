<script lang="ts">
    import { enhance } from "$app/forms"
    let { data, form } = $props()

    const { releaseGroups } = data

    const releaseGroupCount = releaseGroups.length
</script>

<svelte:options runes={true} />

<div class="panel">
    <p>{releaseGroupCount} release groups fetched</p>
    <form method="POST" use:enhance>
        <input
            type="hidden"
            name="release-groups"
            id="release-groups"
            value={JSON.stringify(releaseGroups)}
        />
        <button class="standard" type="submit">
            update images
        </button>
    </form>
    {#await form?.success}
        <p>running...</p>
    {:then}
        <p>{form?.updateCount} release groups updated</p>
    {:catch}
        <p>failed</p>
    {/await}
</div>