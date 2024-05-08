<script lang="ts">
  import { DropdownMenu, Avatar } from "bits-ui";
  import ChevronDown from 'lucide-svelte/icons/chevron-down';
  import logo from "$lib/assets/images/logo/freq-logo-dark.png";

  import hats from '$lib/assets/images/hats.jpg'

  // export let session
    export let displayName = "bass"
  //   //let open = false;

    let accountMenuItems = [
		{ url: '/account', text: 'account settings' },
		{ url: '/feed', text: 'feed' },
		{ url: '/collections', text: 'discover' },
		{ url: '/sandbox/toolbar-test', text: 'new collection' }
	]
</script>

<header>
  <a class="logo" href="/">
    <img alt="Freq" src={logo}>
  </a>
  <nav>
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <img src={hats} alt="bass's avatar" />
        {displayName} 
        <ChevronDown></ChevronDown>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
          {#each accountMenuItems as item}
          <a href={item.url}>
            <DropdownMenu.Item>
              {item.text}
            </DropdownMenu.Item>
          </a>
          {/each}
      </DropdownMenu.Content>
  </DropdownMenu.Root>
  </nav>
</header>
  
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
  nav img {
    max-height: 20px;
    margin-right: var(--freq-spacing-small);
  }
  </style>