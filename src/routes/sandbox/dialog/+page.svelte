<script lang="ts">
    import ListModal from '$lib/components/ListModal.svelte'
	import InfiniteScroll from "$lib/components/InfiniteScroll.svelte"
    import Scroller from '$lib/components/Scroller.svelte';

    let showModal = false

    let photos: PhotoListItem[];
	let next: string | null;
	let endpoint: string;

	export function capture() {
		return scroller.capture();
	}

	export function restore(values: any) {
		scroller.restore(values);
	}

	const dispatch = createEventDispatcher();

	let scroller: Scroller;
	let loading = false;



    // import { onMount, onDestroy } from "svelte"
	// let listElement: any

    export let data

	let pageSize = 10;
	$: totalItems = data.users.total;
	$: totalPages = Math.ceil(totalItems / pageSize);
	$: currentPage = (Number($page.url.searchParams.get('skip')) || 0) / pageSize;

    // let items: any = []

    // for (let index = 0; index < 20; index++) {
    //     items = [...items, `item ${index}`];
    // }

    // // Add 20 items.
    // function loadMore() {
    //     for (var index = 0; index < 20; index++) {
    //         items = [...items, `item ${items.length}`];
    //     }
    // }

    // onMount(() => {
    //     if (listElement) {
    //         console.log("listElm is defined");
    //         listElement.addEventListener("scroll", function () {
    //             if (
    //                 listElement.scrollTop + listElement.clientHeight >=
    //                 listElement.scrollHeight
    //             ) {
    //                 loadMore();
    //             }
    //         });
    //     }
    // });
	
</script>


<Scroller
	bind:this={scroller}
	items={data.users}
	on:more={async () => {
		if (loading || !next) return;
		loading = true;

		const response = await fetch(`${endpoint}?start=${next}`);
		const result = await response.json();

		dispatch('loaded', result);

		loading = false;
	}}
>
	<div slot="header" >
		title
	</div>

	<div slot="item"  let:item let:i>

	</div>

	<div slot="empty">
		<slot name="empty" />
	</div>

	<div slot="footer" class="max-w-2xl px-4 mb-8 mx-auto text-right">
		{#if next}
			<a class="text-pink-600" href="{$page.url.pathname}?start={next}">next page</a>
		{/if}
	</div>
</Scroller>

<!-- <ListModal bind:showModal>
    <div slot="header-text">
        test
    </div>
    <div slot="list">
        {#each data.users.users as user }
        <InfiniteScroll
            hasMore={data.products.length}
            threshold={100}
            on:loadMore={() => {currentPage++; fetchData()}} 
        />
    </div>
</ListModal>

<button 
    on:click={() => ( showModal = true )}
    >
    some text
</button> -->

