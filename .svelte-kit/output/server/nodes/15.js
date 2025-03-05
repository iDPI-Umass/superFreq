import * as server from '../entries/pages/(authed)/user/_username_/collections/_page.server.ts.js';

export const index = 15;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(authed)/user/_username_/collections/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/(authed)/user/[username]/collections/+page.server.ts";
export const imports = ["_app/immutable/nodes/15.DswWOaCJ.js","_app/immutable/chunks/Bg9kRutz.js","_app/immutable/chunks/CIC73nbL.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/zPX_AMPA.js","_app/immutable/chunks/26D3B16x.js","_app/immutable/chunks/CZBN_KMn.js","_app/immutable/chunks/D1sabymj.js","_app/immutable/chunks/ChSzfhcg.js","_app/immutable/chunks/pfHeeLMb.js","_app/immutable/chunks/D8QYH9wd.js","_app/immutable/chunks/h0YdFdS4.js","_app/immutable/chunks/ChdiFDjO.js"];
export const stylesheets = ["_app/immutable/assets/PanelHeader.BLMeWQlM.css"];
export const fonts = [];
