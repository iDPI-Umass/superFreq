<script lang="ts">
  import { page } from '$app/state'
  import { DropdownMenu } from "bits-ui"
  import Dropdown from '$lib/components/menus/ReuseableDropdownMenu.svelte'
  import ChevronDown from '@lucide/svelte/icons/chevron-down';
  import logo from "$lib/assets/images/logo/freq-logo-dark.svg"

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

  const thisUrl = page.url
</script>

<svelte:options runes={true} />
<svelte:head>
  <title>Freq</title>
</svelte:head>

<div class="grid-background">
  <header>
    <a class="logo" href="/">
      <img class="logo" alt="Freq" src={logo} />
    </a>
    <nav class="wide">
      {#if sessionUserId}
      <a href="/feed">
        <button class="nav">
          feed
        </button>
      </a>
      <Dropdown
        buttonText="create"
        items={[
          {
            'text': 'new post',
            'url': '/posts/now-playing/new'
          },
          {
            'text': 'new collection',
            'url': '/collection/new'
          },
        ]}
      ></Dropdown>
      <Dropdown
        buttonText="discover"
        items={[
          {
            'text': 'collections',
            'url': '/collections'
          },
          {
            'text': 'users',
            'url': '/users'
          },
        ]}
      ></Dropdown>
      <Dropdown
        buttonText="about"
        items={[
          {
            'text': 'about',
            'url': '/about'
          },
          {
            'text': 'updates',
            'url': '/about/updates'
          },
          {
            'text': 'community guidelines',
            'url': '/about/guidelines'
          },
        ]}
      ></Dropdown>
      <Dropdown
        avatar={avatarItem}
        buttonText={displayName ?? 'display name'} 
        items={[
          {
            'text': 'profile',
            'url': `/user/${username}`
          },
          {
            'text': 'my collections',
            'url': `/user/${username}/collections`
          },
          {
            'text': 'my posts',
            'url': `/user/${username}/now-playing-posts`
          },
          {
            'text': 'account',
            'url': `/account`
          },
          {
            'text': 'sign out',
            'url': `/sign-out`
          },
        ]}
      ></Dropdown>
      {:else}
        <Dropdown
          buttonText="explore"
          items={[
            {
              'text': 'collections',
              'url': '/collections'
            },
            {
              'text': 'posts',
              'url': '/posts'
            },
          ]}
        ></Dropdown>
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
        <Dropdown
          buttonText="explore"
          items={[
            {
              'text': 'feed',
              'url': `/feed`
            },
            {
              'text': 'new post',
              'url': `/posts/now-playing/new`
            },
            {
              'text': 'new collection',
              'url': `/collection/new`
            },
            {
              'text': 'about',
              'url': `/about`
            },
            {
              'text': 'updates',
              'url': `/about/updates`
            },
            {
              'text': 'discover collections',
              'url': `/collections`
            },
            {
              'text': 'discover users',
              'url': `/users`
            },
          ]}
        ></Dropdown>
        <Dropdown
          avatar={avatarItem}
          buttonText={displayName ?? 'display name'} 
          items={[
            {
              'text': 'profile',
              'url': `/user/${username}`
            },
            {
              'text': 'my collections',
              'url': `/user/${username}/collections`
            },
            {
              'text': 'my posts',
              'url': `/user/${username}/now-playing-posts`
            },
            {
              'text': 'account',
              'url': `/account`
            },
            {
              'text': 'sign out',
              'url': `/sign-out`
            },
          ]}
        ></Dropdown>
      {:else}
        <Dropdown
          buttonText="explore"
          items={[
            {
              'text': 'about',
              'url': '/about'
            },
            {
              'text': 'collections',
              'url': '/collections'
            },
            {
              'text': 'posts',
              'url': '/posts'
            },
          ]}
        ></Dropdown>
        <a href="/welcome">
          <button class="nav">
            log in/sign up
          </button>
        </a>
      {/if}
    </nav>
  </header>
  <div class="buttons-group">
    <a class="report" target="_blank" href="/report-bug?path={thisUrl}">
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
  img.logo {
    cursor: pointer;
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
    margin: 0 auto;
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