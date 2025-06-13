<script lang="ts">
	import CoverArt from '$lib/components/CoverArt.svelte'

	interface ComponentProps {
		imgUrl?: string
		imgUrls?: string[]
		orientation: string
	}

	let { imgUrl, imgUrls, orientation='column' }: ComponentProps = $props()

	let firstImage = $derived(imgUrls ? imgUrls[0] : null)
	let secondImage = $derived(imgUrls ? imgUrls[1] : null)
	let thirdImage = $derived(imgUrls ? imgUrls[2] : null)

	const imgOrientation = {
		'row': [
			'spotlight-image-trio-row',
			'spotlight-image-trio-row-first',
			'spotlight-image-trio-row-second',
			'spotlight-image-trio-row-third'
		],
		'column': [
			'spotlight-image-trio-column',
			'spotlight-image-trio-column-first',
			'spotlight-image-trio-column-second',
			'spotlight-image-trio-column-third'
		]
	} as any
</script>

<div class={imgOrientation[orientation][0]}>
		<CoverArt
			imgUrl={imgUrl ?? firstImage ?? null}
			altText="first album cover"
			imgClass={imgOrientation[orientation][1]}
		></CoverArt>
		<CoverArt
			imgUrl={imgUrl ?? secondImage ?? null}
			altText="second album cover"
			imgClass={imgOrientation[orientation][2]}
		></CoverArt>
		<CoverArt
			imgUrl={imgUrl ?? thirdImage ?? null}
			altText="third album cover"
			imgClass={imgOrientation[orientation][3]}
		></CoverArt>
</div>

<style>
    .spotlight-image-trio-row {
		position: relative;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: end;
		/* position: relative; */
	}
	.spotlight-image-trio-column {
		position: relative;
		display: flex;
		flex-direction: column;
		padding-top: 30px;
		align-items: center;
		justify-content: center;
	}
</style>