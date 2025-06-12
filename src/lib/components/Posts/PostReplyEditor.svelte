<script lang="ts">
	import { enhance } from "$app/forms"

    let { reply }: { reply?: App.RowData } = $props()

    let loading = $state(false)
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
        <input
            type="hidden"
            name="reply-to-id"
            id="reply-to-id"
            value={reply?.post_id ?? reply?.id ?? null}
        />
        <input
            type="hidden"
            name="parent-post-id"
            id="parent-post-id"
            value={reply?.parent_post_id ?? null}
        />
        <input 
            type="hidden"
            name="post-username"
            id="post-username"
            value={reply?.parent_post_username ?? null}
        />
        <input 
            type="hidden"
            name="post-timestamp"
            id="post-timestamp"
            value={reply?.parent_post_created_at ?? null}
        />
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