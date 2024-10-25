<script lang="ts">
    import { preventDefault } from 'svelte/legacy';

    import type { Posts } from './$types'

    interface ComponentProps {
        postData: Posts
        editState?: boolean
    }
    let { 
        postData,
        editState = $bindable(false)
    }: ComponentProps = $props()

    function toggleEditState() {
        editState = !editState
    }
</script>

<svelte:options runes={true} />

<form method="POST" name="editPostText" class="vertical" action="?/editPost">
    <input 
        id="post-data"
        name="post-data"
        type="hidden"
        value={JSON.stringify(postData)}
    />
    <textarea
        cols="1"
        rows="4"
        id = "edited-text"
        name="edited-text"
        spellcheck=true 
        required
    >{postData.text}</textarea>
    <div class="edit-submit-options">
        <button class="standard" onclick={preventDefault(toggleEditState)}>
            cancel
        </button>
        <button class="standard" formaction="?/editPost">
            submit edit
        </button>
    </div>
</form>

<style>
    .edit-submit-options {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
</style>