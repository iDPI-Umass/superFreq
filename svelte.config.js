import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.svx', '.md'],
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [
		vitePreprocess(), 
		mdsvex({ 
			extensions: ['.svx', '.md'],
		})
	],
	compilerOptions: {
		runes: true
	},
	kit: {
		adapter: adapter(),
		alias: {
			'src/*': 'src/*',
			'./$types': './$types'
		},
		csrf: {
			checkOrigin: true
		}
	}
};

export default config;
