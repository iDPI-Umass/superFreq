<script lang="ts">
    import ChevronDown from 'lucide-svelte/icons/chevron-down';
    import { NavItem } from '..';
    export let header;
    export let navItems;
    export let open: boolean;

    function toggleOpen() {
        open = !open;
    }
</script>

<div>
    <div class="top-level">
        <button class="purple-border-button" on:click|preventDefault={toggleOpen}>
            <div class="header">
                {header} <ChevronDown size={20}/>
            </div>
        </button>
    </div>
    {#if open}
        <div class="options">   
            {#each navItems as item}
                <ul>
                    <NavItem 
                        url={item.url}
                        text={item.text}
                    />
                </ul>
            {/each}
        </div>
    {/if}
</div>

<style>
    .top-level {
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 3vh;
    }
    .header {
        font-size: 14px;
        display: flex;
        gap: 0.25em;
        align-items: center;
        justify-content: center;
        overflow: visible;
    }
    .icon {
        /* Icon size will relative to font-size of .text-wrapper */
        width: 1em;
        height: 1em;
    }
    .options {
        display: block;
        position: absolute;
        border: 1px var(--freq-purple) solid;
        margin: 3px 0;
        padding: 1vh 1vw;
        top: 60px;
        background: black;
    }
    ul {
        list-style: none;
        align-items: left;
        margin: 0;
        padding: 0;
        color: white;
    }
</style>