<script lang="ts">
    import { Popover } from "bits-ui"
    import Info from '@lucide/svelte/icons/info'

    let { children } = $props()
</script>
<!-- <svelte:options runes={true} /> -->

<Popover.Root>
    <Popover.Trigger>
        <Info size="16"></Info>
    </Popover.Trigger>
    <Popover.Content class="tooltip">
        <p>
            {@render children()}
        </p>
    </Popover.Content>
</Popover.Root>