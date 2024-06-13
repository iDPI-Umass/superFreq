<script lang="ts">
    import { Popover } from "bits-ui";
    import { flyAndScale } from "$lib/utils/transitions.ts"

    import Ellipsis from 'lucide-svelte/icons/ellipsis'
    import PenLine from 'lucide-svelte/icons/pen-line'
    import Trash2 from 'lucide-svelte/icons/trash-2'
</script>



<Popover.Root>
    <Popover.Trigger>
        <Ellipsis size="16" color="var(--freq-color-text-muted)"></Ellipsis>
    </Popover.Trigger>
    <Popover.Content transition={flyAndScale}>
        <button class="popover-item">
            <PenLine size="16" color="var(--freq-color-text-muted)"></PenLine>
            <span class="descriptor">
                edit
            </span>
        </button>
        <button class="popover-item">
            <Trash2 size="16" color="var(--freq-color-text-muted)"></Trash2>
            <span class="descriptor">
                delete
            </span>
        </button>
    </Popover.Content>
</Popover.Root>