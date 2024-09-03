<script lang="ts">
  import { DropdownMenu } from "bits-ui";
  import ChevronDown from 'lucide-svelte/icons/chevron-down';
  import logo from "$lib/assets/images/logo/freq-logo-dark.svg";

  import hats from '$lib/assets/images/hats.jpg'

  export let sessionUserId: string | null
  export let displayName: string
  export let avatarUrl: string
  export let username: string

  let accountMenuItems = [
    { url: `/${username}`, text: 'profile' },
    { url: '/account', text: 'account settings' },
    { url: `/api/auth/signout`, text: 'sign out'}
	]

</script>

<svelte:head>
  <title>Freq</title>
</svelte:head>


<div class="grid-background">
  <header>
    <a class="logo" href="/">
      <img alt="Freq" src={logo} />
    </a>
    <nav>
      {#if sessionUserId}
        <a href="/now-playing/new">
          <button>
            now playing
          </button>
        </a>
        <a href="/feed">
          <button>
            feed
          </button>
        </a>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            collections
            <ChevronDown></ChevronDown>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
              {#each accountMenuItems as item}
                <DropdownMenu.Item href={item.url}>
                  {item.text}
                </DropdownMenu.Item>
              {/each}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
        <a href="/about">
          <button>
            about
          </button>
        </a>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <img src={avatarUrl} alt="{displayName}'s avatar" />
            {displayName} 
            <ChevronDown></ChevronDown>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item href={"/collection/new"}>
              New Collection
            </DropdownMenu.Item>
            <DropdownMenu.Item href={"/collections"}>
              All Collections
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      {:else}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            Explore
            <ChevronDown></ChevronDown>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item href={"/collections"}>
              Collections
            </DropdownMenu.Item>
            <DropdownMenu.Item href={"/posts"}>
              Posts
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
        <a href="/about">
          <button>
            about
          </button>
        </a>
        <a href="/welcome">
          <button>
            log in/sign up
          </button>
        </a>
      {/if}
    </nav>
  </header>
</div>

  
<style>
  .grid-background {
    background: var(--freq-grid-dark-background);
  }
  header {
    display: flex;
    flex-direction: row;
    max-width: 1000px;
    padding: 2vh 2vw;
    font-family: "Krona_One", sans-serif;
    color: #8091A3;
    gap: 0.25em;
    align-items: center;
    justify-content: space-between;
}
  img {
      position: sticky;
      height: 46px; 
      width: auto;
      margin: auto 1vw;
  }
  nav { 
      display: flex;
  }
  nav img {
    max-height: 20px;
    margin-right: var(--freq-spacing-small);
  }
  </style>