<script lang="ts">
      import decoration from "$lib/assets/images/panel-header-decoration.svg";
</script>

<div>
    <img src={decoration} alt="decoration" />
    <h1>
        <slot />
    </h1>
</div>

<style>
    div {
        display: flex;
        flex-direction: row;
        border-top: 1px solid var(--freq-color-border-panel);
        border-bottom: 1px solid var(--freq-color-border-panel);
        margin: var(--freq-spacing-3x-small) 0;
        align-items: center;
    }
    h1 {
        text-transform: uppercase;
        font-size: var(--freq-font-size-medium);
        color: var(--freq-color-primary);
        padding: 0 var(--freq-width-spacer-half);
    }
</style>