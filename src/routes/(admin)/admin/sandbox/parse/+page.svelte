<script lang="ts">
    import { fetchHtml, parseBandcampHtml } from "$lib/resources/parseData"

    let listenUrl = $state('')

    let bandcampData = $state({})
    let timeout = null

    let i = $state(0)

    async function getBandcampData ( listenUrl: string ) {
        clearTimeout(timeout)
        i++
        console.log('input ', i)
        timeout = await setTimeout(async function() {
            console.log('delayed by 5 seconds')
            bandcampData = await parseBandcampHtml(listenUrl)
            console.log(bandcampData)
            return bandcampData
        }, 5000)
    }
</script>

<div class="panel">
    <form method="POST" class="vertical">
        <div class="tooltip-group">
            <label 
                class="text-label" 
                for="listen-url"
            >
                listen link
            </label>
        </div>
        <input
            oninput={() => getBandcampData(listenUrl)}
            class="text" 
            id="listen-url" 
            name="listen-url" 
            type="url"
            placeholder="paste link" 
            bind:value={listenUrl}
        />
    </form>
</div>