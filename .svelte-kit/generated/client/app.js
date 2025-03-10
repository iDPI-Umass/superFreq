export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14'),
	() => import('./nodes/15'),
	() => import('./nodes/16'),
	() => import('./nodes/17'),
	() => import('./nodes/18'),
	() => import('./nodes/19'),
	() => import('./nodes/20'),
	() => import('./nodes/21'),
	() => import('./nodes/22'),
	() => import('./nodes/23'),
	() => import('./nodes/24'),
	() => import('./nodes/25'),
	() => import('./nodes/26'),
	() => import('./nodes/27'),
	() => import('./nodes/28'),
	() => import('./nodes/29'),
	() => import('./nodes/30'),
	() => import('./nodes/31'),
	() => import('./nodes/32'),
	() => import('./nodes/33'),
	() => import('./nodes/34'),
	() => import('./nodes/35'),
	() => import('./nodes/36'),
	() => import('./nodes/37'),
	() => import('./nodes/38')
];

export const server_loads = [0,3,2];

export const dictionary = {
		"/": [~5],
		"/about": [20],
		"/about/guidelines": [21],
		"/about/updates": [22],
		"/(authed)/account": [~8,[3]],
		"/(authed)/account/update-email": [~9,[3]],
		"/(authed)/account/update-username": [~10,[3]],
		"/auth/confirm-sign-in": [~23],
		"/auth/error": [~24],
		"/collections": [~28],
		"/collection/new": [~27,[4]],
		"/collection/[collectionId=integer]": [~25,[4]],
		"/collection/[collectionId=integer]/edit": [~26,[4]],
		"/create-profile": [~29],
		"/(authed)/feed": [~11,[3]],
		"/(authed)/feed/firehose": [~12,[3]],
		"/(admin)/moderation": [~6,[2]],
		"/posts": [~30],
		"/posts/now-playing/new": [~32],
		"/posts/[username]/now-playing/[timestamp]": [~31],
		"/(authed)/sign-out": [~13,[3]],
		"/(admin)/tests/redirect": [7,[2]],
		"/users": [~33],
		"/(authed)/user/top-albums": [~19,[3]],
		"/(authed)/user/[username]": [~14,[3]],
		"/(authed)/user/[username]/collections-following": [~16,[3]],
		"/(authed)/user/[username]/collections": [~15,[3]],
		"/(authed)/user/[username]/now-playing-posts": [~17,[3]],
		"/(authed)/user/[username]/users-following": [~18,[3]],
		"/welcome": [~34],
		"/welcome/invite-request": [~35],
		"/welcome/logo": [36],
		"/welcome/sandbox": [~37],
		"/welcome/scripts": [~38]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
	
	reroute: (() => {}),
	transport: {}
};

export const decoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.decode]));

export const hash = false;

export const decode = (type, value) => decoders[type](value);

export { default as root } from '../root.js';