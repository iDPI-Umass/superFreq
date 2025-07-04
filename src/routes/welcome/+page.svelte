<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import SEO from '$lib/components/layout/SEO.svelte';
	import PanelHeader from 'src/lib/components/layout/PanelHeader.svelte';
	import NotificationModal from 'src/lib/components/modals/NotificationModal.svelte';

	let { form } = $props();

	$effect(() => invalidateAll);

	let email: string | null = $state(null);
</script>

<SEO title="Welcome to Freq!"></SEO>

<div class="panel-medium">
	<PanelHeader>
		{#snippet headerText()}
			<span> welcome </span>
		{/snippet}
	</PanelHeader>
	<div class="post-body">
		<p class="post-text">
			Welcome to Freq, a place for community-driven music discovery.
			<br />
			<br />
			<span>Freq</span> (sounds like <em>freak</em>) is short for <em>frequency</em>: the rate a
			sound wave vibrates at, determining its pitch.
			<br />
			<br />
			Just enter your email address for a one-time link to log in or sign up.
		</p>
		<form class="vertical" method="POST" action="?/sendMagicLink" use:enhance>
			<label class="text-label" for="email"> email </label>
			<input
				class="text"
				id="email"
				name="email"
				type="email"
				placeholder="enter your email..."
				bind:value={email}
			/>
			<button class="double-border-top" type="submit" disabled={!email}>
				<div class="inner-border">submit</div>
			</button>
		</form>
	</div>
</div>

{#if form?.permission == true}
	<NotificationModal showModal={form?.showModal ?? false}>
		{#snippet headerText()}
			<span>
				{form?.success ? 'Success' : 'Error'}
			</span>
		{/snippet}
		{#snippet message()}
			<span>
				<p>
					{form?.success
						? 'Check your inbox! And maybe also your spam.'
						: 'Something went wrong. Please reload this page and try again.'}
				</p>
			</span>
		{/snippet}
	</NotificationModal>
{:else if form?.permission == false}
	<NotificationModal showModal={form?.showModal ?? false}>
		{#snippet headerText()}
			<span> Not approved </span>
		{/snippet}
		{#snippet message()}
			<span>
				<p>
					Email address not found, but you're welcome to <a href="/welcome/sign-up"
						>sign up for Freq.</a
					>
				</p>
			</span>
		{/snippet}
	</NotificationModal>
{/if}

<div class="panel-medium">
	<div class="post-body">
		<p class="post-text">
			Want to explore the site before you create an account? You can use the "Explore" menu above to
			check out anonymized posts and public collections of music created by users and read the
			"About" page to learn more about the project.
		</p>
	</div>
</div>

<style>
	.panel-medium p {
		color: var(--freq-color-reading-text);
		font-size: var(--freq-font-size-medium);
	}
	span {
		color: var(--freq-color-primary);
	}
	input {
		width: 50%;
	}
	form.vertical {
		margin-left: 0;
	}
</style>
