<script lang="ts">
    import '$lib/styles/themes.css'
</script>

<div class="collection-builder">
    <div class="builder-header">
        <h1>
            new collection
        </h1>
    </div>
    <form class="form-box">
        <div class="form-block">
            <label class="text-label" for="title">
                collection name
            </label>
            <input class="text" type="text" name="title" id="title" required />
            <fieldset>
                <legend>Type of collection:</legend>
                <ul>
                    <li>
                        <input type="radio" name="type" id="artists" value="artists" />
                        <label for="artists">artists</label>
                    </li>
                    <li>
                        <input type="radio" name="type" id="albums" value="albums" />
                        <label for="albums">albums</label>
                    </li>
                    <li>
                        <input type="radio" name="type" id="tracks" value="tracks" />
                        <label for="tracks">tracks</label>
                    </li>
                </ul>
            </fieldset>
            <fieldset>
                <legend>Status of collection:</legend>
                <ul>
                    <li>
                        <input type="radio" name="status" id="open" value="open" />
                        <label for="open">open</label>
                    </li>
                    <li>
                        <input type="radio" name="status" id="public" value="public" />
                        <label for="public">public</label>
                    </li>
                    <li>
                        <input type="radio" name="status" id="private" value="private" />
                        <label for="private">private</label>
                    </li>
                </ul>
            </fieldset>

        </div>
        <div class="form-block">
            <label class="text-label" for="description">
                Collection Description
            </label>
            <textarea id="description" name="description" rows="10" cols="1" spellcheck=true required></textarea>
            <button class="double-border-top" type="submit">
                <div class="inner-border">
                    submit
                </div>
            </button>
        </div>
    </form>

</div>

<style>
    .collection-builder {
        width: var(--freq-max-width-primary);
        margin: 3vh 3vw;
        border: var(--freq-border-panel);
    }
    .builder-header {
        border-top: 1px solid var(--freq-color-background-badge);
        border-bottom: 1px solid var(--freq-color-background-badge);
        margin: 3px 0;
        align-items: center;
    }
    .builder-header h1 {
        margin: 2px;
        font-family: var(--freq-alt-font-family);
        text-transform: uppercase;
        font-size: var(--freq-font-size-medium);
        color: var(--freq-color-primary);
        padding: var(--freq-width-spacer-half);
    }
    form {
        display: flex;
        flex-direction: row;
        gap: var(--freq-width-spacer);
        padding: var(--freq-width-spacer);
    }
    form label.text-label {
        text-transform: uppercase;
    }
    form input {
        width: auto;
    }
    .form-block {
        display: flex;
        flex-direction: column;
        width: 100%;
    }


</style>