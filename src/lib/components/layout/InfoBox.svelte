<script lang="ts">
	import type { Snippet } from 'svelte';
	let {
		mode = 'compact', // "standard", "compact", "inline"
		children
	}: {
		mode: string;
		children: Snippet;
	} = $props();

	const boxStyle = {
		standard: 'info-box',
		compact: 'info-box-compact',
		inline: 'info-box-inline'
	} as App.StringLookupObject;
</script>

<div class={boxStyle[mode]} aria-label="hint">
	<p>
		{@render children()}
	</p>
</div>
