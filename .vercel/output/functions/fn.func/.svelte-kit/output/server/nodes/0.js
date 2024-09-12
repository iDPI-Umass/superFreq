import * as universal from '../entries/pages/_layout.ts.js';
import * as server from '../entries/pages/_layout.server.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export { server };
export const server_id = "src/routes/+layout.server.ts";
export const imports = ["_app/immutable/nodes/0.DWXazUvx.js","_app/immutable/chunks/_commonjsHelpers.BosuxZz1.js","_app/immutable/chunks/17.Bb4s-aXr.js","_app/immutable/chunks/entry.a6gQbV6m.js","_app/immutable/chunks/scheduler.CXRP0wEC.js","_app/immutable/chunks/index.a6HmqSPn.js","_app/immutable/chunks/updater.C1ZFZVgO.js","_app/immutable/chunks/spread.CgU5AtxT.js","_app/immutable/chunks/helpers.CwfhyKXk.js","_app/immutable/chunks/rovingFocus.Cm4I5pJX.js","_app/immutable/chunks/Icon.3yADeopG.js","_app/immutable/chunks/each.Chb-s0GO.js"];
export const stylesheets = ["_app/immutable/assets/0.BCkxBAZO.css","_app/immutable/assets/metadata-formatting.CtHEyitU.css","_app/immutable/assets/posts.DyIiHDwj.css"];
export const fonts = [];
