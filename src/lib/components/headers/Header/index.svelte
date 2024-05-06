<script lang="ts">

    import logo from "/images/logo/freq-logo-dark.svg";
    //import { NavMenu } from '$lib/components/ui/dropdown-menu/nav'; 
    import { DropdownMenu } from "bits-ui";
    import ChevronDown from 'lucide-svelte/icons/chevron-down';

    export let session
    export let displayName
    //let open = false;

    let accountMenuItems = [
		{ url: '/account', text: 'account settings' },
		{ url: '/feed', text: 'feed' },
		{ url: '/collections', text: 'discover' },
		{ url: '/collection/new', text: 'new collection' }
	]
</script>

<svelte:head>
	<title>Freq</title>
</svelte:head>
<div class="border-lower">
    <header>
        <img alt="Freq logo" src={logo} />
        <div class="nav-block">
            {#if !session}
                <button class="nav-item">
                    <a href="/collections">
                        All collections
                    </a>
                </button>
                <button class="nav-item">
                    <a href="/login">
                        Log In or Sign Up
                    </a>
                    <!-- <ArrowUpRight size={20} color="#9b40fc" /> -->
                </button>
            {:else}
                <nav aria-labelledby="primary-navigation">
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger>{displayName} <ChevronDown></ChevronDown></DropdownMenu.Trigger>
                        <DropdownMenu.Content>
                            {#each accountMenuItems as item}
                            <DropdownMenu.Item>
                                <a href={item.url}>
                                    {item.text}
                                </a>
                            </DropdownMenu.Item>
                            {/each}
                        </DropdownMenu.Content>
                    </DropdownMenu.Root>
                </nav>
            {/if}
        </div>
    </header>
</div>

<style>
    .border-lower{
        border-bottom: 5px double var(--dark-mode-secondary-color);
    }
    header {
        display: flex;
        flex-direction: row;
        max-width: 1000px;
        margin: 2vh 2vw;
        font-family: "Krona_One", sans-serif;
        color: #8091A3;
        gap: 0.25em;
        align-items: center;
        justify-content: space-between;
    }
    img {
        position: sticky;
        max-height: 46px; 
        margin: auto 1vw;
    }
    nav { 
        display: flex;
    }
    .nav-block {
        display: flex;
        flex-direction: row;
        gap: 0.5em;
    }
    .nav-item {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.25em;
    }
</style>