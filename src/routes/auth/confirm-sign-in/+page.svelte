<script lang="ts">
    import type { PageData } from "./$types"

    export let data: PageData
    $: data

    const urlString = data?.urlString as string
</script>

<form class="horizontal" method="POST" action="?/confirm">
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

<style>
    form {
        display: flex;
        width: 100%;
        margin: var(--freq-spacing-large) auto;
    }
    form * {
        margin: auto;
    }
</style>
