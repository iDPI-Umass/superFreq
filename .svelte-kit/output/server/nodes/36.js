import * as server from '../entries/pages/welcome/scripts/_page.server.ts.js';

export const index = 36;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/welcome/scripts/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/welcome/scripts/+page.server.ts";
export const imports = ["_app/immutable/nodes/36.BWWZAFV9.js","_app/immutable/chunks/Bg9kRutz.js","_app/immutable/chunks/DMW5TJkn.js","_app/immutable/chunks/7L0UikBt.js"];
export const stylesheets = [];
export const fonts = [];
