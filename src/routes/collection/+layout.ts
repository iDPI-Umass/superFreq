import type { LayoutLoad } from './$types';

export const load: LayoutLoad = () => {
	const infoBoxText = {
		open: 'This is an open collection. Anyone can edit it.',
		private: 'This is a private collection. Only you can see it.'
	} as App.StringLookupObject;
	return { infoBoxText };
};
