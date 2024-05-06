<script>
	// Base themes and fonts for project.
	import "$lib/styles/global.css";
	import "$lib/styles/themes.css";
	import "$lib/styles/freq-dark-theme.css";
	import "$lib/styles/fonts.css";

	/* 
	Page layout stuff 
	TODO: move this to a "/home" route that layout redirects to if user is logged in
	*/

	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { Header } from '$lib/components/headers/Header';
	import Footer from '$lib/components/headers/footer/index.svelte';

	import { DropdownMenu, Select } from "bits-ui";
	let accountMenuItems = [
		{ value: '/account', label: 'account settings' },
		{ value: '/feed', label: 'feed' },
		{ value: '/collections', label: 'discover' },
		{ value: '/collection/new', label: 'new collection' }
	]


	export let data;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);
	
	// let displayName = ""
	// if ( session ) {
	// 	displayName = user["data"][0]["display_name"]
	// }

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth')
			}
		})

		return () => data.subscription.unsubscribe()
	})
</script>

<Header
	session={session}
	displayName="bass"
/>
<body>
	<slot />
</body>
<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		cheese
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="dropdown">
		<DropdownMenu.Item>
			cheese1
		</DropdownMenu.Item>
		<DropdownMenu.Item>
			cheese2
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
<!-- <Footer /> -->
