<script lang="ts">
    import Settings from 'lucide-svelte/icons/settings'
    // import repeatGrid from '../lib/assets/images/repeat-grid-2.svg'
    import GridList from "$lib/components/GridList.svelte"
</script>

<div class="profile-info">
    <div class="info-box-left">
        <img src="https://ia800303.us.archive.org/30/items/mbid-5f077d5b-711e-37c7-93a4-c505e5b66f18/mbid-5f077d5b-711e-37c7-93a4-c505e5b66f18-18660912169.jpg" alt="avatar" />
        <div class="info-box-column">
            <div class="username-buttons-row">
                <div class="displayname-username-column">
                    <h1>Display Name</h1>
                    <p class="data-muted">Username</p>
                </div>
                <div class="buttons-group">
                    <button class="double-border-top">
                        <div class="inner-border-condensed">
                            edit profile
                        </div>
                    </button>
                    <button class="double-border-top">
                        <div class="inner-border-condensed">
                            <div class="icon">
                                <Settings size="16"></Settings>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
            <p>profile text</p>
        </div>
    </div>
    <div class="info-box-right">
        <div class="stats-box" aria-label="user metrics">
            <div class="metric" aria-label="metric">
                <div class="numeral">
                    <p class="metric-numerals">
                        400
                    </p>
                </div>
                <p class="data-muted-uppercase">
                    albums 
                </p>
            </div>
            <div class="metric" aria-label="metric">
                <div class="numeral">
                    <p class="metric-numerals">
                        400
                    </p>
                </div>
                <p class="data-muted-uppercase">
                    albums 
                </p>
            </div>
            <div class="metric" aria-label="metric">
                <div class="numeral">
                    <p class="metric-numerals">
                        400
                    </p>
                </div>
                <p class="data-muted-uppercase">
                    albums 
                </p>
            </div>
            <div class="metric" aria-label="metric">
                <div class="numeral">
                    <p class="metric-numerals">
                        400
                    </p>
                </div>
                <p class="data-muted-uppercase">
                    albums 
                </p>
            </div>
            <div class="metric" aria-label="metric">
                <div class="numeral">
                    <p class="metric-numerals">
                        400
                    </p>
                </div>
                <p class="data-muted-uppercase">
                    albums 
                </p>
            </div>
        </div>
    </div>
</div>
<div class="border-full-vw"></div>

<style>
    .stats-box {
        --grid: url('$lib/assets/images/repeat-grid-2.svg')
    }
    .profile-info {
        display: flex;
        flex-direction: row;
        width: 100%;
    }
    .profile-info img {
        width: var(--freq-image-thumbnail-medium);
        height: var(--freq-image-thumbnail-medium);
    }
    .profile-info h1{
        font-size: var(--freq-font-size-medium);
    }
    .info-box-left {
        display: flex;
        flex-direction: row;
        min-width: 40%;
        max-width: 50%;
        margin: var(--freq-height-spacer) var(--freq-width-spacer-half) var(--freq-height-spacer) var(--freq-width-spacer);
        gap: var(--freq-spacer-gap);
        align-items: start;
    }
    .info-box-column {
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: var(--freq-inline-gap);
    }
    .username-buttons-row {
        display: flex;
        flex-direction: row;
        width: auto;
        align-items: start;
        justify-content: space-between;
    }
    .displayname-username-column {
        display: flex;
        flex-direction: column;
    }
    .displayname-username-column * {
        padding: 0;
        margin: 0;
    }
    .buttons-group {
        display: flex;
        flex-direction: row;
        margin-left: auto;
        margin-right: 4px;
        gap: var(--freq-spacer-gap-half);
    }
    .icon {
        display: flex;
        height: 11px;
        align-items: center;
    }
    .info-box-right {
        display: flex;
        flex-direction: row;
        max-width: 50%;
        border-left: var(--freq-border-panel);
        margin-top: -5px;
        align-items: flex-start;
    }
    .stats-box {
        display: flex;
        flex-direction: row;
        margin: var(--freq-spacing-x-large) var(--freq-spacing-large);
        padding: var(--freq-spacing-medium);
        background: var(--grid) 0% 0% no-repeat padding-box;
        gap: var(--freq-spacer-gap);
        align-items: center;
    }
    .metric {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--freq-spacer-gap-quarter);
    }
    .metric * {
        margin: 0px;
        padding: 0px;
    }
    .metric .numeral {
        display: flex;
        flex-direction: column;
        background: var(--freq-color-panel-background); 
        padding: 0px 10px;
    }
    .profile-module {
        display: flex;
        flex-direction: column;
        border: var(--freq-border-panel);
    }
    .profile-module-header {
        margin-top: 3px;
        border-top: var(--freq-border-panel);
        border-bottom: var(--freq-border-panel);
    }
</style>