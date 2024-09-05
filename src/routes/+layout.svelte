<script lang="ts">
	import "$lib/styles/global.css";
	import "$lib/styles/themes.css";
	import "$lib/styles/freq-dark-theme.css";
	import "$lib/styles/fonts.css";
	import "$lib/styles/media-grid-list.css";
	import "$lib/styles/metadata-formatting.css";
	import "$lib/styles/posts.css";

	import { goto, invalidate } from '$app/navigation';
	import { onMount, onDestroy } from 'svelte';

	import { profileStoresObject } from '$lib/stores.ts'
	import PlainHeader from "$lib/components/headers/PlainHeader/page.svelte";
	import type { LayoutData } from "./$types";
	

	export let data: LayoutData
	let { session, user, profile, supabase } = data
	$: ({ session, user, profile, supabase } = data)

	const sessionUserId = user?.id as string

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
			if (!newSession) {
				/**
				 * Queue this as a task so the navigation won't prevent the
				 * triggering function from completing
				 */
				setTimeout(() => {
					goto('/', { invalidateAll: true });
				});
			}
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<PlainHeader
	username={username}
	displayName={displayName}
	avatarUrl={avatarUrl}
	sessionUserId={sessionUserId}
></PlainHeader>

<div class="double-border-full-vw"></div>
<body>
		<slot />
</body>
<!-- <Footer /> -->