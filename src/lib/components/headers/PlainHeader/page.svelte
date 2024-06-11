<script lang="ts">
  import { DropdownMenu } from "bits-ui";
  import ChevronDown from 'lucide-svelte/icons/chevron-down';
  import logo from "$lib/assets/images/logo/freq-logo-dark.svg";

  import hats from '$lib/assets/images/hats.jpg'


  export let displayName: string
  export let avatarUrl: string
  export let username: string

  let accountMenuItems = [
    { url: `/${username}`, text: 'profile' },
    { url: '/account', text: 'account settings' },
    { url: `/api/auth/signout`, text: 'sign out'}
	]

</script>

<div class="grid-background">
  <header>
    <a class="logo" href="/">
      <img alt="Freq" src={logo} />
    </a>
    <nav>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <img src={avatarUrl} alt="{displayName}'s avatar" />
          {displayName} 
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