<script lang="ts">
    import { enhance } from '$app/forms'
    import { interactionStates } from '$lib/resources/states.svelte';

    interface ComponentProps {
        postData: App.RowData
    }
    let { 
        postData,
    }: ComponentProps = $props()

    function toggleEditState() {
        interactionStates.editState = !interactionStates.editState
    }

    let loading = $state(false)
</script>

<!-- <svelte:options runes={true} /> -->

<form 
    method="POST" 
    name="editPostText" 
    class="vertical" 
    action="?/editPost" 
    use:enhance={() => {
        loading = true
        return async ({ update }) => {
            toggleEditState()
            loading = false
            await update()
        }}
    }
>
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
        <button 
            class="standard" 
            onclick={toggleEditState}
        >
            cancel
        </button>
        <button
            type="submit"
            class="standard" 
            formaction="?/editPost"
            disabled={loading}
        >
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