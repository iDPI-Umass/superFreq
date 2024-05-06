import type { PageServerLoad } from "../../../../routes/$types";

export const load: PageServerLoad = async ({ locals: {supabase, getSession} }) => {
    const session = await getSession()
    const { user: { id }} = session

    const select = supabase
    .from("profiles")
    .select()
    .eq("id", id)

    const { data } = await select
    let displayName = ""
    
    if (session) {
        displayName = data["display_name"]
    }

	return {
		displayName, session
	}
}