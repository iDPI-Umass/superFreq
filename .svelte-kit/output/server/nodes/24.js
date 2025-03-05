import * as server from '../entries/pages/auth/error/_page.server.ts.js';

export const index = 24;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/auth/error/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/auth/error/+page.server.ts";
export const imports = ["_app/immutable/nodes/24.DCsPHSB7.js","_app/immutable/chunks/Bg9kRutz.js","_app/immutable/chunks/7L0UikBt.js","_app/immutable/chunks/DMW5TJkn.js","_app/immutable/chunks/p4gWs_Co.js"];
export const stylesheets = [];
export const fonts = [];
