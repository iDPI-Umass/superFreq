import * as server from '../entries/pages/welcome/_page.server.ts.js';

export const index = 34;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/welcome/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/welcome/+page.server.ts";
export const imports = ["_app/immutable/nodes/34.Bba3abi_.js","_app/immutable/chunks/Bg9kRutz.js","_app/immutable/chunks/CIC73nbL.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/zPX_AMPA.js","_app/immutable/chunks/26D3B16x.js","_app/immutable/chunks/CZBN_KMn.js","_app/immutable/chunks/D1sabymj.js","_app/immutable/chunks/w9zPIjBD.js","_app/immutable/chunks/BdK7rzmN.js","_app/immutable/chunks/pfHeeLMb.js","_app/immutable/chunks/CpZvCGMu.js","_app/immutable/chunks/D8QYH9wd.js","_app/immutable/chunks/4DH-dQQX.js","_app/immutable/chunks/QnRASlD3.js","_app/immutable/chunks/CpzmMpJK.js","_app/immutable/chunks/CVs4c5cQ.js","_app/immutable/chunks/h0YdFdS4.js","_app/immutable/chunks/ChdiFDjO.js","_app/immutable/chunks/BniDsu-1.js","_app/immutable/chunks/CRtoN-tp.js","_app/immutable/chunks/Cu7UW-DA.js"];
export const stylesheets = ["_app/immutable/assets/5.C1-x0Zcv.css","_app/immutable/assets/PanelHeader.BLMeWQlM.css","_app/immutable/assets/NotificationModal.x7h5i6_y.css"];
export const fonts = [];
