import * as server from '../entries/pages/auth/confirm-sign-in/_page.server.ts.js';

export const index = 23;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/auth/confirm-sign-in/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/auth/confirm-sign-in/+page.server.ts";
export const imports = ["_app/immutable/nodes/23.CZXT9aMI.js","_app/immutable/chunks/Bg9kRutz.js","_app/immutable/chunks/7L0UikBt.js","_app/immutable/chunks/DMW5TJkn.js","_app/immutable/chunks/BEJXZZ8M.js","_app/immutable/chunks/DTR-vvU9.js"];
export const stylesheets = ["_app/immutable/assets/23.CV-S8Lip.css"];
export const fonts = [];
