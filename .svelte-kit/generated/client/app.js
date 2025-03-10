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
	() => import('./nodes/37')
];

export const server_loads = [0,3,2];

export const dictionary = {
		"/": [~5],
		"/about": [22],
		"/about/guidelines": [23],
		"/about/updates": [24],
		"/(authed)/account": [~10,[3]],
		"/(authed)/account/update-email": [~11,[3]],
		"/(authed)/account/update-username": [~12,[3]],
		"/auth/confirm-sign-in": [~25],
		"/auth/error": [~26],
		"/collections": [~30],
		"/collection/new": [~29,[4]],
		"/collection/[collectionId=integer]": [~27,[4]],
		"/collection/[collectionId=integer]/edit": [~28,[4]],
		"/create-profile": [~31],
		"/(authed)/feed": [~13,[3]],
		"/(authed)/feed/firehose": [~14,[3]],
		"/(admin)/moderation": [~6,[2]],
		"/posts": [~32],
		"/posts/now-playing/new": [~34],
		"/posts/[username]/now-playing/[timestamp]": [~33],
		"/(admin)/sandbox": [~7,[2]],
		"/(admin)/scripts": [~8,[2]],
		"/(authed)/sign-out": [~15,[3]],
		"/(admin)/tests/redirect": [9,[2]],
		"/users": [~35],
		"/(authed)/user/top-albums": [~21,[3]],
		"/(authed)/user/[username]": [~16,[3]],
		"/(authed)/user/[username]/collections-following": [~18,[3]],
		"/(authed)/user/[username]/collections": [~17,[3]],
		"/(authed)/user/[username]/now-playing-posts": [~19,[3]],
		"/(authed)/user/[username]/users-following": [~20,[3]],
		"/welcome": [~36],
		"/welcome/invite-request": [~37]
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