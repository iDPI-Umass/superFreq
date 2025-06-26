<script lang="ts">
    let { button, children }: {button?: any, children?:any } = $props()
</script>
<div class="panel-header">
    {@render children?.()}
    <div class="button-spacing">
        {@render button?.()}
    </div>
</div>

<style>
    .panel-header {
        display: flex;
        flex-direction: row;
        border-bottom: 1px solid var(--freq-color-border-panel);
        /* padding: var(--freq-height-spacer-half) var(--freq-width-spacer-half); */
        align-items: center;
    }
    h1 {
        text-transform: uppercase;
        font-size: var(--freq-font-size-medium);
        font-weight: var(--freq-font-weight-light);
        color: var(--freq-color-primary);
        padding: 0 var(--freq-width-spacer-half);
    }
    .button-spacing {
        margin: auto 0 auto auto;
        /* margin-left: auto;
        margin-right: var(--freq-width-spacer-half); */
    }
</style>