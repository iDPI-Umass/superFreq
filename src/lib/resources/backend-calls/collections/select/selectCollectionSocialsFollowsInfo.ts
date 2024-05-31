/* 
Get social graph for collection
*/

export const selectCollectionSocialsFollowsInfo = async function ( { collectionId, sessionUserId, locals: {supabase}}: { collectionId: number, sessionUserId: string, locals: { supabase: App.Locals["supabase"] }} ) {

    /* Get contents from collections_contents using collection_id */
    const select = supabase
    .from( "collections_social" )
    .select(`
        *,
        profiles!collections_social_user_id_fkey ( 
            id,
            username,
            display_name,
            avatar_url
        )
    `)
    .match({ collection_id: collectionId, user_id: sessionUserId });

    const response = await select;
    const socialData = response.data;
    const socialResponseStatus = response.status;

    if (response.status === 200) {
        return { socialData, socialResponseStatus };
    }
    if ( response.status === 404 ) {
        console.warn( `Collection contents for ${ collectionId } not found` );
        return socialResponseStatus;
    }
    throw new Error( `Unexpected response ${ response.error }`);

}