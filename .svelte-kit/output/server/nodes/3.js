import * as server from '../entries/pages/(authed)/_layout.server.ts.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/(authed)/+layout.server.ts";
export const imports = ["_app/immutable/nodes/3.DjjOM4ll.js","_app/immutable/chunks/B4yzidyb.js","_app/immutable/chunks/Bg9kRutz.js","_app/immutable/chunks/7L0UikBt.js","_app/immutable/chunks/DMW5TJkn.js","_app/immutable/chunks/0wwrcJyA.js"];
export const stylesheets = [];
export const fonts = [];
