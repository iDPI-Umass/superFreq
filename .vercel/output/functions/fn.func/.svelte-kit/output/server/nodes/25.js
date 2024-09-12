import * as server from '../entries/pages/users/_page.server.ts.js';

export const index = 25;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/users/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/users/+page.server.ts";
export const imports = ["_app/immutable/nodes/25.BvP6AOpL.js","_app/immutable/chunks/scheduler.CXRP0wEC.js","_app/immutable/chunks/each.Chb-s0GO.js","_app/immutable/chunks/index.a6HmqSPn.js"];
export const stylesheets = ["_app/immutable/assets/25.DFYAU-sg.css"];
export const fonts = [];
