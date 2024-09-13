<div class="reply-editor">
    <form name="submitReply" id="submitReply" class="reply" method="post" action="?/submitReply">
        <textarea
            rows="4"
            cols="1"
            id="reply-text"
            name="reply-text"
            spellcheck=true 
            placeholder="Reply..."
            required
        ></textarea>
        <button class="standard" formaction="?/submitReply">
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