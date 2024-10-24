<script lang="ts">
	import "$lib/styles/about.css";
	import "$lib/styles/bits-ui.css";
	import "$lib/styles/collections.css";
	import "$lib/styles/feed.css";
	import "$lib/styles/fonts.css";
	import "$lib/styles/freq-dark-theme.css";
	import "$lib/styles/global.css";
	import "$lib/styles/posts.css";
	import "$lib/styles/profile.css";
	import "$lib/styles/themes.css";

	import { goto, invalidate, invalidateAll } from '$app/navigation'
	import { onMount, onDestroy } from 'svelte'

	import { profileStoresObject } from '$lib/stores.ts'
	import Header from "$lib/components/headers/Header/page.svelte"
	import type { LayoutData } from "./$types"
	

	let { data, children } = $props()
	let { session, sessionUserId, user, profile, supabase } = $derived(data)
	// export let data: LayoutData
	// let { session, sessionUserId, user, profile, supabase } = data
	// $: ({ session, sessionUserId, user, profile, supabase } = data)

	// let { children } = $props()

	// let username: string
	// let displayName: string
	// let avatarUrl: string
	// let avatarArtist: string
	// let avatarReleaseGroup: string
	// let avatarItem = {}
	// $: username, displayName, avatarUrl, avatarArtist, avatarReleaseGroup, avatarItem

	let username = $state() as string
	let displayName: string = $state() as string
	let avatarUrl: string = $state() as string
	let avatarArtist: string = $state() as string
	let avatarReleaseGroup: string = $state() as string
	let avatarItem = $state({}) as App.Lookup


	if (typeof window !== 'undefined') {   
		username = profile?.username as string
		displayName = profile?.display_name as string
		avatarUrl = profile?.avatar_url as string
		avatarArtist = profile?.avatar_artist_name as string
		avatarReleaseGroup = profile?.avatar_release_group_name as string
		avatarItem = {
			'img_url': avatarUrl,
			'artist_name': avatarArtist,
			'release_group_name': avatarReleaseGroup
		}
	}

	$effect(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		})
		return () => data.subscription.unsubscribe()
	})
</script>

<svelte:options runes={true} />

<Header
	sessionUserId={sessionUserId}
	username={username}
	displayName={displayName}
	avatarItem={avatarItem}
></Header>

<div class="double-border-full-vw"></div>
{@render children()}

<!-- {@debug} -->