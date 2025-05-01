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

<div class="spotlight-image-cover">
	{#if loaded}
		<img {src} alt="Collection" class="spotlight-image" />
		<img {src} alt="Collection" class="spotlight-image-2" />
		<img {src} alt="Collection" class="spotlight-image-3" />
	{:else if failed}
		<img src={wave} alt="Not Found" class="spotlight-image" />
		<img src={wave} alt="Not Found" class="spotlight-image-2" />
		<img src={wave} alt="Not Found" class="spotlight-image-3" />
	{:else}
		<img src={wave} alt="Loading" class="spotlight-image" />
		<img src={wave} alt="Loading" class="spotlight-image-2" />
		<img src={wave} alt="Loading" class="spotlight-image-3" />
	{/if}
</div>

<style>
	.spotlight-image-3 {
		max-width: 6rem;
		object-fit: cover;
		position: absolute;
		bottom: 0;
	}

	.spotlight-image-2 {
		max-width: 5rem;
		object-fit: cover;
		position: absolute;
		bottom: 2rem;
	}

	.spotlight-image {
		max-width: 4rem;
		object-fit: cover;
		position: absolute;
		bottom: 4rem;
	}

    .spotlight-image-cover {
		display: flex;
		height: 50%;
		align-items: end;
		justify-content: center;
		background-color: var(--freq-color-info-box-background);
		position: relative;
	}
</style>
