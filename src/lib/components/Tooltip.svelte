<script lang="ts">
    import { Popover } from "bits-ui"
    import Info from 'lucide-svelte/icons/info'

    let { children } = $props()
</script>

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