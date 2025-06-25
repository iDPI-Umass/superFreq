<script lang="ts">
	import { parseMarkdown } from '$lib/resources/parseData';
	import DOMPurify from 'dompurify';

	let { text }: { text: string } = $props();
</script>

{#await parseMarkdown(text) then text}
	{@html DOMPurify.sanitize(text as string)}
{:catch}
	{''}
{/await}
