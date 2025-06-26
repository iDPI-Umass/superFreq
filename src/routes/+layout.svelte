<script lang="ts">
	import "$lib/styles/about.css";
	import "$lib/styles/bits-ui.css";
	import "$lib/styles/collections.css";
	import "$lib/styles/feed.css";
	import "$lib/styles/fonts.css";
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

	import SquareArrow from '@lucide/svelte/icons/square-arrow-out-up-right'

	import logo from "$lib/assets/images/logo/freq-logo-dark.svg"
	
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
	logo={logo}
></Header>
<div class="double-border-full-vw"></div>
{@render children()}

<div class="buffer"></div>

<div class="footer-spacing">
	<div class="double-border-full-vw"></div>
	<footer>
		<div class="site-identity">
		<a class="logo-footer" href="/">
		<img alt="Freq" src={logo} />
		</a>
		<span>A place to hang out and discover cool music.</span>
		</div>
		<ul>
			<li>
				<a href="/about">about</a>
			</li>
			<li>
				<a href="/about/guidelines">community guidlines</a>
			</li>
			<li>
				<a href="/about#data">data and consent</a>
			</li>
			<li>
				<a href="/about/updates#updates">updates</a>
			</li>
			<li>
				<a href="mailto:hello@freq.social">
					contact
					<SquareArrow class="redirect-icon" size="12"></SquareArrow>
				</a>
			</li>
		</ul>
	</footer>
</div>

<style>
    .buffer {
        padding-bottom: var(--freq-spacing-large);
    }
	.footer-spacing {
		margin-top: auto;
	}
	footer {
		display: flex;
		flex-direction: row;
		flex-shrink: 0;
		max-width: 100vw;
		padding: var(--freq-spacing-large) var(--freq-spacing-x-large);
		background-color: var(--freq-background-grid-fallback);
		justify-content: space-between;
		align-items: start;
	}
	.site-identity {
		display: flex;
		flex-direction: column;
		gap: var(--freq-spacer-gap-quarter);
	}
	.site-identity span {
		font-size: var(--freq-font-size-small);
		color: var(--freq-color-reading-text);
	}
	.logo-footer img {
		width: 200px;
	}
	footer ul {
		list-style: none;
		padding: 0;
	}
	.redirect-icon {
		color: var(--freq-color-reading-text);
	}
	footer a {
		color: var(--freq-color-reading-text);
		text-transform: uppercase;
		font-size: var(--freq-font-size-small);
		line-height: var(--freq-line-height-dense);
	}
	footer a:is(:hover, :focus),
	.redirect-icon:is(:hover, :focus)  {
		color: var(--freq-color-primary);	
	}
	footer a:active,
	.redirect-icon:active  {
		color: var(--freq-color-text);
	}
	@media screen and (max-width: 770px) {
		footer {
			flex-direction: column;
		}
	}
</style>