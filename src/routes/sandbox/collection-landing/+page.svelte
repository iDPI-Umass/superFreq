<script lang="ts">
    import CollectionImageSpotlight from "src/lib/components/collections/CollectionImagoTrio.svelte"

    const items = [
        {
            'imgUrl': 'https://ia601609.us.archive.org/19/items/mbid-f9739d2c-9b44-4ac1-a0e7-327a23d741ad/mbid-f9739d2c-9b44-4ac1-a0e7-327a23d741ad-2051756196.jpg',
            'title': 'title',
            'user': 'user',
            'lastUpdated': '2d ago'
        },
                {
            'imgUrl': 'https://ia601609.us.archive.org/19/items/mbid-f9739d2c-9b44-4ac1-a0e7-327a23d741ad/mbid-f9739d2c-9b44-4ac1-a0e7-327a23d741ad-2051756196.jpg',
            'title': 'title',
            'user': 'user',
            'lastUpdated': '2d ago'
        },
                {
            'imgUrl': 'https://ia601609.us.archive.org/19/items/mbid-f9739d2c-9b44-4ac1-a0e7-327a23d741ad/mbid-f9739d2c-9b44-4ac1-a0e7-327a23d741ad-2051756196.jpg',
            'title': 'title',
            'user': 'user',
            'lastUpdated': '2d ago'
        },        {
            'imgUrl': 'https://ia601609.us.archive.org/19/items/mbid-f9739d2c-9b44-4ac1-a0e7-327a23d741ad/mbid-f9739d2c-9b44-4ac1-a0e7-327a23d741ad-2051756196.jpg',
            'title': 'title',
            'user': 'user',
            'lastUpdated': '2d ago'
        },        {
            'imgUrl': 'https://ia601609.us.archive.org/19/items/mbid-f9739d2c-9b44-4ac1-a0e7-327a23d741ad/mbid-f9739d2c-9b44-4ac1-a0e7-327a23d741ad-2051756196.jpg',
            'title': 'title',
            'user': 'user',
            'lastUpdated': '2d ago'
        },        {
            'imgUrl': 'https://ia601609.us.archive.org/19/items/mbid-f9739d2c-9b44-4ac1-a0e7-327a23d741ad/mbid-f9739d2c-9b44-4ac1-a0e7-327a23d741ad-2051756196.jpg',
            'title': 'title',
            'user': 'user',
            'lastUpdated': '2d ago'
        }
        ] as App.RowData[]
</script>

{#snippet itemDisplay(item: App.RowData)}
    <div class="spotlight-item">
        <CollectionImageSpotlight
            imgUrl={item.imgUrl}
            orientation="column"
        ></CollectionImageSpotlight>
        <span>{item.title}</span>
        <span>{item.user}</span>
        <span>{item.lastUpdated}</span>
    </div>
{/snippet}

<div class="panel">
    <div class="spotlight-row">
        {#each items as item}
            {@render itemDisplay(item)}
        {/each}
    </div>
</div>

<style>
    .spotlight-row {
        display: flex;
        flex-direction: row;
        max-width: 90vw;
    }
    .spotlight-item {
        width: 20%;
        display: flex;
        margin-top: 0;
        padding-top: 0;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
</style>