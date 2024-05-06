<!-- src/routes/account/+page.svelte -->
<script lang="ts">
	import { enhance, applyAction } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { PageData, ActionData } from './$types';
	import type { ActionResult } from '@sveltejs/kit';

	export let data: PageData;
	export let form: ActionData;

	let { session, supabase, profile } = data;
	$: ({ session, supabase, profile } = data);

	let profileForm: HTMLFormElement
	let loading = false
	let complete = false
	let displayName: string = profile?.display_name ?? ''
	let username: string = profile?.username ?? ''
	let website: string = profile?.website ?? ''
	let avatarUrl: string = profile?.avatar_url ?? ''


	/*
	Functions to call MusicBrainz and Cover Art Archive databases
	*/

	//headers for fetch request
	const init = {
		method: "GET"
	};

	// search MusicBrainz using form info
	let mbData = "";
	let query = "";
	let searchComplete: boolean;
	async function mbSearch() {
		let apiString = "https://musicbrainz.org/ws/2/";
		apiString = apiString.concat("release-group");
        const endpoint = new URL (apiString);
            
		endpoint.searchParams.set("fmt", "json");
        endpoint.searchParams.set("query", `${query}`)
		endpoint.searchParams.set("limit", "10");

        const res = await fetch(endpoint);
        const searchResults = await res.json();
		mbData = searchResults["release-groups"];

		searchComplete =  true;
	
		for ( const result of mbData ) {
			const mbid = result["id"];
			const { coverArtUrl, status} = await getCoverArt ( mbid );
			if (status != 404){
				result["coverArtUrl"] = coverArtUrl;
			}
		}

		return {
			mbData, searchComplete
		}
    };

	// API call to Cover Art Archive using releaseMbid returned by getLabel()
	let gotImage;
	async function getCoverArt ( release_group_mbid ) {
		const endpoint = `http://coverartarchive.org/release-group/${release_group_mbid}/front`;
		const res = await fetch(endpoint);
		const coverArtUrl = await res["url"];
		gotImage = await coverArtUrl;

		const status = res["status"];

		return  { coverArtUrl, status };
	}

	// adds item from MusicBrainz search results to collection editor
	let itemAdded: boolean;
	async function addItem(item) {
		avatarUrl = item["coverArtUrl"];
		itemAdded = true;
		return itemAdded
	}

	const handleSubmit: SubmitFunction = () => {
		loading = true
		return async ({ result }) => {
			loading = false,
			await applyAction(result)
		}
	}

	const handleSignOut: SubmitFunction = () => {
		loading = true
		return async ({ update }) => {
			loading = false
			update()
		}
	}
</script>

<div class="account-form">
	<form
		method="post"
		action="?/update"
		use:enhance={handleSubmit}
		bind:this={profileForm}
	>
		<div class="form-item">
			<p>Email: {session.user.email}</p>
		</div>

		<div class="form-item">
			<label for="username">Username</label>
			<input id="username" name="username" type="text" value={form?.username ?? username} />
		</div>

		<div class="form-item">
			<label for="displayName">Display name</label>
			<input id="displayName" name="displayName" type="text" value={form?.displayName ?? displayName} />
		</div>

		<div class="form-item">
			<label for="website">Website</label>
			<input id="website" name="website" type="url" value={form?.website ?? website} />
		</div>

		<div class="form-item">
			<label for="avatarUrl">avatarUrl</label>
			<input id="avatarUrl" name="avatarUrl" type="url" value={form?.avatarUrl ?? avatarUrl} />
		</div>

		{#if avatarUrl}
		<img src={avatarUrl} />
		{/if}

		<div class="form-item">
			<input
				type="submit"
				value={loading ? 'Loading...' : 'Update'}
				disabled={loading}
			/>
		</div>
	</form>
	{#if form?.success}
		<p>update submitted</p>
	{/if}
	<form method="post" action="?/signout" use:enhance={handleSignOut}>
		<div>
			<button disabled={loading}>Sign Out</button>
		</div>
	</form>
</div>

<!--
	Form to search for avatar url
-->
<form>
	<p>Pick an album cover as your avatar. ALBUM IMAGES DON'T DISPLAY IN SEARCH RESULTS (YET)</p>
	<input type="search" name="query" bind:value={query} placeholder="Search for an album, EP, single, etc."/>
	<button on:click|preventDefault={mbSearch}>search</button>
</form>

<!--
	Table to display search results
-->
{#if searchComplete}
<table>
	<caption>search results</caption>
	<thead>
		<tr>
		  <th class="w-[100px]"></th>
			<th>Album</th>
			<th>Artist</th>
			<th>Cover</th>
		</tr>
	  </thead>
	  <tbody>
		{#each mbData as item}
			<tr>
				<td>
					<button on:click|preventDefault={() => addItem(item)}>select</button>
				</td>
				{#await gotImage}
					<td>...waiting</td>
				{:then coverArtUrl}
					<td >{item["title"]}</td>
					<td>{item["artist-credit"][0]["artist"]["name"]}</td>
					<td><img src={item["coverArtUrl"]} alt="{item["title"]} by {item["artist-credit"][0]["artist"]["name"]}" /></td>
				{:catch error}
					<td style="color: red">{error.message}</td>
				{/await}
		</tr>
		{/each}
		</tbody>
	</table>
{/if}

<style>
	.account-form {
		max-width: 100%;
	}
	.form-item{
		flex-flow: row wrap;
	}
	img {
		width: 200px;
	}
</style>