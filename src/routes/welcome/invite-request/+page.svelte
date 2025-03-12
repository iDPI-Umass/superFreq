<script lang="ts">
	import { enhance } from '$app/forms'
	import { invalidate, invalidateAll } from '$app/navigation'
    import SEO from '$lib/components/layout/SEO.svelte';
	import PanelHeader from '$lib/components/PanelHeader.svelte'
	import NotificationModal from '$lib/components/modals/NotificationModal.svelte'

	let { form } = $props()

    let email = $state(null) as string | null
    let referredBy = $state(null) as string | null
	let success = $derived(form?.success ?? false) as boolean
    let authError = $derived(form?.authError ?? false) as boolean
    let approved = $derived(form?.approved ?? false) as boolean
    let userId = $derived(form?.user_id ?? null) as string | null
    let quizAnswer = $state() as string

    function modalHeader ( approved: boolean, userId: string | null ) {
        if ( !approved && !userId) {
            return 'invite requested'
        }
        else if ( approved && !userId ) {
            return 'invite approved'
        }
        else if ( approved && userId ) {
            return 'check your inbox'
        }
        else if ( authError && approved || userId ) {
            return 'login error'
        }
    }

    function modalBody ( approved: boolean, userId: string | null ) {
        if ( !approved ) {
            return `Thank you for your interest in joining the Freq beta test! You'll receive an email soon once your invite has been approved.`
        }
        else if ( !authError && approved && !userId ) {
            return 'Check your inbox for a sign in link to finish creating your profile.'
        }
        else if ( !authError && approved && userId ) {
            return 'You already have an account! Check your inbox for a sign-in link.'
        }
        else if ( authError && approved || userId ) {
            return 'You have an approved invite or an active account, but there was some issue with signing you in. Please visit the home page and try signing in again.'
        }
    }

	$effect.pre(() => {
		invalidateAll()
	})
</script>

<SEO title="Invite request"></SEO>
 
<div class="panel" id="profile-info">
	<PanelHeader>
		{#snippet headerText()}
            <span >
				request an invite
			</span>
		{/snippet}
	</PanelHeader>
	<div class="form-wrapper">
		<form
			class="form-column"
			method="post"
            action="?/invite"
            use:enhance
		>
			<div class="label-group">
				<label 
					class="text-label" 
					for="email"
				>
					Email address
				</label>
			</div>
			<input
				class="text" 
				type="email" 
				name="email" 
				id="email"
                bind:value={email}
			/>
			<div class="label-group">
				<label 
					class="text-label"  
					for="referred-by"
				>
					How did you hear about Freq?
				</label>
			</div>
			<input
				class="text"
				type="text"
				name="referred-by"
				id="referred-by"
                bind:value={referredBy}
			/>
            <fieldset class="search">
                <p>
                    According to our <a href='/about#guidelines'>community guidelines</a>, what should you do when you're in doubt?
                </p>
                <ul>
                    <li>
                        <input 
                            class="radio"
                            type="radio"
                            name="item-type"
                            id="listen"
                            value="listen"
                            bind:group={quizAnswer}
                        />
                        <label for="listen">
                            Listen to music
                        </label>
                    </li>
                    <li>
                        <input 
                            class="radio"
                            type="radio"
                            name="item-type"
                            id="PLUR"
                            value="PLUR"
                            bind:group={quizAnswer}
                        />
                        <label for="PLUR">
                            PLUR
                        </label>
                    </li>
                    <li>
                        <input 
                            class="radio"
                            type="radio"
                            name="item-type"
                            id="fight"
                            value="fight"
                            bind:group={quizAnswer}
                        />
                        <label for="fight">
                            Start a fight with a stranger
                        </label>
                    </li>
                    <li>
                        <input 
                            class="radio"
                            type="radio"
                            name="item-type"
                            id="doubt"
                            value="doubt"
                            bind:group={quizAnswer}
                        />
                        <label for="doubt">
                            Sit with your doubt
                        </label>
                    </li>
                </ul>
            </fieldset>
            <button
                class='standard'
                type='submit'
                disabled={!( email && referredBy && (quizAnswer == 'PLUR'))}
            >
                request invite
            </button>
		</form>
	</div>
</div>

<NotificationModal
	showModal={success}
>
	{#snippet headerText()}
		<span >
			{ modalHeader( approved, userId )}
		</span>
	{/snippet}
	{#snippet message()}
		<span >
			{ modalBody( approved, userId )}
		</span>
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
    li {
        text-transform: none;
    }
</style>