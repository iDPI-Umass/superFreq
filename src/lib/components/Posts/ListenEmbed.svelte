<script lang="ts">
    export let embedInfo: App.Embed
    const url = embedInfo.listen_url as string
    const id = embedInfo.id
    const source = embedInfo.source
    const title = embedInfo.title
    const artist = embedInfo.artist
</script>


{#if source == 'bandcamp'}
    <iframe style="border: 0; width: 100%; height: 42px;" src="https://bandcamp.com/EmbeddedPlayer/{id}/size=small/bgcol=333333/linkcol=ffffff/transparent=true/" title="Bandcamp player" seamless><a href={url}>{title} by {artist}</a></iframe>
{:else if source == 'soundcloud'}
    <iframe width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/{id}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true" title="Soundcloud player"></iframe>
{:else if source == 'youtube'}
    <iframe width="100%" height="315" src="https://www.youtube.com/embed/{id}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
{:else if source == 'mixcloud'}
    <iframe width="100%" height="120" src="https://player-widget.mixcloud.com/widget/iframe/?hide_cover=1&feed={id}" frameborder="0" title="Mixcloud player" ></iframe>
{/if}