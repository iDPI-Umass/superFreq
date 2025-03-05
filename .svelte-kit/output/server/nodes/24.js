import * as server from '../entries/pages/auth/error/_page.server.ts.js';

export const index = 24;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/auth/error/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/auth/error/+page.server.ts";
export const imports = ["_app/immutable/nodes/24.DmryXHR9.js","_app/immutable/chunks/Bg9kRutz.js","_app/immutable/chunks/CIC73nbL.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/D1sabymj.js","_app/immutable/chunks/w9zPIjBD.js"];
export const stylesheets = [];
export const fonts = [];
