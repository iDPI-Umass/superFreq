<script>
    /** @type {{children?: import('svelte').Snippet}} */
    let { children } = $props();
</script>

<svelte:options runes={true} />

<main>
    {@render children?.()}
</main>

<style>
    main {
        flex: 1 1 0;
        min-height: 0;
        max-width: 100vw;
        margin: 0;
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        justify-content: flex-start;
        align-items: center;
        overflow-y: scroll;
    }

    @media ( min-width: 680px ) {
        main {
        margin: 0 1rem 1rem 1rem;
        }
    }
</style>