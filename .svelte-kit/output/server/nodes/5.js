import * as server from '../entries/pages/_page.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.ts";
export const imports = ["_app/immutable/nodes/5.-lkI3k_H.js","_app/immutable/chunks/Bg9kRutz.js","_app/immutable/chunks/7L0UikBt.js","_app/immutable/chunks/BMOtZlnl.js","_app/immutable/chunks/DTR-vvU9.js","_app/immutable/chunks/BnBSThbm.js","_app/immutable/chunks/DMW5TJkn.js","_app/immutable/chunks/p4gWs_Co.js","_app/immutable/chunks/B5XxmIgL.js","_app/immutable/chunks/UYd2S9Kz.js","_app/immutable/chunks/hhzqsCZ2.js","_app/immutable/chunks/Cx9OOLl9.js","_app/immutable/chunks/DQhwN2bP.js","_app/immutable/chunks/Bk_Rsc9x.js","_app/immutable/chunks/D5l04mnW.js","_app/immutable/chunks/0wwrcJyA.js","_app/immutable/chunks/BEJXZZ8M.js","_app/immutable/chunks/Dklc7rJr.js","_app/immutable/chunks/DxhbvoRh.js","_app/immutable/chunks/BHMEdUko.js","_app/immutable/chunks/BrH-C3Kv.js"];
export const stylesheets = ["_app/immutable/assets/5.C1-x0Zcv.css","_app/immutable/assets/PanelHeader.BLMeWQlM.css","_app/immutable/assets/NotificationModal.x7h5i6_y.css"];
export const fonts = [];
