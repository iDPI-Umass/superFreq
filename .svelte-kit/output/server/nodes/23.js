import * as server from '../entries/pages/auth/confirm-sign-in/_page.server.ts.js';

export const index = 23;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/auth/confirm-sign-in/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/auth/confirm-sign-in/+page.server.ts";
export const imports = ["_app/immutable/nodes/23.B-c3oaZf.js","_app/immutable/chunks/Bg9kRutz.js","_app/immutable/chunks/CIC73nbL.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/D1sabymj.js","_app/immutable/chunks/pfHeeLMb.js","_app/immutable/chunks/26D3B16x.js"];
export const stylesheets = ["_app/immutable/assets/23.CV-S8Lip.css"];
export const fonts = [];
