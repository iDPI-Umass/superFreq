<script lang="ts">
	interface ComponentProps {
		embedInfo: App.Embed;
	}
	let { embedInfo }: ComponentProps = $props();
	let { id, source } = $derived(embedInfo);
</script>

{#if source == 'bandcamp'}
	<iframe
		style="border: 0; width: 100%; height: 42px;"
		src="https://bandcamp.com/EmbeddedPlayer/{id}/size=small/bgcol=333333/linkcol=ffffff/transparent=true/"
		title="Bandcamp player"
		seamless
		loading="lazy"
	></iframe>
{:else if source == 'soundcloud'}
	<iframe
		width="100%"
		height="166"
		scrolling="no"
		frameborder="no"
		allow="autoplay"
		src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/{id}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"
		title="Soundcloud player"
		loading="lazy"
	></iframe>
{:else if source == 'youtube'}
	<div class="youtube">
		<iframe
			width="100%"
			src="https://www.youtube.com/embed/{id}"
			title="YouTube video player"
			frameborder="0"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
			referrerpolicy="strict-origin-when-cross-origin"
			allowfullscreen
			loading="lazy"
		></iframe>
	</div>
{:else if source == 'mixcloud'}
	<iframe
		width="100%"
		height="120"
		src="https://player-widget.mixcloud.com/widget/iframe/?hide_cover=1&feed={id}"
		frameborder="0"
		title="Mixcloud player"
		loading="lazy"
	></iframe>
{/if}

<style>
	.youtube {
		position: relative;
		overflow: hidden;
		width: 100%;
		padding-top: 56.25%;
	}
	.youtube iframe {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		width: 100%;
		height: 100%;
	}
</style>
