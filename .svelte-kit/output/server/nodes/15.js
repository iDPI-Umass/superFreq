import * as server from '../entries/pages/(authed)/user/_username_/collections/_page.server.ts.js';

export const index = 15;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(authed)/user/_username_/collections/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/(authed)/user/[username]/collections/+page.server.ts";
export const imports = ["_app/immutable/nodes/15.22nlr-g_.js","_app/immutable/chunks/Bg9kRutz.js","_app/immutable/chunks/7L0UikBt.js","_app/immutable/chunks/BMOtZlnl.js","_app/immutable/chunks/DTR-vvU9.js","_app/immutable/chunks/BnBSThbm.js","_app/immutable/chunks/DMW5TJkn.js","_app/immutable/chunks/BG_uBmGz.js","_app/immutable/chunks/DQhwN2bP.js","_app/immutable/chunks/BEJXZZ8M.js","_app/immutable/chunks/BrH-C3Kv.js","_app/immutable/chunks/D5l04mnW.js","_app/immutable/chunks/0wwrcJyA.js"];
export const stylesheets = ["_app/immutable/assets/PanelHeader.BLMeWQlM.css"];
export const fonts = [];
