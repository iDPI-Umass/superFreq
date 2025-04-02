import adapter from '@sveltejs/adapter-vercel';
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
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter(
		// 	{
		// 	routes: {
		// 		include: ['/*'],
		// 		exclude: ['<all>']
		// 	},
		// 	platformProxy: {
		// 		configPath: 'wrangler.jsonc',
		// 		environment: undefined,
		// 		experimentalJsonConfig: false,
		// 		persist: false,
		// 		platform: 'node',
		// 	}
		// }
		),
		alias: {
			'src/*': 'src/*',
			'./$types': './$types'
		},
		csp: {
			directives: {
				'script-src': ['self']
			},
			// must be specified with either the `report-uri` or `report-to` directives, or both
			reportOnly: {
				'script-src': ['self'],
				'report-uri': ['/']
			}
		},
		csrf: {
			checkOrigin: true
		}
	}
};

export default config;
