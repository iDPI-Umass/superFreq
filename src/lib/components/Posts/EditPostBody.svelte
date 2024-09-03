<script lang="ts">
    import type { Posts } from './$types'
    export let postData: Posts
    export let editState: boolean = false

    function toggleEditState() {
        editState = !editState
    }
</script>

<form name="editPostText" class="vertical" action="?/editPost">
    <input 
        id="post-data"
        name="post-data"
        type="hidden"
        value={postData}
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
        <button class="standard" on:click|preventDefault={toggleEditState}>
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