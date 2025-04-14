<script lang="ts">
	import { enhance } from "$app/forms";

    let loading = $state(false);
</script>

<div class="reply-editor">
    <form name="submitReply" id="submitReply" class="reply" method="post" action="?/submitReply" use:enhance={({ formElement }) => {
        loading = true;
        return async ({ update }) => {
            await update();
            loading = false;
            formElement.reset(); // needs formElement to reset the form
        }
    }}>
        <textarea
            rows="4"
            cols="1"
            id="reply-text"
            name="reply-text"
            spellcheck=true 
            placeholder="Reply..."
            required
        ></textarea>
        <button class="standard" formaction="?/submitReply" disabled={loading}>
            submit
        </button>
    </form>
</div>

<style>
    .standard {
        margin-left: auto;
        margin-right: 0;
    }
</style>