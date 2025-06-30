<script lang="ts">
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const redirectFromParam = data?.redirectFromParam as string;
</script>

<p>some error with your login</p>

{#if redirectFromParam == 'confirm'}
	<p>
		There was a problem with your magic link. <a href="/welcome">Try signing in again</a> and please
		fill out a <a href="/report-bug">bug report</a> about this issue.
	</p>

	<p>
		If this is your second time seeing this error today, please <a href="mailto:hello@freq.social"
			>contact the site admin</a
		> for help.
	</p>
{:else if redirectFromParam == 'check'}
	<p>
		There was some problem verfiying your account info. Finish <a href="/create-profile"
			>setting up your profile</a
		>
		and please fill out a <a href="/report-bug">bug report</a> about this issue.
	</p>

	<p>
		If you are having an issue with any of this, please <a href="mailto:hello@freq.social"
			>contact the site admin</a
		> for help.
	</p>
{/if}
