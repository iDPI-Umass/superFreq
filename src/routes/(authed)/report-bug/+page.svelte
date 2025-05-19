<script lang="ts">
    import { enhance } from '$app/forms'
	import PanelHeader from "$lib/components/PanelHeader.svelte"
    import NotificationModal from '$lib/components/modals/NotificationModal.svelte'

    let { data, form } = $props()
    let { userSession } = $derived( data )

    let bugType = $state() as string
    let bugPath = $state() as string
    let bugDescription = $state() as string

    let success = $derived(form?.success)
</script>

<div class="panel">
    <PanelHeader>
        {#snippet headerText()}
            <span>
                report a bug
            </span>
        {/snippet}
    </PanelHeader>
    {#if userSession }
    <div class="form-wrapper">
        <form
            class="form-column"
            method="POST"
            action="?/submit"
            use:enhance
        >
            <div class="label-group">
                <label for="bug-type" class="text-label">
                    What type of bug are you reporting?
                </label>
            </div>
            <fieldset>
                <ul>
                    <li>
                        <input 
                            class="radio"
                            type="radio"
                            name="bug-type"
                            id="500"
                            value="500"
                            bind:group={bugType}
                        />
                        <label for="500">
                            500 error
                        </label>
                    </li>
                    <li>
                        <input 
                            class="radio"
                            type="radio"
                            name="bug-type"
                            id="404"
                            value="404"
                            bind:group={bugType}
                        />
                        <label for="404">
                            404 error
                        </label>
                    </li>
                    <li>
                        <input 
                            class="radio"
                            type="radio"
                            name="bug-type"
                            id="200"
                            value="200"
                            bind:group={bugType}
                        />
                        <label for="200">
                            200 error
                        </label>
                    </li>
                    <li>
                        <input 
                            class="radio"
                            type="radio"
                            name="bug-type"
                            id="data-display"
                            value="data-display"
                            bind:group={bugType}
                        />
                        <label for="data-display">
                            Data isn't displaying correctly
                        </label>
                    </li>
                    <li>
                        <input 
                            class="radio"
                            type="radio"
                            name="bug-type"
                            id="design"
                            value="design"
                            bind:group={bugType}
                        />
                        <label for="design">
                            Visual design
                        </label>
                    </li>
                    <li>
                        <input 
                            class="radio"
                            type="radio"
                            name="bug-type"
                            id="login"
                            value="login"
                            bind:group={bugType}
                        />
                        <label for="login">
                            Logging in or signing up
                        </label>
                    </li>
                    <li>
                        <input 
                            class="radio"
                            type="radio"
                            name="bug-type"
                            id="dead-link"
                            value="dead-link"
                            bind:group={bugType}
                        />
                        <label for="dead-link">
                            Link doesn't work
                        </label>
                    </li>
                    <li>
                        <input 
                            class="radio"
                            type="radio"
                            name="bug-type"
                            id="posts"
                            value="posts"
                            bind:group={bugType}
                        />
                        <label for="posts">
                            Posts
                        </label>
                    </li>
                    <li>
                        <input 
                            class="radio"
                            type="radio"
                            name="bug-type"
                            id="collections"
                            value="collections"
                            bind:group={bugType}
                        />
                        <label for="collections">
                            Collections
                        </label>
                    </li>
                    <li>
                        <input 
                            class="radio"
                            type="radio"
                            name="bug-type"
                            id="profiles"
                            value="profiles"
                            bind:group={bugType}
                        />
                        <label for="profiles">
                            User profiles
                        </label>
                    </li>
                    <li>
                        <input 
                            class="radio"
                            type="radio"
                            name="bug-type"
                            id="other"
                            value="other"
                            bind:group={bugType}
                        />
                        <label for="other">
                            Other
                        </label>
                    </li>
                </ul>
            </fieldset>
            <div class="label-group">
				<label 
					class="text-label"  
					for="bug-path"
				>
					Paste the link for page where the bug happened
				</label>
			</div>
			<input
				class="text"
				type="url"
				name="bug-path"
				id="bug-path"
                bind:value={bugPath}
			/>
            <div class="label-group">
				<label 
					class="text-label"  
					for="bug-description"
				>
					Describe the bug
				</label>
			</div>
			<input
				class="text"
				type="text"
				name="bug-description"
				id="bug-description"
                bind:value={bugDescription}
			/>
            <button
                class="standard"
                type="submit"
                disabled={!( bugType && bugPath && bugDescription )}
            >
                submit bug report
            </button>
        </form>
    </div>
    {:else}
    <p>
        Please email <a href="mailto:hello@freq.social">hello@freq.social</a> if you are having trouble signing up or logging in.
    </p>
    {/if}
</div>

<NotificationModal
	showModal={ success }
>
	{#snippet headerText()}
		<span >
			{ success ? 
                'Bug submitted!' :
                'Some error occurred'
            }
		</span>
	{/snippet}
	{#snippet message()}
        {#if success == true }
            <span>
                Thank you for reporting the bug!
            </span>
        {:else if success == false}
            <span>
                Some error occurred. Please try again or email <a href="mailto:hello@freq.social">hello@freq.social</a>
            </span>
        {/if}
	{/snippet}
</NotificationModal>


<style>
	.form-wrapper {
		display: flex;
		flex-direction: row;
		gap: var(--freq-width-spacer);
		margin: var(--freq-height-spacer) var(--freq-width-spacer);
	}
	@media screen and (max-width: 700px) {
		.form-wrapper {
			max-width: 700px;
			display: flex;
			flex-direction: column;
			gap: var(--freq-width-spacer);
			margin: var(--freq-height-spacer) var(--freq-width-spacer);
		}
	}
    fieldset {
        margin-top: 0;
        margin-bottom: var(--freq-height-spacer-half);
    }
    li {
        text-transform: none;
    }
</style>