import * as server from '../entries/pages/(authed)/user/_username_/collections/_page.server.ts.js';

export const index = 11;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(authed)/user/_username_/collections/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/(authed)/user/[username]/collections/+page.server.ts";
export const imports = ["_app/immutable/nodes/11.BF_BMFNG.js","_app/immutable/chunks/scheduler.CXRP0wEC.js","_app/immutable/chunks/each.Chb-s0GO.js","_app/immutable/chunks/index.a6HmqSPn.js"];
export const stylesheets = [];
export const fonts = [];
