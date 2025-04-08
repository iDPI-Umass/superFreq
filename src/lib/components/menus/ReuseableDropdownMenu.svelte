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