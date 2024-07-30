<script lang="ts">
    import type { PageData } from './$types'

    export let data: PageData;
    let { collection } = data;
    $: ({ collection } = data);
</script>