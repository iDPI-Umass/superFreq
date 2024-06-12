<script lang="ts">
    import '$lib/styles/posts.css'
    import NowPlayingPost from '$lib/components/NowPlayingPost.svelte'

    import Heart from 'lucide-svelte/icons/heart'
    import Flag from 'lucide-svelte/icons/flag'

    const replies = [
        {
            "userId": "123",
            "displayName": "Cocteau Twin",
            "avatarUrl": "https://ia800500.us.archive.org/0/items/mbid-103a0641-976c-4329-99c4-9ede6c5d2002/mbid-103a0641-976c-4329-99c4-9ede6c5d2002-11610509397.jpg",
            "text": "oh wow I love this",
            "createdAt": "June 11, 2024",
            "status": "new"
        },
        {
            "userId": "456",
            "displayName": "Dr. Rock",
            "avatarUrl": "https://ia800309.us.archive.org/25/items/mbid-78e29dd4-7648-45a7-a57b-608e22bf4645/mbid-78e29dd4-7648-45a7-a57b-608e22bf4645-5321084795.jpg",
            "text": "do you know any other music like this?",
            "createdAt": "June 11, 2024",
            "status": "edited"
        },
        {
            "userId": "789",
            "displayName": "sug",
            "avatarUrl": "https://ia801909.us.archive.org/7/items/mbid-39fe3778-362c-4762-89fc-c03235fd8117/mbid-39fe3778-362c-4762-89fc-c03235fd8117-4477004070.jpg",
            "text": "check out her other stuff",
            "createdAt": "June 11, 2024",
            "status": "new"
        }
    ]

    const reactions = [
        {
            "type": "like",
            "count": 12
        }
    ]
</script>

<div class="post-panel">
    <NowPlayingPost></NowPlayingPost>
    <div class="comment-panel">    
        {#each replies as reply}
            <div class="comment">
                <div class="comment-metadata">
                    <div class="row-group-user-data">
                        <img class="comment-avatar" src={reply.avatarUrl} alt={`${reply.displayName}'s avatar`} />
                        <div class="row-group-column">
                            <span class="comment-display-name">
                                {reply.displayName}
                            </span>
                            <span class="comment-date">
                                {reply.createdAt}
                            </span>
                        </div>

                    </div>
                    <div class="row-group">
                        {#if reply.status === "edited"}
                            <span class="status-badge">edited</span>
                        {/if}
                    </div>
                </div>
                <p class="comment-text">
                    {reply.text}
                </p>
                <div class="comment-reaction-row">
                    <div class="row-group">
                        {#each reactions as reaction}
                        <Heart size="16" color="var(--freq-color-text-muted)"></Heart>
                        <span>{reaction.count}</span>
                        {/each}
                    </div>
                    <Flag size="16" color="var(--freq-color-text-muted)"></Flag>
                </div>
            </div>
        {/each}
    </div>
</div>
