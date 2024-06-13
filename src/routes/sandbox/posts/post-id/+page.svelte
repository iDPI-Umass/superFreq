<script lang="ts">
    import '$lib/styles/posts.css'
    import NowPlayingPost from '$lib/components/NowPlayingPost.svelte'
    import PostReply from '$lib/components/PostReply.svelte'
    import PostReplyEditor from '$lib/components/PostReplyEditor.svelte'

    const sessionId = "789"

    const replies = [
        {
            "userId": "123",
            "displayName": "Cocteau Twin",
            "avatarUrl": "https://ia800500.us.archive.org/0/items/mbid-103a0641-976c-4329-99c4-9ede6c5d2002/mbid-103a0641-976c-4329-99c4-9ede6c5d2002-11610509397.jpg",
            "text": "oh wow I love this",
            "createdAt": "June 11, 2024",
            "status": "new",
            "reactions": [{
                "type": "like",
                "count": 12
            }]
        },
        {
            "userId": "456",
            "displayName": "Dr. Rock",
            "avatarUrl": "https://ia800309.us.archive.org/25/items/mbid-78e29dd4-7648-45a7-a57b-608e22bf4645/mbid-78e29dd4-7648-45a7-a57b-608e22bf4645-5321084795.jpg",
            "text": "do you know any other music like this?",
            "createdAt": "June 11, 2024",
            "status": "edited",
            "reactions": [{
                "type": "like",
                "count": 12
            }]
        },
        {
            "userId": "789",
            "displayName": "Sug",
            "avatarUrl": "https://ia801909.us.archive.org/7/items/mbid-39fe3778-362c-4762-89fc-c03235fd8117/mbid-39fe3778-362c-4762-89fc-c03235fd8117-4477004070.jpg",
            "text": "check out her other stuff",
            "createdAt": "June 11, 2024",
            "status": "new",
            "reactions": [{
                "type": "like",
                "count": 12
            }]
        }
    ]
</script>

<div class="post-panel">
    <NowPlayingPost></NowPlayingPost>
    <PostReplyEditor></PostReplyEditor>
    {#each replies as reply}
        <PostReply
            reply={reply}
            sessionId={sessionId}
        ></PostReply>
    {/each}
</div>

<style>
    .box {
        border: var(--freq-border-panel);
        border-top: none;
    }
</style>
