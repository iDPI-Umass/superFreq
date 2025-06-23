<script lang="ts">
    import wave from '$lib/assets/images/logo/freq-wave.svg';
  
    interface Props {
      src: string;
    }
  
    let { src }: Props = $props();
    
    let loaded = $state(false);
    let failed = $state(false);
    let loading = $state(false);
    let currentLoad: HTMLImageElement | null = null;
  
    $effect(() => {
      loaded = false;
      failed = false;
      loading = false;
  
      if (!src || typeof src !== 'string') {
        failed = true;
        return;
      }
  
      if (currentLoad) {
        currentLoad.onload = null;
        currentLoad.onerror = null;
      }
      
      // initialize a new image
      const img = new Image();
      currentLoad = img;
      loading = true;
  
      img.src = src;
    
      // set loading
      img.onload = () => {
        if (img === currentLoad) {
          loading = false;
          loaded = true;
        }
      };
      
      // set error
      img.onerror = () => {
        if (img === currentLoad) {
          loading = false;
          failed = true;
        }
      };
      
      // clear
      return () => {
        currentLoad = null;
      };
    });
  </script>
  
  {#if loaded}
    <img src={src} alt="Collection" />
  {:else if failed}
    <img src={wave} alt="Not Found" />
  {:else}
    <img src={wave} alt="Loading"/>
  {/if}
  
  <style>
    img {
      width: 4rem;
      object-fit: contain;
    }
  </style>