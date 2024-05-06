<!--
    THIS IS NOT COMPLETE. NOT A FUNCTIONAL SUB MENU CURRENTLY.
-->

<script lang="ts">
	import { itemSelect } from '$lib/resources/database/music-data/itemSelect';
    import { getNavOptions } from '../context'

    export let open = false;

    const componentId = crypto.randomUUID();

    const { collapse, activeComponentId } = getNavOptions();

    function setActive() {
		// update the store value in the context
		$activeComponentId = componentId
	}

	function toggleOpen() {
		open = !open
	}

	function handleClick() {
		// if `collapse` is passed only one item can be active
		collapse ? setActive() : toggleOpen()
	}

	// the accordion item to be open by default
	$: open && collapse && setActive()
	// compare if the active id matches the component id
	$: isActive = $activeComponentId === componentId
	// if `collapse`, set one item as active, otherwise use `open`
	$: isOpen = collapse ? isActive : open
</script>

<div class="nav-item">
	<button 
        on:click={handleClick} 
        class="nav-toggle"
        aria-expanded={isOpen}
        aria-controls="accordion-{componentId}"
    >
		<div class="nav-title">
			<slot name="title" />
		</div>

		<div class="nav-caret">`>>`</div>
	</button>

	{#if isOpen}
        <slot prop={item}>
            <li>
                <a href={item.link}>
                    {item.text}
                </a>
            </li>
        </slot>
        <div class="nav-content">
			<slot name="content" />
		</div>
	{/if}
</div>

<style>
	.nav-toggle {
		width: 100%;
		display: flex;
		justify-content: space-between;
		padding: 1rem;
		color: inherit;
		font: inherit;
		font-weight: 600;
		border: none;
		background: none;
		cursor: pointer;
		border-radius: 4px;
		transition: background-color 0.1s ease;
	}

	.nav-toggle:hover {
		background-color: hsl(220 20% 20%);
	}

	.nav-content {
		padding: 1rem;
	}
</style>
