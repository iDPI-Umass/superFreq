<script lang="ts">
    import type { ActionData } from './$types'
	
	export let form: ActionData
    let email = ''
</script>

<form class="magic-link-box" id="auth-magic-link" method="POST" action="?/login">
    <label for="email">log in to freq</label>
    <input
        class="data"
        type="email"    
        id="email"
        name="email"
        placeholder="Enter email address to sign in"
        autocomplete="email"
        bind:value={email}
    />
    <button class="standard" formaction="?/login">
        submit
    </button>

    {#if form?.success}
        <p>
            Check your email for link to complete login.
        </p>
    {/if}
</form>

<style>
    label {
        font-size: var(--freq-font-size-small);
        text-transform: uppercase;
    }
    .magic-link-box {
        display: flex;
        flex-direction: column;
        width: 400px;
        margin-top: 10%;
        margin-left: 10%;
        padding: 2vh 2vw;
        border: var(--freq-border-panel);
    }
</style>