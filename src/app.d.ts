import type { Session, SupabaseClient, User } from '@supabase/supabase-js'

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      supabase: SupabaseClient
      safeGetSession: () => Promise<{ session: Session | null; user: User | null }>
      session: Session | null
      user: User | null
    }
    // interface PageData {
    //   session: Session | null
    // }
    // interface PageState {}
    // interface Platform {}
    interface NestedObject {
      [index: string]: any
    }
    interface ProfileObject {
      [index: string]: string | null
    }
    interface Lookup {
      [index: string]: string | string[] | number | number[]
    }
    interface StringLookupObject {
      [index: string]: string 
    }

    interface NumberLookup {
      [index: string]: number 
    }
    interface RowData {
      [index: string]: string | Date | number | bigint | boolean | JsonArray | JsonObject | null | Changelog 
    }
    interface CollectionItem {
      [index: string]: string | Date | number
    }
    interface UserData {
      [index: string]: string | Date | number
    }
    interface Changelog {
      [index: string]: RowData
    }
    interface Embed {
      [index: string]: string | null
    }
    interface Platform {
      env: Env
      cf: CfProperties
      ctx: ExecutionContext
    }
  }
}

declare module '*.md' {
	import type { SvelteComponent } from 'svelte'

	export default class Comp extends SvelteComponent{}

	export const metadata: Record<string, unknown>
}

export {}