<script lang="ts">
    import type { PageLoadData, ActionData } from "./$types"

    export let data: PageLoadData
    $: data

    const urlString = data?.urlString as string
</script>

<div class="panel">
    <form method="POST" action="?/confirm">
        <input
            type="hidden"
            name="url-string"
            id="url-string"
            value={urlString}
        />
        <button class="standard" type="submit">
            complete sign-in
        </button>
    </form>
    
</div>

<style>
    .panel {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    form {
        margin: auto;
    }
</style>
