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
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
    interface NestedObject {
      [index: string]: any
    }
    interface ProfileObject {
      [index: string]: string 
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
  }
}

export {}