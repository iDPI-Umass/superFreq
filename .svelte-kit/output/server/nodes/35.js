import * as server from '../entries/pages/welcome/sandbox/_page.server.ts.js';

export const index = 35;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/welcome/sandbox/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/welcome/sandbox/+page.server.ts";
export const imports = ["_app/immutable/nodes/35.CqFWMRxw.js","_app/immutable/chunks/Bg9kRutz.js","_app/immutable/chunks/69_IOA4Y.js","_app/immutable/chunks/DIeogL5L.js"];
export const stylesheets = [];
export const fonts = [];
