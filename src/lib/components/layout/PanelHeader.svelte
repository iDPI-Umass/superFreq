<script lang="ts">
    import decoration from "$lib/assets/images/panel-header-decoration.svg"

    let { headerText, button }: {headerText: any, button?: any} = $props()
</script>

<div class="panel-header">
    <img src={decoration} alt="decoration" />
    <h2>
        {@render headerText()}
    </h2>
    <!-- {@render children?.()} -->
    <div class="button-spacing">
        {@render button?.()}
    </div>
</div>

<style>
    .panel-header {
        display: flex;
        flex-direction: row;
        border-top: 1px solid var(--freq-color-border-panel);
        border-bottom: 1px solid var(--freq-color-border-panel);
        margin: var(--freq-spacing-3x-small) 0;
        align-items: center;
    }
    h2 {
        text-transform: uppercase;
        font-size: var(--freq-font-size-medium);
        font-weight: var(--freq-font-weight-light);
        color: var(--freq-color-primary);
        padding: 0 var(--freq-width-spacer-half);
    }
    .button-spacing {
        margin-left: auto;
        margin-right: var(--freq-width-spacer-half);
    }
    @media screen and (max-width: 770px) {
        h2 {
            font-size: var(--freq-font-size-small);
        }
    }
</style>