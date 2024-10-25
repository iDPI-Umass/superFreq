<script lang="ts">
    import type { PageData } from "./$types"

    interface Props {
        data: PageData;
    }

    let { data }: Props = $props();

    const urlString = data?.urlString as string
</script>
<svelte:options runes={true} />

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
