<script lang="ts">
    import ListenEmbed from '$lib/components/Posts/ListenEmbed.svelte'
</script>

<form method="POST" action="?/submitUrl">
    <input 
        type="text"
        name="url"
        id="url"
    />
    <button class="standard" formaction="?/submitUrl">
        submit
    </button>
</form>