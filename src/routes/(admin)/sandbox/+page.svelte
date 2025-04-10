<script lang="ts">
    import OptionsMenu from "src/lib/components/menus/OptionsMenu.svelte";

    const items = [
        {
            'id': 'option1',
            'value': 'one'
        },
        {
            'id': 'option1',
            'value': 'two'
        },
        {
            'id': 'option3',
            'value': 'three'
        }
    ]

    const inputGroup = 'input-group'
</script>

<!-- <div class="panel">
    <OptionsMenu
        triggerText='options'
        items={items}
        inputGroup={inputGroup}
    ></OptionsMenu>
</div> -->