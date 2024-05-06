import { writable } from 'svelte/store'
import { setContext, getContext } from 'svelte'
import type {
	NavOptions,
	ActiveId,
	ActiveIdContext,
	CollapseContext
} from './types'

export function setNavOptions({ collapse }: NavOptions) {
	const activeComponentId = writable<ActiveId>(null)
	setContext<CollapseContext>('collapse', collapse)
	setContext<ActiveIdContext>('active', activeComponentId)
}

export function getNavOptions() {
	const collapse = getContext<CollapseContext>('collapse')
	const activeComponentId = getContext<ActiveIdContext>('active')
	return { collapse, activeComponentId }
}