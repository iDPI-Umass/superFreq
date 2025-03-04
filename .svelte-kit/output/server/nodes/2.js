import * as server from '../entries/pages/(admin)/_layout.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/(admin)/+layout.server.ts";
export const imports = ["_app/immutable/nodes/2.BP3yosDH.js","_app/immutable/chunks/D4u8frmK.js","_app/immutable/chunks/Bg9kRutz.js","_app/immutable/chunks/CIC73nbL.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/D1sabymj.js","_app/immutable/chunks/ChdiFDjO.js"];
export const stylesheets = [];
export const fonts = [];
