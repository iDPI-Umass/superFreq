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
    import { enhance } from '$app/forms'
    import { getContext } from 'svelte'
	import { DropdownMenu, type WithoutChild } from 'bits-ui'
    import ChevronDown from '@lucide/svelte/icons/chevron-down'
    import { consolidatedOptions } from '$lib/resources/parseData'
    import { feedData } from '$lib/resources/states.svelte'
 
	type Props = DropdownMenu.Props & {
		triggerText: string;
		optionsGroups: any[];
        inputGroup: string;
		contentProps?: WithoutChild<DropdownMenu.Content.Props>;
	};
 
	let {
		open = $bindable(false),
		children,
		triggerText,
		optionsGroups,
        inputGroup,
		contentProps,
		...restProps
	}: Props = $props();

    const isChecked = ( value: string, category: string, selectedOptions: any[] ) => {
        const options = selectedOptions.find((element) => element.category == category)
        const checked = options.items.includes(value) ? true : false
        return checked
    }

    const options = consolidatedOptions( optionsGroups, feedData.selectedOptions )

    let loading = $state(false)

    const selectedOptions = $derived(feedData.selectedOptions)
</script>
 
<DropdownMenu.Root bind:open {...restProps}>
	<DropdownMenu.Trigger>
		{triggerText}
        <ChevronDown></ChevronDown>
	</DropdownMenu.Trigger>
    <DropdownMenu.Content {...contentProps}>
        <form method="POST" use:enhance={() => {
            loading = true
            return(({update, result}) => {
                update()
                open = false
                loading = false
                result
            })
        }}>
            <div class="vertical">
                    {#each options as option}
                        <legend>
                            {option.legend}
                        </legend>
                        <div class="checkboxes-group">
                            {#each option.items as item}
                                <label>
                                    <input 
                                        type="checkbox" 
                                        id={item.id} 
                                        name={inputGroup} 
                                        value={item.value} 
                                        checked={isChecked(item.value, option.category,  selectedOptions)} 
                                    />
                                    {item.id}
                                </label>
                            {/each}
                        </div>
                    {/each}
                <button 
                    type="submit" 
                    class="standard" 
                    formaction="?/applyOptions"
                    disabled={loading} 
                >
                    apply
                </button>
                <!-- <button type="submit" class="standard" formaction="?/saveDefaults">
                    save as default
                </button> -->
            </div>
        </form>
    </DropdownMenu.Content>
</DropdownMenu.Root>

<style>
    .vertical {
        display: flex;
        flex-direction: column;
    }
    .checkboxes-group {
        display: flex;
        flex-direction: column;
        padding-bottom: var(--freq-spacing-small);
    }
</style>