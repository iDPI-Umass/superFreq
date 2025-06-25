<script lang="ts">
  import { page } from '$app/state'
  import Dropdown from '$lib/components/menus/ReuseableDropdownMenu.svelte'
  import SiteSearch from 'src/lib/components/Search/SiteSearch.svelte';

  import CoverArt from "src/lib/components/layout/CoverArt.svelte";
  import { searchResults } from "$lib/resources/states.svelte"

  interface ComponentProps {
    sessionUserId: string | null
    username: string
    displayName: string
    avatarItem: App.StringLookupObject
    logo: any
  }

  let {
    sessionUserId,
    username,
    displayName,
    avatarItem, 
    logo
  }: ComponentProps = $props()

  const thisUrl = page.url

</script>

<!-- <svelte:options runes={true} /> -->
<!-- <svelte:head>
  <title>Freq</title>
</svelte:head> -->

<div class="grid-background">
  <header>
    <a class="logo-desktop" href="/">
      <img alt="Freq" src={logo} />
    </a>
    <nav class="wide">
      {#if sessionUserId}
      <a href="/feed">
        <button class="nav">
          feed
        </button>
      </a>
      <a href="/posts/now-playing/new">
        <button class="nav">
          post
        </button>
      </a>
      <Dropdown
        buttonText="collections"
        screenSize="desktop"
        items={[
          {
            'text': 'discover',
            'url': '/collections'
          },
          {
            'text': 'create',
            'url': '/collection/new'
          }
        ]}
      ></Dropdown>
      <SiteSearch
          searchPlaceholder="search"
          formAction="search"
          mode="redirect"
          screenSize="desktop"
      ></SiteSearch>
      <!-- <Dropdown
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
      ></Dropdown> -->
      <Dropdown
        avatar={avatarItem}
        buttonText={displayName ?? 'display name'} 
        screenSize="desktop"
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
            'text': 'about Freq',
            'url': '/about'
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
          screenSize="desktop"
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
        <div class="nav-row">
          <a class="logo" href="/">
            <img class="logo" alt="Freq" src={logo} />
          </a>
          <SiteSearch
            searchPlaceholder="search"
            formAction="search"
            mode="redirect"
            screenSize="mobile"
          ></SiteSearch>
        </div>
        <div class="nav-row">
          <a href="/feed">
            <button class="nav">
              feed
            </button>
          </a>
          <a href="/posts/now-playing/new">
            <button class="nav">
              post
            </button>
          </a>
          <Dropdown
            buttonText="collections"
            screenSize="mobile"
            items={[
              {
                'text': 'discover',
                'url': '/collections'
              },
              {
                'text': 'create',
                'url': '/collection/new'
              }
            ]}
          ></Dropdown>
          <Dropdown
            avatar={avatarItem}
            buttonText={displayName ?? 'display name'} 
            screenSize="mobile"
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
        </div>
      {:else}
      <div class="nav-row">
        <a class="logo" href="/">
          <img class="logo" alt="Freq" src={logo} />
        </a>
        <Dropdown
          buttonText="explore"
          screenSize="mobile"
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
        </div>
      {/if}
    </nav>
  </header>
  <div class="buttons-group">
    <a class="report" target="_blank" href="/report-bug?path={thisUrl}">
      <button class="standard">report a bug</button>
    </a>
    <!-- <a class="report" target="_blank" href="https://forms.gle/27Q7qg6qLWiFnLHv7">
      <button class="standard">feedback and requests</button>
    </a> -->
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
  nav {
    display: flex;
    flex-direction: row;
  }
  nav.wide {
    height: 50px;
  }
  nav.wide * {
    font-size: var(--freq-font-size-);
  }
  nav.narrow {
    display: none
  }
  .nav-row {
    display: flex;
    flex-direction: row;
    width: inherit;
    align-items: center;
    justify-content: space-between;
  }
  .nav-row button {
    font-size: var(--freq-font-size-2x-small);
  }
  a, a button {
    cursor: pointer;
  }
  .logo-desktop img {
    /* position: sticky; */
    /* height: 100%;  */
    height: 46px;
    /* width: 160px; */
    margin: auto 1vw;
    cursor: pointer;
    /* width: 100%; */
  }
  a.report {
    margin: auto;
  }
  .buttons-group {
    display: flex;
    max-width: 80%;
    flex-flow: row wrap;
    margin: 0 auto var(--freq-spacing-large) auto;
  }
  .buttons-group button {
    margin: 0 auto;
  }
  @media screen and (max-width: 770px) {
    header {
      justify-content: center;
    }
    a.logo-desktop {
      display: none;
    }
    .logo img {
      max-height: 30px;
      height: 30px;
      width: auto;
      margin: auto 1vw;
     }
    nav.wide {
      display: none;
    }
    nav.narrow {
      display: flex;
      flex-direction: column;
      width: 100%;
      gap: var(--freq-inline-gap);
    }
  }
  </style>