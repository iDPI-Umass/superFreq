<script lang="ts">
    import { Toolbar } from "bits-ui";

    let testValue
</script>

<Toolbar.Root>
    <Toolbar.Group
        bind:value={testValue}
        type="single"
    >
        <Toolbar.GroupItem
            aria-label="item one"
            value="one"
        >
            one
        </Toolbar.GroupItem>
        <Toolbar.GroupItem
            aria-label="item two"
            value="two">
            two
        </Toolbar.GroupItem>
    </Toolbar.Group>
</Toolbar.Root>
<p>{testValue}</p>