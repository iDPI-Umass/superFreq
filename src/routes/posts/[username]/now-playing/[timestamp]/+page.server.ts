import { redirect } from '@sveltejs/kit'
import { parseISO } from "date-fns"
import type { PageServerLoad, Actions } from './$types'
import { selectPostAndReplies, insertPost, updatePost, deletePost, insertUpdateReaction, selectPostReplies } from '$lib/resources/backend-calls/posts'
import { insertPostFlag } from '$lib/resources/backend-calls/users'
import { selectListSessionUserCollections, saveItemToCollection } from 'src/lib/resources/backend-calls/collections.js'

let loadData = true

let post: App.RowData = {}
let postId: string
let postUsername: string
let postCreatedAt: string
let postTimestamp: string
let postReplies: App.RowData[]

let updateReaction: boolean
let reactionActive: boolean
let postReactionCount: number
let editPost: boolean
let editedText: string

let collections = [] as App.RowData[]

export const load: PageServerLoad = async ({ params, parent, locals: { safeGetSession } }) => {

    const session = await safeGetSession()

    const { profile } = await parent()

    let username = profile?.username ?? null

    if ( !session.session ) {
        throw redirect(307, '/')
    }
    else if( session.session && !username ) {
        throw redirect(307, '/create-profile')
    }
    
    const sessionUserId = session.user?.id as string

    username = params.username
    const timestamp = parseInt(params.timestamp)
    const timestampString = new Date(timestamp).toISOString()
    const postType = "now_playing"

    let replies: App.RowData[] = []
    let permission: boolean = true

    if ( loadData ) {
        const select = await selectPostAndReplies( sessionUserId, username, timestampString, postType )

        post = select.post as App.RowData
        replies = select.replies as App.RowData[]
        permission = select.permission as boolean
    
        if ( !permission ) {
            return { sessionUserId: null, post: null, postReactionActive: null, replies: null }
        }
    
        postId = post?.id as string
        postUsername = post?.username as string
        postCreatedAt = post?.created_at.toISOString()
        postTimestamp = Date.parse(postCreatedAt).toString()
        postReplies = replies as App.RowData[]
    }

    if ( updateReaction ) {
        updateReaction = false
        loadData = true

        post.reaction_active = reactionActive
        post.reaction_count = postReactionCount
    }

    if ( editPost ) {
        editPost = false
        loadData = true

        post.text = editedText
    }

    return { sessionUserId, post, postReplies, collections }
}

export const actions = {
    submitReply: async ({ request, locals: { safeGetSession }})=> {
        const session = await safeGetSession()
        const sessionUserId = session.user?.id as string

        const timestampISOString: string = new Date().toISOString()
        const timestampISO: Date = parseISO(timestampISOString)

        const data = await request.formData()
        const replyText = data.get('reply-text') as string

        const postData = {
            user_id: sessionUserId,
            type: "reply",
            status: "new",
            text: replyText,
            created_at: timestampISO,
            updated_at: timestampISO,
            parent_post_id: postId,
        }

        const { username, createdAt} = await insertPost( postData )

        const commentTimestampSlug = createdAt.toString()
        const commentTimestamp = Date.parse(commentTimestampSlug).toString()
        const permalink = `/posts/${postUsername}/now-playing/${postTimestamp}#${username.concat(commentTimestamp)}`

        if (createdAt) {
            throw redirect(303, permalink)
        }
        else { 
            return { success: false }
        }
    },
    submitReaction: async ({ request, locals: { safeGetSession }}) => {
        const session = await safeGetSession()
        const sessionUserId = session.user?.id as string
        const data = await request.formData()
        const reactionType = data.get('reaction-type') as string

        const { reaction, reactionCount } = await insertUpdateReaction( sessionUserId, postId, reactionType )

        reactionActive = reaction?.active
        postReactionCount = reactionCount as number

        const success = reaction ? true : false

        updateReaction = success ? true : false
        loadData = success ? false : true

        return { success, reactionActive, reactionCount }

    },
    editPost: async ({ request, locals: { safeGetSession } }) => {

        const session = await safeGetSession()
        const sessionUserId = session.user?.id as string

        const data = await request.formData()
        editedText = data.get('edited-text') as string
        const postData = JSON.parse(data.get('post-data') as string) as App.RowData

        const submitEdit = await updatePost( sessionUserId, postData, editedText )

        const success =  submitEdit ? true : false
        const editState = submitEdit ? false : true

        editedText = success ? submitEdit.text as string : editedText
        editPost = success ? true : false
        loadData = success ? false : true

        return { success, editState }
    },
    deletePost: async ({ request, locals: { safeGetSession } }) => {
        const session = await safeGetSession()
        const sessionUserId = session.user?.id as string

        const data = await request.formData()
        const postId = data.get('post-reply-id') as string ?? data.get('post-id') as string

        const submitDelete = await deletePost( sessionUserId, postId )

        const parentPostId = submitDelete?.parent_post_id

        const permalink = parentPostId ? `/posts/${postUsername}/now-playing/${postTimestamp}` : '/'

        if ( submitDelete ) {
            throw redirect(303, permalink)
        }
        else { 
            return { success: false }
        }

    },
    flagPost: async ({ request, locals: { safeGetSession }}) => {
        const session = await safeGetSession()
        const sessionUserId = session.user?.id as string

        const data = await request.formData()
        const postId = data.get('post-reply-id') as string ?? data.get('post-id') as string

        const flag = await insertPostFlag( sessionUserId, postId )

        const success = flag ? true : false

        return { success }
    },
    getCollectionList: async ({ locals: { safeGetSession }}) => {
        const session = await safeGetSession()
        const sessionUserId = session.user?.id as string

        if ( collections.length == 0 ) {
            collections = await selectListSessionUserCollections(sessionUserId)
        }
        return { showCollectionsModal: true }
    },
    saveToCollection: async ({ request, locals: { safeGetSession }}) => {
        const session = await safeGetSession()
        const sessionUserId = session.user?.id as string

        const data = await request.formData()
        const collectionId = data.get('collection-id') as string
        const artistMbid = data.get('artist-mbid') as string
        const releaseGroupMbid = data.get('release-group-mbid') as string
        const recordingMbid = data.get('recording-mbid') as string
        const itemType = data.get('item-type') as string
        const fromPostId = data.get('saved-from-post') as string
        const fromCollectionId = data.get('saved-from-collection') as string

        function validStringCheck ( value: string ) {
            if ( value.length > 0 ) {
                return value
            }
            else return null
        }
        const item = {
            artist_mbid: artistMbid ?? null,
            release_group_mbid: validStringCheck(releaseGroupMbid),
            recording_mbid: validStringCheck(recordingMbid),
            item_type: itemType,
            from_post_id: validStringCheck(fromPostId),
            from_collection_id: validStringCheck(fromCollectionId)
        }

        const update = await saveItemToCollection( sessionUserId, item, collectionId )

        return { updateSuccess: update }
    }
} satisfies Actions