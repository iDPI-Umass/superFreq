import * as server from '../entries/pages/(authed)/_layout.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/(authed)/+layout.server.ts";
export const imports = ["_app/immutable/nodes/2.C7C82AVu.js","_app/immutable/chunks/scheduler.CXRP0wEC.js","_app/immutable/chunks/index.a6HmqSPn.js"];
export const stylesheets = [];
export const fonts = [];
