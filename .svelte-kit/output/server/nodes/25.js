import * as server from '../entries/pages/collection/_collectionId_integer_/_page.server.ts.js';

export const index = 25;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/collection/_collectionId_integer_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/collection/[collectionId=integer]/+page.server.ts";
export const imports = ["_app/immutable/nodes/25.VS3x5CFo.js","_app/immutable/chunks/Bg9kRutz.js","_app/immutable/chunks/7L0UikBt.js","_app/immutable/chunks/DQhwN2bP.js","_app/immutable/chunks/BMOtZlnl.js","_app/immutable/chunks/DTR-vvU9.js","_app/immutable/chunks/BnBSThbm.js","_app/immutable/chunks/DMW5TJkn.js","_app/immutable/chunks/p4gWs_Co.js","_app/immutable/chunks/BG_uBmGz.js","_app/immutable/chunks/D82K48Y3.js","_app/immutable/chunks/BEJXZZ8M.js","_app/immutable/chunks/BrH-C3Kv.js","_app/immutable/chunks/BHMEdUko.js","_app/immutable/chunks/Cx9OOLl9.js","_app/immutable/chunks/hhzqsCZ2.js","_app/immutable/chunks/Bk_Rsc9x.js","_app/immutable/chunks/CDezdSdg.js","_app/immutable/chunks/C3Lo1_Ps.js","_app/immutable/chunks/-Ocsa0V4.js","_app/immutable/chunks/BShju2DL.js","_app/immutable/chunks/B5XxmIgL.js","_app/immutable/chunks/CbSjK6qg.js","_app/immutable/chunks/0wwrcJyA.js","_app/immutable/chunks/BBQfw3fT.js","_app/immutable/chunks/NGFkHLnn.js","_app/immutable/chunks/gdC8TTmK.js","_app/immutable/chunks/DTrgDxQV.js","_app/immutable/chunks/szyWsFvK.js","_app/immutable/chunks/C5P3A9-H.js","_app/immutable/chunks/B-K1k9OU.js"];
export const stylesheets = ["_app/immutable/assets/25.BOgK02wW.css","_app/immutable/assets/GridList.JfRK9Ijy.css","_app/immutable/assets/CoverArt.DfTvHn-K.css"];
export const fonts = [];
