import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals: { supabase, session }}) => {
    const id = session?.user.id

    const { data } = await supabase
    .from("profiles")
    .select(`
        id,
        about,
        top_albums_collection_id,
        website,
        aggregate_collection_contents!top_albums_collection_id(*)
    `)
    .eq("id", id)

    let collectionContents: object[] = []

    for ( const item of data ) {
        collectionContents = [...collectionContents, item["aggregate_collection_contents"]]
    }
    console.log(data)

    return {collectionContents}
}