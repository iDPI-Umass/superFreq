<script lang="ts">
	import type { Snippet } from "svelte";
	import { DropdownMenu, type WithoutChild } from "bits-ui";
    import ChevronDown from '@lucide/svelte/icons/chevron-down';

    import CoverArt from "src/lib/components/layout/CoverArt.svelte";
 
	type Props = DropdownMenu.Props & {
		buttonText: string
		items: any[]
        avatar?: any
        triggerFontSize?: string
        screenSize?: string
		contentProps?: WithoutChild<DropdownMenu.Content.Props>
		// other component props if needed
	};
 
	let {
		open = $bindable(false),
		children,
		buttonText,
		items,
        avatar,
        screenSize='desktop',
        triggerFontSize='medium',
		contentProps,
		...restProps
	}: Props = $props();

    const responsiveStyling = {
        'mobile': {
            'fontSize': 'xx-small-font',
            'triggerStyling': 'nav-mobile',
            'iconSize': 17
        },
        'desktop': {
            'fontSize': 'medium-font',
            'triggerStyling': 'nav-desktop',
            'iconSize': 16
        }
    } as any
</script>
 
<DropdownMenu.Root bind:open {...restProps}>
	<DropdownMenu.Trigger class={responsiveStyling[screenSize]['triggerStyling']}>
        {#if avatar}
        <CoverArt
            item={avatar}
            altText={avatar['release_group_name']}
        ></CoverArt>
        {/if}
        <span class={responsiveStyling[screenSize]['fontSize']}>{buttonText}</span>
        <ChevronDown size={responsiveStyling[screenSize]['iconSize']}></ChevronDown>
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

<style>
    .xx-small-font {
        font-size: var(--freq-font-size-2x-small);
    }
    .x-small-font {
        font-size: var(--freq-font-size-x-small);
    }
    .small-font {
        font-size: var(--freq-font-size-small);
    }
    .medium-font {
        font-size: var(--freq-font-size-medium);
    }
</style>