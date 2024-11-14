<script lang="ts">
    import RedirectModal from "src/lib/components/modals/RedirectModal.svelte"

    let delay = $state(5)
    let showModal = $state(false)
    let countdown = $state(0)

    $effect(() => {
        if ( showModal ) {
            countdown = delay
            setInterval(() => countdown -= 1, 1000)
        }
    })
</script>

<div class="panel">
    <button class="standard" onclick={() => showModal = true}>
        redirect
    </button>
</div>

<RedirectModal
    bind:showModal={showModal}
    redirectPath='/'
    delay={delay}
>
    {#snippet headerText()}
        header text
    {/snippet}
    {#snippet message()}
        redirecting in {countdown} seconds
    {/snippet}
</RedirectModal>