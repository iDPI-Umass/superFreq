<script lang="ts">
	import "$lib/styles/about.css";
	import "$lib/styles/bits-ui.css";
	import "$lib/styles/collections.css";
	import "$lib/styles/feed.css";
	import "$lib/styles/fonts.css";
	import "$lib/styles/freq-dark-theme.css";
	import "$lib/styles/global.css";
	import "$lib/styles/interaction.css";
	import "$lib/styles/posts.css";
	import "$lib/styles/profile.css";
	import "$lib/styles/themes.css";

	import { goto, invalidate, invalidateAll } from '$app/navigation'
	import { onMount, onDestroy } from 'svelte'

	import { profileStoresObject } from '$lib/stores.ts'
	import Header from "src/lib/components/layout/NavHeader.svelte"
	import type { Snippet } from 'svelte'
	import type { LayoutData } from "./$types"
	

	let { data, children }: { data: LayoutData, children: Snippet} = $props()
	let { session, sessionUserId, supabase } = $derived(data)
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

	// let username = $state() as string
	// let displayName: string = $state() as string
	// let avatarUrl: string = $state() as string
	// let avatarArtist: string = $state() as string
	// let avatarReleaseGroup: string = $state() as string
	// let avatarItem = $state({}) as App.Lookup

	let { profile } = $derived(data) as App.RowData

	let { username, display_name, avatar_url, avatar_last_fm_img_url, avatar_artist_name, avatar_release_group_name }: {
		username: string
		display_name: string
		avatar_url: string
		avatar_last_fm_img_url: string
		avatar_artist_name: string
		avatar_release_group_name: string
	} = $derived(profile)

	let avatarItem = $derived({
		'img_url': avatar_url,
		'last_fm_img_url': avatar_last_fm_img_url,
		'artist_name': avatar_artist_name,
		'release_group_name': avatar_release_group_name
	}) as App.StringLookupObject


	// if (typeof window !== 'undefined') {   
	// 	username = profile?.username as string
	// 	displayName = profile?.display_name as string
	// 	avatarUrl = profile?.avatar_url as string
	// 	avatarArtist = profile?.avatar_artist_name as string
	// 	avatarReleaseGroup = profile?.avatar_release_group_name as string
	// 	avatarItem = {
	// 		'img_url': avatarUrl,
	// 		'artist_name': avatarArtist,
	// 		'release_group_name': avatarReleaseGroup
	// 	}
	// }

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
	displayName={display_name}
	avatarItem={avatarItem}
></Header>
<div class="double-border-full-vw"></div>
{@render children()}

<div class="buffer"></div>

<style>
    .bottom-double-border {
        padding-top: var(--freq-spacing-3x-small);
    }
    .buffer {
        padding-bottom: var(--freq-spacing-large);
    }
</style>