<script lang="ts">
	import { Auth } from '@supabase/auth-ui-svelte'
	import { ThemeSupa } from '@supabase/auth-ui-shared'

	export let data
</script>

<svelte:head>
	<title>Login | Freq</title>
</svelte:head>

<div>
	<div class="login">
		<Auth
			supabaseClient={data.supabase}
			view="magic_link"
			redirectTo={`${data.url}/auth/callback`}
			showLinks={false}
			appearance={{ theme: ThemeSupa, style: { input: 'color: #fff' } }}
		/>
	</div>
</div>

<style>
	.login{
		display: flex;
		flex-flow: column;
		width: 50%;
	}
	@media screen and (max-width: 600px){
		.login {
			max-width: 90%;
		}
	}
</style>