<script lang="ts">
    export let mode: string = "compact" // "standard", "compact", "inline"

    const boxStyle = {
        'standard': 'info-box',
        'compact': 'info-box-compact',
        'inline': 'info-box-inline'
    } as App.StringLookupObject
</script>

<div class={boxStyle[mode]} aria-label="hint">
    <p>
        <slot />
    </p>
</div>