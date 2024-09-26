<script lang="ts">
	import "$lib/styles/about.css";
	import "$lib/styles/collections.css";
	import "$lib/styles/feed.css";
	import "$lib/styles/fonts.css";
	import "$lib/styles/freq-dark-theme.css";
	import "$lib/styles/global.css";
	import "$lib/styles/metadata-formatting.css";
	import "$lib/styles/posts.css";
	import "$lib/styles/profile.css";
	import "$lib/styles/themes.css";

	import { goto, invalidate, invalidateAll } from '$app/navigation';
	import { onMount, onDestroy } from 'svelte';

	import { profileStoresObject } from '$lib/stores.ts'
	import PlainHeader from "$lib/components/headers/PlainHeader/page.svelte";
	import type { LayoutData } from "./$types";
	

	export let data: LayoutData
	let { session, sessionUserId, user, profile, supabase } = data
	$: ({ session, sessionUserId, user, profile, supabase } = data)

	let displayName: string
	let avatarUrl: string
	let username: string
	$: displayName, avatarUrl, username


	if (typeof window !== 'undefined') {   
		username = profile?.username as string
		displayName = profile?.display_name as string
		avatarUrl = profile?.avatar_url as string
	}

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<PlainHeader
	sessionUserId={sessionUserId}
	username={username}
	displayName={displayName}
	avatarUrl={avatarUrl}
></PlainHeader>

<div class="double-border-full-vw"></div>
<body>
	<slot />
</body>
<!-- <Footer /> -->