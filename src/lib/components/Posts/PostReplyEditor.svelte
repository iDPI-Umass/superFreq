<script lang="ts">
	import { enhance } from "$app/forms"

    interface ComponentProps {
        reply?: App.RowData
        collectionId?: string | null
        styling?: string
        placeholderText?: string
    }
    let { 
        reply, 
        collectionId = null,
        styling='default',
        placeholderText='Reply...'
    }: ComponentProps = $props()

    let loading = $state(false)

    const styleClasses = {
        'default': {
            'panel': 'reply-editor',
            'form': 'reply'
        },
        'collection': {
            'panel': 'collection-reply-editor',
            'form': 'collection-reply'
        }
    } as any
</script>

<div class={styleClasses[styling]["panel"]}>
    <form name="submitReply" id="submitReply" class={styleClasses[styling]["form"]} method="post" action="?/submitReply" use:enhance={({ formElement }) => {
        loading = true;
        return async ({ update }) => {
            await update();
            loading = false;
            formElement.reset()
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
            name="parent-collection-id"
            id="parent-collection-id"
            value={collectionId ?? reply?.parent_collection_id ?? null}
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
            placeholder={placeholderText}
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