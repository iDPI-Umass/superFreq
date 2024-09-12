import * as server from '../entries/pages/collections/_page.server.ts.js';

export const index = 21;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/collections/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/collections/+page.server.ts";
export const imports = ["_app/immutable/nodes/21.CJnQ6Gx8.js","_app/immutable/chunks/scheduler.CXRP0wEC.js","_app/immutable/chunks/each.Chb-s0GO.js","_app/immutable/chunks/index.a6HmqSPn.js","_app/immutable/chunks/forms.CTZFOOt3.js","_app/immutable/chunks/entry.a6gQbV6m.js"];
export const stylesheets = ["_app/immutable/assets/21.CEZv0th-.css"];
export const fonts = [];
