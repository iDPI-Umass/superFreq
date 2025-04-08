<!-- 
triggerText is tite of the menu
itemGroups should be an array of objects, with one object for each checkbox cluster containing keys 'legend' and 'items', such as:
    [
        {
            'legend': 'Feed Item Types',
            'items': ['now_playing_post', 'comment', reaction]
        },
        {
            'legend': 'Whose items?',
            'items': ['user', 'followers', 'strangers']
        }
    ]
inputGroup should be the variable that checked values will bind to
checkedValues should be an array of values that are checked by default
-->

<script lang="ts">
	import { DropdownMenu, type WithoutChild } from 'bits-ui'
    import ChevronDown from '@lucide/svelte/icons/chevron-down'
    import { consolidatedOptions } from '$lib/resources/parseData';
 
	type Props = DropdownMenu.Props & {
		triggerText: string;
		optionsGroups: any[];
        inputGroup: string;
        selectedOptions: any[];
		contentProps?: WithoutChild<DropdownMenu.Content.Props>;
	};
 
	let {
		open = $bindable(false),
		children,
		triggerText,
		optionsGroups,
        inputGroup,
        selectedOptions,
		contentProps,
		...restProps
	}: Props = $props();

    const isChecked = ( value: string, checkedValues: string[] ) => {
        const checked = checkedValues.includes(value) ? true : false
        return checked
    }

    const options = consolidatedOptions( optionsGroups, selectedOptions )
</script>
 
<DropdownMenu.Root bind:open {...restProps}>
	<DropdownMenu.Trigger>
		{triggerText}
        <ChevronDown></ChevronDown>
	</DropdownMenu.Trigger>
    <DropdownMenu.Content {...contentProps}>
        <form method="POST">
            {#each options as option}
                <legend>{option.legend}</legend>
                {#each option.items as item}
                    <label>
                        <input 
                            type="checkbox" 
                            id={item.id} 
                            name={inputGroup} 
                            value={item.value} 
                            checked={isChecked(item.value, option.selectedOptions)} 
                        />
                        {item.id}
                    </label>
                {/each}
            <button type="submit" class="standard" formaction="?/applyOptions">
                apply
            </button>
            <button type="submit" class="standard" formaction="?/saveDefaults">
                save as default
            </button>
        </form>
    </DropdownMenu.Content>
</DropdownMenu.Root>