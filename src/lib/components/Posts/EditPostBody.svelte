<script lang="ts">
    export let text: string
    export let editState: boolean = false

    function toggleEditState() {
        editState = !editState
    }
</script>

<form name="editPostText" class="vertical">
    <textarea
        rows="4"
        cols="1"
        spellcheck=true 
        placeholder="Reply..."
        required
    >{text}</textarea>
    <div class="edit-submit-options">
        <button class="standard" on:click|preventDefault={toggleEditState}>
            cancel
        </button>
        <button class="standard">
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