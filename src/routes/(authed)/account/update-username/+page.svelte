<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { enhance } from '$app/forms';

	import SEO from '$lib/components/layout/SEO.svelte';
	import PanelHeader from 'src/lib/components/layout/PanelHeader.svelte';
	import NotificationModal from '$lib/components/modals/NotificationModal.svelte';
	import RedirectModal from '$lib/components/modals/RedirectModal.svelte';
	import { validateUsernameCharacters } from '$lib/resources/parseData';

	let { data, form } = $props();

	let { profile } = $derived(data);

	let loading = $state(false);
	let username = $derived(profile?.username as string);
	let delay = $state(5);
	let countdown = $state(0);

	let invalidUsername = $state(false);
	let showRedirectModal = $derived(form?.success ? form?.success : false);

	$effect.pre(() => {
		invalidateAll();
	});

	$effect(() => {
		if (showRedirectModal) {
			countdown = delay;
			setInterval(() => (countdown -= 1), 1000);
		}
	});
</script>

<SEO title="Update username"></SEO>

<div class="panel" id="profile-info">
	<PanelHeader>
		{#snippet headerText()}
			<span> update username </span>
		{/snippet}
	</PanelHeader>
	<form
		class="horizontal"
		id="account-data"
		method="POST"
		use:enhance={() => {
			loading = true;
			const validUsername = validateUsernameCharacters(username);
			if (!validUsername) {
				invalidUsername = true;
				loading = false;
				return;
			}
			return async ({ update }) => {
				await update();
				loading = false;
			};
		}}
	>
		<div class="form-column">
			<label class="text-label" for="current-username" form="account-data">
				Current Username
			</label>
			<input
				class="text"
				type="text"
				name="current-username"
				id="current-username"
				form="account-data"
				defaultValue={username}
				disabled
			/>
			<label class="text-label" for="new-username" form="account-data"> New Username </label>
			<span class="label-explainer">
				Letters, digits, and underscores allowed. Minimum 3 characters.
			</span>
			<input
				class="text"
				type="text"
				name="new-username"
				id="new-username"
				form="account-data"
				defaultValue={username}
			/>
			<button type="submit" class="double-border-top" disabled={loading}>
				<div class="inner-border">submit</div>
			</button>
		</div>
	</form>
</div>

<NotificationModal showModal={form?.success == false && form?.usernameTaken == true}>
	{#snippet headerText()}
		<span> Try Another Username </span>
	{/snippet}
	{#snippet message()}
		<span>
			That Username is already taken, but you can use it for your Display Name.
			<br />
			<br />
			Your Display Name is what other people on the site will actually see.
		</span>
	{/snippet}
</NotificationModal>

<NotificationModal showModal={invalidUsername || form?.validUsername == false}>
	{#snippet headerText()}
		<span> Username contains bad characters or is not at least 3 characters long. </span>
	{/snippet}
	{#snippet message()}
		<span> Usernamess only contain letters (a-z or A-Z), digits (0-9), and underscores(_). </span>
	{/snippet}
</NotificationModal>

<RedirectModal showModal={showRedirectModal} {delay} redirectPath="/account">
	{#snippet message()}
		<span>
			Username updated successfully. Redirecting to your account page in {countdown} seconds.
		</span>
	{/snippet}
</RedirectModal>

<style>
	.panel {
		max-width: 500px;
	}
	input {
		max-width: 300px;
	}
</style>
