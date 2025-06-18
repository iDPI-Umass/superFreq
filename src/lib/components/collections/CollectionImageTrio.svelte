<script lang="ts">
	import CoverArt from '$lib/components/CoverArt.svelte'
    import wave from "$lib/assets/images/logo/freq-wave.svg"

	interface ComponentProps {
		imgUrl?: string
		collection?: App.RowData
		orientation: string
	}

	let { imgUrl, collection, orientation='column' }: ComponentProps = $props()

	let images = $derived( collection ? collection?.image_trio : null)

	let imageOne = $derived(images ? images[0] : null)
	let imageTwo = $derived(images ? images[1] : null)
	let imageThree = $derived(images ? images[2] : null)

	const imgOrientation = {
		'row': [
			'collection-image-trio-row',
			'collection-image-trio-row-first',
			'collection-image-trio-row-second',
			'collection-image-trio-row-third'
		],
		'column': [
			'collection-image-trio-column',
			'collection-image-trio-column-first',
			'collection-image-trio-column-second',
			'collection-image-trio-column-third'
		],
		'diagonal-stack': [
			'collection-image-trio-diagonal-stack',
			'collection-image-trio-diagonal-stack-first',
			'collection-image-trio-diagonal-stack-second',
			'collection-image-trio-diagonal-stack-third'
		]
	} as any

	$effect(() => {
		console.log('images')
		console.log(images)
	})
</script>

<div class={imgOrientation[orientation][0]}>
	<CoverArt
		item={imageOne ?? null}
		imgUrl={imgUrl}
		altText={ imageOne ? `${imageOne['release_group_name']} by ${imageOne['artist_name']}` : 'album cover'}
		imgClass={imgOrientation[orientation][1]}
	></CoverArt>
	<CoverArt
		item={imageTwo ?? null}
		imgUrl={imgUrl}
		altText={ imageTwo ? `${imageTwo['release_group_name']} by ${imageTwo['artist_name']}` : 'album cover'}
		imgClass={imgOrientation[orientation][2]}
	></CoverArt>
	<CoverArt
		item={imageThree ?? null}
		imgUrl={imgUrl}
		altText={ imageThree ? `${imageThree['release_group_name']} by ${imageThree['artist_name']}` : 'album cover'}
		imgClass={imgOrientation[orientation][3]}
	></CoverArt>
</div>
