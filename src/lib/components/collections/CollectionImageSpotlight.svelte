<script lang="ts">
	import CoverArt from '$lib/components/CoverArt.svelte'

	interface ComponentProps {
		imgUrl?: string
		imgUrls?: string[]
	}

	let { imgUrl, imgUrls }: ComponentProps = $props()

	let firstImage = $derived(imgUrls ? imgUrls[0] : null)
	let secondImage = $derived(imgUrls ? imgUrls[1] : null)
	let thirdImage = $derived(imgUrls ? imgUrls[2] : null)
</script>

<div class="spotlight-image-trio">
		<CoverArt
			imgUrl={imgUrl ?? firstImage ?? null}
			altText="first album cover"
			imgClass="spotlight-image-trio-first"
		></CoverArt>
		<CoverArt
			imgUrl={imgUrl ?? secondImage ?? null}
			altText="second album cover"
			imgClass="spotlight-image-trio-second"
		></CoverArt>
		<CoverArt
			imgUrl={imgUrl ?? thirdImage ?? null}
			altText="third album cover"
			imgClass="spotlight-image-trio-third"
		></CoverArt>
</div>

<style>
    .spotlight-image-trio {
		display: flex;
		flex-direction: row;
		width: 200px;
		align-items: end;
		justify-content: center;
		background-color: var(--freq-color-info-box-background);
		position: relative;
	}
</style>