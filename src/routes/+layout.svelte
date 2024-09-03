<script lang="ts">
	// Base themes and fonts for project.
	import "$lib/styles/global.css";
	import "$lib/styles/themes.css";
	import "$lib/styles/freq-dark-theme.css";
	import "$lib/styles/fonts.css";

	/* 
	Page layout stuff 
	TODO: move this to a "/home" route that layout redirects to if user is logged in
	*/

	import { goto, invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';

	import { profileStoresObject } from '$lib/stores.ts'
	import { Header } from '$lib/components/headers/Header';
	import PlainHeader from "$lib/components/headers/PlainHeader/page.svelte";
	import Footer from '$lib/components/headers/footer/index.svelte';
	

	export let data;
	$: ({ supabase, session } = data)


	let displayName: string
	let avatarUrl: string
	let username: string
	let profileObject: App.ProfileObject
	$: displayName, avatarUrl, username

	if (typeof window !== 'undefined') {   
		const profileStorage = localStorage.getItem("profile") as string
		profileObject = JSON.parse(profileStorage)

		displayName = profileObject.displayName
		avatarUrl = profileObject.avatarUrl
		username = profileObject.username

		profileStoresObject.set(profileObject)
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

		// profileObject.displayName = profile?.display_name ?? ''
		// profileObject.avatarUrl = profile?.avatar_url ?? ''
		// profileObject.username = profile?.username ?? ''

		// profileStoresObject.set(profileObject)

		return () => data.subscription.unsubscribe();
	});

	const unsubscribe = profileStoresObject.subscribe((value) => {
		profileObject = value
	})
</script>

<!-- <Header
	session={session}
	displayName="bass"
/> -->

<PlainHeader
	displayName={profileObject.displayName}
	avatarUrl={profileObject.avatarUrl}
	username={profileObject.username}
></PlainHeader>

<div class="double-border-full-vw"></div>
<body>
		<slot />
</body>
<!-- <Footer /> -->