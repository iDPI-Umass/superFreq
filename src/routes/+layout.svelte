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

	import { onMount } from 'svelte' 
	import { dev } from '$app/environment'
	import { invalidate } from '$app/navigation'
	import Header from "src/lib/components/layout/NavHeader.svelte"
	import type { Snippet } from 'svelte'
	import type { LayoutData } from "./$types"
	import { injectAnalytics } from '@vercel/analytics/sveltekit'
	
	let { data, children }: { data: LayoutData, children: Snippet} = $props()
	let { session, sessionUserId, supabase } = $derived(data)

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

	injectAnalytics({ mode: dev ? 'development' : 'production' })

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		})
		return () => data.subscription.unsubscribe()
	})
</script>

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
    .buffer {
        padding-bottom: var(--freq-spacing-large);
    }
</style>