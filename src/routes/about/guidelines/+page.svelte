<script lang="ts">
	import SEO from '$lib/components/layout/SEO.svelte';
	import PanelHeader from 'src/lib/components/layout/PanelHeader.svelte';
	import InfoBox from 'src/lib/components/layout/InfoBox.svelte';
	import Guidelines from '$lib/assets/text/community-guidelines.md';
	import Consent from '$lib/assets/text/data-consent.md';
</script>

<SEO title="Community guidelines"></SEO>

<InfoBox mode="compact">
	Give these a read then head over to <a href="/">your profile page,</a> which will be your home base
	on Freq.
</InfoBox>

<div class="panel">
	<PanelHeader>
		{#snippet headerText()}
			Community guidelines
		{/snippet}
	</PanelHeader>
	<div class="about-text">
		<Guidelines></Guidelines>
	</div>
</div>

<div class="panel">
	<PanelHeader>
		{#snippet headerText()}
			Data consent
		{/snippet}
	</PanelHeader>
	<div class="about-text">
		<Consent></Consent>
	</div>
</div>
