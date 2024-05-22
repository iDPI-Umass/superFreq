<script lang="ts">
    import GridListDND from '$lib/components/GridList.svelte'

    import "$lib/styles/media-grid-list.css"
    import "$lib/styles/metadata-formatting.css"

    import {flip} from "svelte/animate";
    import {afterUpdate} from "svelte";
    import {dndzone, dragHandle} from "svelte-dnd-action";

    const flipDurationMs = 300;

    function handleSort(e) {
        items = e.detail.items;
    }

	function handleFinalize(e) {
		const {items:newItems} = e.detail;
        items = newItems
        collectionContents = newItems
		for (const item of newItems) {
            console.log(item.id, item["release_groups"]["release_group_name"])
		}
	}

    function updateIds(collectionContents) {
        for (const [index, item] of collectionContents.entries()) {
			item.id = index + 1
            console.log(item.id, item["release_groups"]["release_group_name"])
		}
        console.log(collectionContents)
    }

    // delete item from collection editor
	function deleteItem(item) {
		items = items.filter(i => i != item);
        console.log(items)
		for (const i of items) {
			i["id"] = items.indexOf(i) + 1;
            console.log(i, i["id"])
		}
        console.log(items)
	}


    let collectionReturned = true
    let collectionType = "release_groups"
    let gridListSelect = "list"

    let collectionContents = [
            {
                "release_groups": {
                    "img_url": "https://i.discogs.com/cEMuafypgcPrLdbG0E24kSTeFbluB7-B0i3TGwp2Klc/rs:fit/g:sm/q:90/h:590/w:590/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTI1NjI0/MDMtMTU0MDk3ODYw/Ny04MzczLmpwZWc.jpeg",
                    "release_group_name": "Milestones",
                    "release_date": "1958"
                },
                "artists": {
                    "artist_name": "Miles Davis"
                },
                "id": 1
            },
            {
                "release_groups": {
                    "img_url": "https://i.discogs.com/wjjMk1xCKdaPbsUbaXWzHBNi3K-fmt3CYkQGqt0c_Z8/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTYyNzYx/ODMtMTY3NzAwMzM5/Ni0yMDQ1LmpwZWc.jpeg",
                    "release_group_name": "Kind of Blue",
                    "release_date": "1959"
                },
                "artists": {
                    "artist_name": "Miles Davis"
                },
                "id": 2
            },
            {
                "release_groups": {
                    "img_url": "https://i.discogs.com/qCFr5dP7C8sLVZ3XVt1B-vCERsJ0wJ0JkrYsuihC4w8/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTE5MTQz/NTMtMTI1MjEzODI1/NC5qcGVn.jpeg",
                    "release_group_name": "Sketches of Spain",
                    "release_date": "1960"
                },
                "artists": {
                    "artist_name": "Miles Davis"
                },
                "id": 3
            },
            {
                "release_groups": {
                    "img_url": "https://coverartarchive.org/release-group/3c17dc33-ff39-3ac0-a190-847f42e4d03c/front",
                    "release_group_name": "Sorceror",
                    "release_date": "1967"
                },
                "artists": {
                    "artist_name": "Miles Davis"
                },
                "id": 4
            }
        ]

    let items = collectionContents

    const format = {
        "grid": ["media-grid", "media-grid-item"],
        "list": ["media-list", "media-list-item"]
    }

function log() {
    console.log(items)
}

</script>

<div class="list-layout">
    <ul use:dndzone={{items, flipDurationMs}} on:consider={handleSort} on:finalize={handleFinalize}>
        {#each items as item, index(item.id)}
            <li animate:flip={{duration:flipDurationMs}} class="dnd-wrapper">
                <div class="list-item" >
                    <p>{index +1}</p>
                    <img src={item["release_groups"]["img_url"]} alt={item["release_groups"]["release_group_name"]} />
                    <div class="metadata-blurb">
                        <h2>{item["release_groups"]["release_group_name"]}</h2>
                        <p>{item["artists"]["artist_name"]}</p>
                    </div>
                    <button on:click|preventDefault={() => deleteItem(item)}>remove</button>
                </div>
            </li>
        {/each}
    </ul>
    <button on:click|preventDefault={() => updateIds(collectionContents)}>save</button>
</div>

<style>
	ul {
        list-style: none;
		width: 50em;
		padding: 1em;
        border: 1px solid white;
        overflow:hidden;
	}
	.dnd-wrapper {
		height: 10em;
        width: 30em;
		text-align: center;
		border: 1px solid black;
		margin: 0.2em;
		padding: 0.3em;
	}
    .list-layout {
        display: flex;
        flex-direction: column;
        gap: var(--freq-grid-gap);
    }
    .list-item {
        display: flex;
        flex-direction: row;
        border: 1px solid white;
        margin: 3px;
	    max-height: 100px;
    }

    .list-item img {
        max-height: inherit;
    }
</style>