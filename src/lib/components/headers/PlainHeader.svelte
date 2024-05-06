<script lang="ts">
  import { DropdownMenu } from "bits-ui";
</script>

<header>
    <nav>
      <a class="logo" href="/">
        <img src="/images/freq-logo-dark.svg" alt="Main logo for the Freq application">
      </a>
    </nav>
  </header>
  
  <style>
    header {
      flex-direction: row;
      flex-wrap: nowrap;
      background: var(--freq-color-panel);
      color: var(--freq-color-text);
      border-bottom: var(--freq-border-panel);
      height: 4.625rem;
    }
  
  
    header > nav {
      flex: 1 1 100%;
      margin: 0;
      display: flex;
      flex-direction: row;
      align-items: center;
    }
  
    header > nav > .logo {
      font-family: var(--sl-font-sans);
      font-size: var(--sl-font-size-2x-large);
      text-decoration: none;
      color: initial;
      padding: 1rem; 
      flex: 0 0 auto;
    }
  
  </style>