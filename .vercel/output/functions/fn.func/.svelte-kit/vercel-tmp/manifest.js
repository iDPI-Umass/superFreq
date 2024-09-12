export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([".DS_Store","favicon.ico","fonts/.DS_Store","fonts/KronaOne-Regular.ttf","fonts/Roboto-Black.ttf","fonts/Roboto-BlackItalic.ttf","fonts/Roboto-Bold.ttf","fonts/Roboto-BoldItalic.ttf","fonts/Roboto-Italic.ttf","fonts/Roboto-Light.ttf","fonts/Roboto-LightItalic.ttf","fonts/Roboto-Medium.ttf","fonts/Roboto-MediumItalic.ttf","fonts/Roboto-Regular.ttf","fonts/Roboto-Thin.ttf","fonts/Roboto-ThinItalic.ttf","images/logo/freq-logo-dark.png","images/logo/freq-logo-dark.svg","texts/home-intro.md"]),
	mimeTypes: {".ttf":"font/ttf",".png":"image/png",".svg":"image/svg+xml",".md":"text/markdown"},
	_: {
		client: {"start":"_app/immutable/entry/start.omqgA9NH.js","app":"_app/immutable/entry/app.B_y-lCKs.js","imports":["_app/immutable/entry/start.omqgA9NH.js","_app/immutable/chunks/entry.a6gQbV6m.js","_app/immutable/chunks/scheduler.CXRP0wEC.js","_app/immutable/entry/app.B_y-lCKs.js","_app/immutable/chunks/17.Bb4s-aXr.js","_app/immutable/chunks/scheduler.CXRP0wEC.js","_app/immutable/chunks/index.a6HmqSPn.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('../output/server/nodes/0.js')),
			__memo(() => import('../output/server/nodes/1.js')),
			__memo(() => import('../output/server/nodes/2.js')),
			__memo(() => import('../output/server/nodes/3.js')),
			__memo(() => import('../output/server/nodes/4.js')),
			__memo(() => import('../output/server/nodes/5.js')),
			__memo(() => import('../output/server/nodes/6.js')),
			__memo(() => import('../output/server/nodes/7.js')),
			__memo(() => import('../output/server/nodes/8.js')),
			__memo(() => import('../output/server/nodes/9.js')),
			__memo(() => import('../output/server/nodes/10.js')),
			__memo(() => import('../output/server/nodes/11.js')),
			__memo(() => import('../output/server/nodes/12.js')),
			__memo(() => import('../output/server/nodes/13.js')),
			__memo(() => import('../output/server/nodes/14.js')),
			__memo(() => import('../output/server/nodes/15.js')),
			__memo(() => import('../output/server/nodes/16.js')),
			__memo(() => import('../output/server/nodes/17.js')),
			__memo(() => import('../output/server/nodes/18.js')),
			__memo(() => import('../output/server/nodes/19.js')),
			__memo(() => import('../output/server/nodes/20.js')),
			__memo(() => import('../output/server/nodes/21.js')),
			__memo(() => import('../output/server/nodes/22.js')),
			__memo(() => import('../output/server/nodes/23.js')),
			__memo(() => import('../output/server/nodes/24.js')),
			__memo(() => import('../output/server/nodes/25.js')),
			__memo(() => import('../output/server/nodes/26.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/about",
				pattern: /^\/about\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 16 },
				endpoint: null
			},
			{
				id: "/(authed)/account",
				pattern: /^\/account\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/(authed)/account/create-profile",
				pattern: /^\/account\/create-profile\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/(authed)/account/update-email",
				pattern: /^\/account\/update-email\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/(authed)/account/update-username",
				pattern: /^\/account\/update-username\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/auth/check",
				pattern: /^\/auth\/check\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/auth/check/_server.ts.js'))
			},
			{
				id: "/auth/confirm",
				pattern: /^\/auth\/confirm\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/auth/confirm/_server.ts.js'))
			},
			{
				id: "/auth/signout",
				pattern: /^\/auth\/signout\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 17 },
				endpoint: null
			},
			{
				id: "/collections",
				pattern: /^\/collections\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 21 },
				endpoint: null
			},
			{
				id: "/collection/new",
				pattern: /^\/collection\/new\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 20 },
				endpoint: null
			},
			{
				id: "/collection/[collectionId=integer]",
				pattern: /^\/collection\/([^/]+?)\/?$/,
				params: [{"name":"collectionId","matcher":"integer","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 18 },
				endpoint: null
			},
			{
				id: "/collection/[collectionId=integer]/edit",
				pattern: /^\/collection\/([^/]+?)\/edit\/?$/,
				params: [{"name":"collectionId","matcher":"integer","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 19 },
				endpoint: null
			},
			{
				id: "/(authed)/feed",
				pattern: /^\/feed\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/posts",
				pattern: /^\/posts\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 22 },
				endpoint: null
			},
			{
				id: "/posts/now-playing/new",
				pattern: /^\/posts\/now-playing\/new\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 24 },
				endpoint: null
			},
			{
				id: "/posts/[username]/now-playing/[timestamp]",
				pattern: /^\/posts\/([^/]+?)\/now-playing\/([^/]+?)\/?$/,
				params: [{"name":"username","optional":false,"rest":false,"chained":false},{"name":"timestamp","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 23 },
				endpoint: null
			},
			{
				id: "/(authed)/sign-out",
				pattern: /^\/sign-out\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/users",
				pattern: /^\/users\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 25 },
				endpoint: null
			},
			{
				id: "/(authed)/user/top-albums",
				pattern: /^\/user\/top-albums\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 15 },
				endpoint: null
			},
			{
				id: "/(authed)/user/[username]",
				pattern: /^\/user\/([^/]+?)\/?$/,
				params: [{"name":"username","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/(authed)/user/[username]/collections-following",
				pattern: /^\/user\/([^/]+?)\/collections-following\/?$/,
				params: [{"name":"username","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 12 },
				endpoint: null
			},
			{
				id: "/(authed)/user/[username]/collections",
				pattern: /^\/user\/([^/]+?)\/collections\/?$/,
				params: [{"name":"username","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/(authed)/user/[username]/now-playing-posts",
				pattern: /^\/user\/([^/]+?)\/now-playing-posts\/?$/,
				params: [{"name":"username","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 13 },
				endpoint: null
			},
			{
				id: "/(authed)/user/[username]/users-following",
				pattern: /^\/user\/([^/]+?)\/users-following\/?$/,
				params: [{"name":"username","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 14 },
				endpoint: null
			},
			{
				id: "/welcome",
				pattern: /^\/welcome\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 26 },
				endpoint: null
			}
		],
		matchers: async () => {
			const { match: integer } = await import ('../output/server/entries/matchers/integer.js')
			return { integer };
		},
		server_assets: {}
	}
}
})();
