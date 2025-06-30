<script lang="ts">
	import { enhance } from '$app/forms';
	import Heart from '@lucide/svelte/icons/heart';

	interface ComponentProps {
		postId?: string;
		collectionId?: string;
		reactionCount?: number;
		reactionActive: boolean;
		buttonClass?: string;
	}

	let {
		postId,
		collectionId,
		reactionCount = 0,
		reactionActive,
		buttonClass = 'like'
	}: ComponentProps = $props();

	let reactionPromise = $state(false);
	let currentReactionActive = $state(reactionActive) as boolean;
	let currentReactionCount = $state(reactionCount) as number;

	const buttonStyling = {
		like: {
			textClass: 'descriptor',
			iconSize: 16,
			iconClass: 'like-icon'
		},
		standard: {
			textClass: 'standard-text',
			iconSize: 14,
			iconClass: 'standard-icon'
		}
	} as any;
</script>

<form method="POST" id="submitReaction" action="?/submitReaction" use:enhance>
	<!-- <form 
    method="POST" 
    id="submitReaction"
    action="?/submitReaction" 
    use:enhance={() => {
        reactionPromise = true
        currentReactionActive = !currentReactionActive
        currentReactionCount = currentReactionActive ? ( ++currentReactionCount ) : ( --currentReactionCount )
        return async ({ update }) => {
            await update()
            reactionPromise = false
        }}
    }
> -->
	<input type="hidden" name="post-id" id="post-id" value={postId} />
	<input type="hidden" name="collection-id" id="collection-id" value={collectionId} />
	<input type="hidden" name="reaction-type" id="reaction-type" value="like" />
	<button
		class={buttonClass}
		formaction="?/submitReaction"
		disabled={reactionPromise}
		onclick={() => {
			currentReactionActive = !currentReactionActive;
			currentReactionCount = currentReactionActive
				? ++currentReactionCount
				: --currentReactionCount;
		}}
	>
		<div class="row-group-icon-description">
			{#if currentReactionCount > 0}
				<span>
					{currentReactionCount}
				</span>
			{/if}
			{#if !currentReactionActive}
				<Heart
					class={buttonStyling[buttonClass]['iconClass']}
					size={buttonStyling[buttonClass]['iconSize']}
				></Heart>
				<span class={buttonStyling[buttonClass]['textClass']}> like </span>
			{:else}
				<Heart
					class={buttonStyling[buttonClass]['iconClass']}
					size={buttonStyling[buttonClass]['iconSize']}
					fill="var(--freq-color-text-muted)"
				></Heart>
				<span class={buttonStyling[buttonClass]['textClass']}> liked </span>
			{/if}
		</div>
	</button>
</form>

<style>
	.standard-text {
		text-transform: uppercase;
		font-size: var(--freq-font-size-x-small);
	}
	.like-icon,
	.standard-icon {
		color: var(--freq-color-text-muted);
	}
	.like-icon:is(:hover, :focus) {
		color: var(--freq-color-text);
	}
	/* @media screen and (max-width: 770px) {
        .standard-text {
            font-size: var(--freq-font-size-2x-small);
        }
    } */
</style>
