import * as server from '../entries/pages/collection/_collectionId_integer_/_page.server.ts.js';

export const index = 18;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/collection/_collectionId_integer_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/collection/[collectionId=integer]/+page.server.ts";
export const imports = ["_app/immutable/nodes/18.CGS9jeJ-.js","_app/immutable/chunks/scheduler.CXRP0wEC.js","_app/immutable/chunks/index.a6HmqSPn.js","_app/immutable/chunks/entry.a6gQbV6m.js","_app/immutable/chunks/stores.CEzU2-k9.js","_app/immutable/chunks/updater.C1ZFZVgO.js","_app/immutable/chunks/spread.CgU5AtxT.js","_app/immutable/chunks/rovingFocus.Cm4I5pJX.js","_app/immutable/chunks/Icon.3yADeopG.js","_app/immutable/chunks/each.Chb-s0GO.js","_app/immutable/chunks/GridList.Bf6pcDOU.js","_app/immutable/chunks/index.CvmYViMX.js"];
export const stylesheets = ["_app/immutable/assets/18.BqDUBaBN.css","_app/immutable/assets/metadata-formatting.CtHEyitU.css","_app/immutable/assets/GridList.Bb-2nD9b.css"];
export const fonts = [];
