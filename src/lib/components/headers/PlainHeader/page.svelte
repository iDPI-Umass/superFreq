<script lang="ts">
  import { goto } from "$app/navigation"
  import { DropdownMenu } from "bits-ui"
  import ChevronDown from 'lucide-svelte/icons/chevron-down';
  import logo from "$lib/assets/images/logo/freq-logo-dark.svg"
  import wave from "$lib/assets/images/logo/freq-wave.svg"
  import { profileStoresObject } from "src/lib/stores"

  let profileObject: App.ProfileObject
  $: profileObject

  profileObject = $profileStoresObject

  export let sessionUserId: string | null
  export let username: string = profileObject?.username as string
  export let displayName: string = profileObject?.display_name as string
  export let avatarUrl: string = profileObject?.avatar_url as string

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

    <nav class="wide">
      {#if sessionUserId}
      <a href="/feed">
        <button>
          feed
        </button>
      </a>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          create
          <ChevronDown></ChevronDown>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
            <DropdownMenu.Item href={"/posts/now-playing/new"}>
              new post
            </DropdownMenu.Item>
            <DropdownMenu.Item href={"/collection/new"}>
              new collection
            </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          discover
          <ChevronDown></ChevronDown>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
            <DropdownMenu.Item href={"/collections"}>
              collections
            </DropdownMenu.Item>
            <DropdownMenu.Item href={"/users"}>
              users
            </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      <a href="/about">
        <button>
          about
        </button>
      </a>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <img src={avatarUrl ?? wave} alt="{displayName}'s avatar" />
          {displayName ?? 'display name'} 
          <ChevronDown></ChevronDown>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item href={`/user/${username}`}>
            profile
          </DropdownMenu.Item>
          <DropdownMenu.Item href={"/account"}>
            account
          </DropdownMenu.Item>
          <DropdownMenu.Item href={"/sign-out"}>
            sign out
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
    <nav class="narrow">
      {#if sessionUserId}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          explore
          <ChevronDown></ChevronDown>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
            <DropdownMenu.Item href={"/feed"}>
              feed
            </DropdownMenu.Item>
            <DropdownMenu.Item href={"/posts/now-playing/new"}>
              new post
            </DropdownMenu.Item>
            <DropdownMenu.Item href={"/collection/new"}>
              new collection
            </DropdownMenu.Item>
            <DropdownMenu.Item href={"/about"}>
              about
            </DropdownMenu.Item>
            <DropdownMenu.Item href={"/collections"}>
              discover collections
            </DropdownMenu.Item>
            <DropdownMenu.Item href={"/users"}>
              discover users
            </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <img src={avatarUrl ?? wave} alt="{displayName}'s avatar" />
          {displayName ?? 'display name'} 
          <ChevronDown></ChevronDown>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item href={`/user/${username}`}>
            profile
          </DropdownMenu.Item>
          <DropdownMenu.Item href={"/account"}>
            account
          </DropdownMenu.Item>
          <DropdownMenu.Item href={"/sign-out"}>
            sign out
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
            <DropdownMenu.Item href={"/about"}>
              About
            </DropdownMenu.Item>
            <DropdownMenu.Item href={"/collections"}>
              Collections
            </DropdownMenu.Item>
            <DropdownMenu.Item href={"/posts"}>
              Posts
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
        <a href="/welcome">
          <button>
            log in/sign up
          </button>
        </a>
      {/if}
    </nav>
  </header>
  <a class="report" target="_blank" href="https://docs.google.com/forms/d/e/1FAIpQLSfKj4FlApgfM-Kc4rYwAxNQslBMS9rk-DdfowMa5qcHlRYhew/viewform?usp=sf_link">
    <button class="standard">report a bug</button>
  </a>

</div>

  
<style>
  .grid-background {
    display: flex;
    flex-direction: column;
    width: 100vw;
    background: var(--freq-grid-dark-background);
  }
  header {
    display: flex;
    flex-direction: row;
    max-width: var(--freq-desktop-width);
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
    margin-right: 10%;
  }
  nav.narrow {
    display: none
  }
  a.report {
    margin: auto auto var(--freq-spacing-large) auto;
  }
  @media screen and (max-width: 770px) {
    nav.wide {
      display: none;
    }
    nav.narrow {
      display: flex;
    }
  }
  </style>