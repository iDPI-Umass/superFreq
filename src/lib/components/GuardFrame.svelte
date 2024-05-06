<script>
  import Spinner from "$lib/components/primitives/Spinner.svelte";
  import { guard } from "$lib/helpers/guard";  
</script>


{#await guard()}
  <Spinner></Spinner>
{:then}
  <slot></slot>
{:catch}
  <p>There was a problem with your login.</p>
{/await}