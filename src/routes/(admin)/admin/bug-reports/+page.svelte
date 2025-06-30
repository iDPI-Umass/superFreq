<script lang="ts">
	import { enhance } from '$app/forms';
	import { parseTimestamp } from 'src/lib/resources/parseData';

	import SEO from '$lib/components/layout/SEO.svelte';
	import NotificationModal from '$lib/components/modals/NotificationModal.svelte';

	let { data } = $props();

	let { reports }: { reports: App.RowData[] } = $derived(data);
	let resolvePromise = $state(false);
</script>

<svelte:head>
	<title>Bug Reports</title>
</svelte:head>

<SEO title="Moderation Dashboard"></SEO>

<div class="panel">
	<h1>Bug Reports</h1>
	<table>
		<thead>
			<tr>
				<th scope="col"> Time </th>
				<th scope="col"> Type </th>
				<th scope="col"> User </th>
				<th scope="col"> Path </th>
				<th scope="col"> Description </th>
				<th scope="col"> Resolve </th>
			</tr>
		</thead>
		<tbody>
			{#each reports as item}
				<tr>
					<td>
						{item.created_at}
					</td>
					<td>
						{item.type}
					</td>
					<td>
						<a href="/user/{item.username}">
							{item.display_name} ({item.username})
						</a>
					</td>
					<td>
						<a href="/user/{item.path}">
							{item.path}
						</a>
					</td>
					<td>
						<p>
							{item.description}
						</p>
					</td>
					<td>
						<form
							method="POST"
							action="?/update"
							use:enhance={() => {
								resolvePromise = true;
								return async ({ update }) => {
									await update();
									resolvePromise = false;
								};
							}}
						>
							<input type="hidden" name="item-id" id="item-id" value={item.id} />
							<textarea name="notes" id="notes"></textarea>
							<div class="cell-row">
								<div class="input-column">
									<label for="resolved"> resolved </label>
									<input type="checkbox" name="resolved" id="resolved" />
								</div>
								<button class="standard" type="submit" disabled={resolvePromise}> update </button>
							</div>
						</form>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.panel {
		border: none;
	}
	table {
		border: var(--freq-border-panel);
	}
	tbody tr {
		border-bottom: var(--freq-border-panel);
	}
	th,
	td {
		border-right: var(--freq-border-panel);
		border-bottom: var(--freq-border-panel);
		padding: var(--freq-spacing-small);
	}
	th:last-child,
	td:last-child {
		border-right: none;
	}
	tr:last-child > td {
		border-bottom: none;
	}
	.input-column {
		display: flex;
		flex-direction: column;
		align-items: start;
	}
	.cell-row {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}
	.more-info {
		border: var(--freq-border-panel-light);
		margin-bottom: var(--freq-spacing-small);
	}
	.more-info:is(:hover, :focus) {
		border: var(--freq-border-panel-light);
		text-decoration: underline;
	}
</style>
