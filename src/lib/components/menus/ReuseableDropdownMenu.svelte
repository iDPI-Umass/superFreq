<script lang="ts">
	import type { Snippet } from "svelte";
	import { DropdownMenu, type WithoutChild } from "bits-ui";
    import ChevronDown from '@lucide/svelte/icons/chevron-down';

    import CoverArt from "src/lib/components/CoverArt.svelte";
 
	type Props = DropdownMenu.Props & {
		buttonText: string;
		items: any[];
        avatar?: any;
		contentProps?: WithoutChild<DropdownMenu.Content.Props>;
		// other component props if needed
	};
 
	let {
		open = $bindable(false),
		children,
		buttonText,
		items,
        avatar,
		contentProps,
		...restProps
	}: Props = $props();
</script>
 
<DropdownMenu.Root bind:open {...restProps}>
	<DropdownMenu.Trigger>
        {#if avatar}
        <CoverArt
            item={avatar}
            altText={avatar['release_group_name']}
        ></CoverArt>
        {/if}
		{buttonText}
        <ChevronDown></ChevronDown>
	</DropdownMenu.Trigger>
    <DropdownMenu.Content {...contentProps}>
        {#each items as item}
            {#if item.url}
            <a href={item.url}>
                <DropdownMenu.Item textValue={item.text}>
                    {item.text}
                </DropdownMenu.Item>
            </a>
            {:else}
            <DropdownMenu.Item textValue={item.text}>
                {item.text}
            </DropdownMenu.Item>
            {/if}
        {/each}
    </DropdownMenu.Content>
</DropdownMenu.Root>

<!-- <style>
    [data-menu-root] {
        background: none;
    }

    [data-menu-trigger] {
        display: flex;
        flex-direction: row;
        color: var( --freq-color-text-muted);
        background: transparent;
        font-family: 'Krona_One', monospace;
        border: none;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        text-transform: uppercase;
    }

    [data-menu-trigger]:is(:hover, :focus) {
        background: var(--freq-color-button-lens);
        border: none;
        background: var(--freq-color-button-lens-active);
        color: var(--freq-color-text-dark);
    }

    [data-menu-trigger]:active {
        scale: 98%;
        background: var(--freq-color-button-lens-active);
        border: none;
        color: var(--freq-color-text);
    }

    [data-menu-content] {
        display: flex;
        flex-direction: column;
        color: var( --freq-color-text-muted);
        background: var(--freq-color-panel-background);
        font-family: 'Roboto', sans-serif;
        border: 1px solid var(--freq-color-border-panel) !important;
        padding: var(--freq-spacing-small);
        line-height: var(--freq-line-height-normal);
        text-decoration: none;
        border: none;
        overflow: visible;
    }

    [data-menu-content] a,
    [data-menu-item] a {
        color: var( --freq-color-text-muted);
        text-decoration: none;
    }

    [data-menu-item] {
        background: var(--freq-color-panel-background);
        border: none;
        text-decoration: none;
    }

    [data-menu-item]:is(:hover, :focus) {
        background: var(--freq-color-button-lens-active);
        color: var(--freq-color-text);
    }

    [data-menu-item]:active {
        scale: 98%;
        background: var(--freq-color-button-lens-active);
        color: var(--freq-color-text-dark);
    }

    [data-menu-item]:enabled > * {
        border: none;
    }
</style> -->