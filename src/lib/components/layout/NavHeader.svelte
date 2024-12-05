<script lang="ts">
  import { goto } from "$app/navigation"
  import { DropdownMenu } from "bits-ui"
  import ChevronDown from 'lucide-svelte/icons/chevron-down';
  import logo from "$lib/assets/images/logo/freq-logo-dark.svg"
  import wave from "$lib/assets/images/logo/freq-wave.svg"
  import { profileStoresObject } from "src/lib/stores"

  import CoverArt from "src/lib/components/CoverArt.svelte";

  interface ComponentProps {
    sessionUserId: string | null
    username: string
    displayName: string
    avatarItem: App.StringLookupObject
  }

  let {
    sessionUserId,
    username,
    displayName,
    avatarItem
  }: ComponentProps = $props()

  // let profileObject = $state() as App.ProfileObject

  // let profileObject = $derived($profileStoresObject)
  // let storesUsername = $derived(profileObject.username) as string

</script>

<svelte:options runes={true} />
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
        <button class="nav">
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
            <DropdownMenu.Item href={"/feed/firehose"}>
              universal feed
            </DropdownMenu.Item>
            <DropdownMenu.Item href={"/collections"}>
              collections
            </DropdownMenu.Item>
            <DropdownMenu.Item href={"/users"}>
              users
            </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          about
          <ChevronDown></ChevronDown>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item href={"/about"}>
            about
          </DropdownMenu.Item>
          <DropdownMenu.Item href={"/about/updates"}>
            updates
          </DropdownMenu.Item>
          <DropdownMenu.Item href={"/about/guidelines"}>
            community guidlines
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <CoverArt
            item={avatarItem}
            altText={avatarItem['release_group_name']}
          ></CoverArt>
          {displayName ?? 'display name'} 
          <ChevronDown></ChevronDown>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item href={`/user/${username}`}>
            profile
          </DropdownMenu.Item>
          <DropdownMenu.Item href={`/user/${username}/collections`}>
            my collections
          </DropdownMenu.Item>
          <DropdownMenu.Item href={`/user/${username}/now-playing-posts`}>
            my posts
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
          <button class="nav">
            about
          </button>
        </a>
        <a href="/welcome">
          <button class="nav">
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
            <DropdownMenu.Item href={"/about/updates"}>
              updates
            </DropdownMenu.Item>
            <DropdownMenu.Item href={"/about/guidelines"}>
              community guidlines
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
          <CoverArt
            item={avatarItem}
            altText={avatarItem['release_group_name']}
          ></CoverArt>
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
          <DropdownMenu.Item href={`/user/${username}/collections`}>
            my collections
          </DropdownMenu.Item>
          <DropdownMenu.Item href={`/user/${username}/now-playing-posts`}>
            my posts
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
          <button class="nav">
            log in/sign up
          </button>
        </a>
      {/if}
    </nav>
  </header>
  <div class="buttons-group">
    <a class="report" target="_blank" href="https://docs.google.com/forms/d/e/1FAIpQLSfKj4FlApgfM-Kc4rYwAxNQslBMS9rk-DdfowMa5qcHlRYhew/viewform?usp=sf_link">
      <button class="standard">report a bug</button>
    </a>
    <a class="report" target="_blank" href="https://forms.gle/27Q7qg6qLWiFnLHv7">
      <button class="standard">feedback and requests</button>
    </a>
  </div>
</div>

  
<style>
  .grid-background {
    display: flex;
    flex-direction: column;
    max-width: 100vw;
    background: var(--freq-grid-dark-background);
  }
  header {
    display: flex;
    flex-direction: row;
    max-width: var(--freq-desktop-width);
    padding: 2vh 2vw;
    margin: 0 auto;
    font-family: "Krona_One", sans-serif;
    color: #8091A3;
    gap: var(--freq-inline-gap);
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
    flex-direction: row;
  }
  nav.narrow {
    display: none
  }
  a.report {
    margin: auto auto var(--freq-spacing-large) auto;
  }
  .buttons-group {
    display: flex;
    max-width: 80%;
    flex-direction: row;
    margin: 0;
  }
  @media screen and (max-width: 770px) {
    header {
      justify-content: center;
    }
    img {
      position: sticky;
      height: 32px; 
      width: auto;
      margin: auto;
    }
    nav.wide {
      display: none;
    }
    nav.narrow {
      display: flex;
      max-width: 100vw;
      gap: var(--freq-inline-gap);
    }
  }
  </style>