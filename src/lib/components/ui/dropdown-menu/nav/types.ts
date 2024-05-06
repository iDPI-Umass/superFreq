import type { Writable } from 'svelte/store'

export type NavOptions = { collapse: boolean }
export type ActiveId = string | null
export type CollapseContext = boolean
export type ActiveIdContext = Writable<ActiveId>
