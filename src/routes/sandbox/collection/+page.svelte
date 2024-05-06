<script lang="ts">
    import { Toolbar, Button } from "bits-ui";
    import LayoutGrid from 'lucide-svelte/icons/layout-grid';
    import AlignJustify from 'lucide-svelte/icons/align-justify';
    import "$lib/styles/media-grid-list.css"
    // import type { PageData } from './$types';
	
	// export let data: PageData;
    // let { collectionData } = data

    // console.log(collectionData)
    let collectionData =  {
        "title": "Albums Collection Design",
        "categories": {
            "type": "albums"
        }
        ,
        "type": "release_groups",
        "username": "sug",
        "display_name": "sug",
        "updatedAt": "April 29th, 2024",
        "collectionInfo": {
            "description_text": "here is some descriptive text about this collection"
        },
        "collectionReturned": true,
        "collectionContents": [
            {
                "release_groups": {
                    "img_url": "https://i.discogs.com/cEMuafypgcPrLdbG0E24kSTeFbluB7-B0i3TGwp2Klc/rs:fit/g:sm/q:90/h:590/w:590/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTI1NjI0/MDMtMTU0MDk3ODYw/Ny04MzczLmpwZWc.jpeg",
                    "release_group_name": "Milestones",
                    "release_date": "1958"
                },
                "artists": {
                    "artist_name": "Miles Davis"
                }
            },
            {
                "release_groups": {
                    "img_url": "https://i.discogs.com/wjjMk1xCKdaPbsUbaXWzHBNi3K-fmt3CYkQGqt0c_Z8/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTYyNzYx/ODMtMTY3NzAwMzM5/Ni0yMDQ1LmpwZWc.jpeg",
                    "release_group_name": "Kind of Blue",
                    "release_date": "1959"
                },
                "artists": {
                    "artist_name": "Miles Davis"
                }
            },
            {
                "release_groups": {
                    "img_url": "https://i.discogs.com/qCFr5dP7C8sLVZ3XVt1B-vCERsJ0wJ0JkrYsuihC4w8/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTE5MTQz/NTMtMTI1MjEzODI1/NC5qcGVn.jpeg",
                    "release_group_name": "Sketches of Spain",
                    "release_date": "1960"
                },
                "artists": {
                    "artist_name": "Miles Davis"
                }
            },
            {
                "release_groups": {
                    "img_url": "https://coverartarchive.org/release-group/3c17dc33-ff39-3ac0-a190-847f42e4d03c/front",
                    "release_group_name": "Sorceror",
                    "release_date": "1967"
                },
                "artists": {
                    "artist_name": "Miles Davis"
                }
            },
            {
                "release_groups": {
                    "img_url": "https://coverartarchive.org/release-group/eb84987d-15bd-3f69-bcd0-a0804c9d1130/front",
                    "release_group_name": "Nefertiti",
                    "release_date": "1968"
                },
                "artists": {
                    "artist_name": "Miles Davis"
                }
            },
            {
                "release_groups": {
                    "img_url": "https://coverartarchive.org/release-group/82fd3ab5-0fc9-3a36-8832-65afaf05c2fe/front",
                    "release_group_name": "Filles de Kilimanjaro",
                    "release_date": "1969"
                },
                "artists": {
                    "artist_name": "Miles Davis"
                }
            },
            {
                "release_groups": {
                    "img_url": "https://coverartarchive.org/release-group/7d0a9612-7636-34fe-84d9-445c8df9c0f3/front",
                    "release_group_name": "In a Silent Way",
                    "release_date": "1969"
                },
                "artists": {
                    "artist_name": "Miles Davis"
                }
            },
            {
                "release_groups": {
                    "img_url": "https://coverartarchive.org/release-group/a9e30282-5b37-3f92-b897-b9659a1a312b/front",
                    "release_group_name": "Bitches Brew",
                    "release_date": "1970"
                },
                "artists": {
                    "artist_name": "Miles Davis"
                }
            },
            {
                "release_groups": {
                    "img_url": "https://coverartarchive.org/release-group/d8ced714-bc46-3657-9076-8577c9d50231/front",
                    "release_group_name": "On the Corner",
                    "release_date": "1972"
                },
                "artists": {
                    "artist_name": "Miles Davis"
                }
            },
            {
                "release_groups": {
                    "img_url": "https://coverartarchive.org/release-group/7b44726d-0077-39c0-8525-129e59c8e496/front",
                    "release_group_name": "Big Fun",
                    "release_date": "1974"
                },
                "artists": {
                    "artist_name": "Miles Davis"
                }
            },
            {
                "release_groups": {
                    "img_url": "https://coverartarchive.org/release-group/49f122e4-8eef-3c69-93d4-a4369dc408d8/front",
                    "release_group_name": "Get Up With It",
                    "release_date": "1974"
                },
                "artists": {
                    "artist_name": "Miles Davis"
                }
            },
            {
                "release_groups": {
                    "img_url": "https://coverartarchive.org/release-group/57b856a7-e33c-35f3-8268-a7fb318e98b0/front",
                    "release_group_name": "Sextant",
                    "release_date": "1973"
                },
                "artists": {
                    "artist_name": "Herbie Hancock"
                }
            },
            {
                "release_groups": {
                    "img_url": "https://coverartarchive.org/release-group/322f18bb-5491-38e9-9044-c0a468651eec/front",
                    "release_group_name": "Head Hunters",
                    "release_date": "1973"
                },
                "artists": {
                    "artist_name": "Herbie Hancock"
                }
            },
            {
                "release_groups": {
                    "img_url": "https://coverartarchive.org/release-group/e4bd9276-84c9-3c90-8c90-7797f487fc8d/front",
                    "release_group_name": "Thrust",
                    "release_date": "1974"
                },
                "artists": {
                    "artist_name": "Herbie Hancock"
                }
            },
            {
                "release_groups": {
                    "img_url": "https://coverartarchive.org/release-group/ff70f2eb-72a3-36e3-98c0-cfcbdf10f949/front",
                    "release_group_name": "Sunlight",
                    "release_date": "1978"
                },
                "artists": {
                    "artist_name": "Herbie Hancock"
                }
            },
            {
                "release_groups": {
                    "img_url": "https://coverartarchive.org/release-group/56859652-9ec0-312f-bc84-2e2f15fcf39e/front",
                    "release_group_name": "Dis Is Da Drum",
                    "release_date": "1994"
                },
                "artists": {
                    "artist_name": "Herbie Hancock"
                }
            }
        ]
    }

    let { title, categories, type, username, display_name, updatedAt, collectionInfo, collectionReturned, collectionContents } = collectionData

    const format = {
        "grid": ["media-grid", "media-grid-item"],
        "list": ["media-list", "media-list-item"]
    }

    let formatSelect = "grid"
    let testValue: string | undefined

    console.log(testValue)
</script>

<body>
    <div class="collection-container">
        <div class="collection-info">
            <div class="collection-metadata">
                <div class="collection-title-follow-top-row">
                    <h1>{title}</h1>
                    <Button.Root>follow</Button.Root>
                                    <!-- {#if session && (sessionUserId != collectionInfo["owner_id"])}
                    <button class="purple-border-button" on:click|preventDefault={followButton} disabled={!socialResponseStatus}>
                        {#if ( followButtonStatus == true )}
                            unfollow
                        {:else if ( followButtonStatus == false )}
                            + follow
                        {/if}
                    </button>
                {/if} -->
                </div>
                <p class="metadata-attribution-text">
                    Collection of {categories.type} by 
                    <a href="/user/{username}">
                        {display_name}
                    </a>
                </p>
                <p class="metadata-date-text">Last updated on {updatedAt}</p>
            </div>


            <p>{collectionInfo["description_text"]}</p>
        </div>
        <div class="sort">
            <p> sorting options </p>
            <Toolbar.Root>
                <Toolbar.Group
                    bind:value={formatSelect}
                    type="single"
                >
                    <Toolbar.GroupItem
                        aria-label="grid"
                        value="grid"
                    >
                        <LayoutGrid></LayoutGrid>
                    </Toolbar.GroupItem>
                    <Toolbar.GroupItem
                    aria-label="list"
                    value="list"
                    >
                        <AlignJustify></AlignJustify>
                    </Toolbar.GroupItem>
                </Toolbar.Group>
            </Toolbar.Root>
            <p>{formatSelect}</p>
        </div>
        {#if collectionReturned}
            {#if type == "artists"}
                <div class={format[formatSelect][0]}>
                    {#each collectionContents as contentItem}
                        <div class={format[formatSelect][1]}>
                            <p>{contentItem["artists"]["artist_name"]}</p>
                        </div>
                    {/each}
                </div>
            {:else if type == "release_groups"}
                <div class={format[formatSelect][0]}>
                    {#each collectionContents as contentItem}
                    <div class={format[formatSelect][1]}>
                        <!-- <div class="media-item"> -->
                            <img src={contentItem["release_groups"]["img_url"]} alt={contentItem["release_groups"]["release_group_name"]} />
                            <h2>{contentItem["release_groups"]["release_group_name"]}</h2>
                            <p>{contentItem["artists"]["artist_name"]}</p>
                        <!-- </div> -->
                    </div>
                    {/each}
                </div>
            {:else if type == "recordings"}
                <div class="media-grid">
                    {#each collectionContents as contentItem}
                    <div class="media-grid-item">
                        <!-- <div class="media-item"> -->
                            <img src={contentItem["release_groups"]["img_url"]}  alt={contentItem["recordings"]["recording_name"]} />
                            <p>{contentItem["recordings"]["recording_name"]}</p>
                        <!-- </div> -->
                    </div>
                    {/each}
                </div>
            {/if}
        {/if}
    </div>
</body>
<style>
    .collection-container {
        max-width: var(--freq-max-width-primary);
        margin: 3vh 3vw;
        border: 1px solid var(--freq-color-background-badge);
        border-top: 3px double var(--freq-color-background-badge);
    }
    .collection-info {
        display: flex;
        flex-direction: column;
        padding: var(--freq-width-spacer-half);
    }
    .collection-metadata * {
        margin: var(--freq-spacing-x-small) 0;
    }
    .collection-title-follow-top-row {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-right: 2vw;
    }
    .sort {
        width: inherit;
        border-bottom: 1px solid var(--freq-color-background-badge);
        padding: 0 var(--freq-width-spacer-half);
        border-top: 1px double var(--freq-color-background-badge);
        border-bottom: 1px solid var(--freq-color-background-badge);
    }
</style>