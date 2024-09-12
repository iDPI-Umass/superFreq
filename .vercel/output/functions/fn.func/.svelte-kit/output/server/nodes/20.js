import * as server from '../entries/pages/collection/new/_page.server.ts.js';

export const index = 20;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/collection/new/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/collection/new/+page.server.ts";
export const imports = ["_app/immutable/nodes/20.DzB2G7t5.js","_app/immutable/chunks/scheduler.CXRP0wEC.js","_app/immutable/chunks/index.a6HmqSPn.js","_app/immutable/chunks/PanelHeader.CqWWMOkt.js","_app/immutable/chunks/GridList.Bf6pcDOU.js","_app/immutable/chunks/each.Chb-s0GO.js","_app/immutable/chunks/index.CvmYViMX.js","_app/immutable/chunks/spread.CgU5AtxT.js","_app/immutable/chunks/Icon.3yADeopG.js","_app/immutable/chunks/MusicBrainzSearch.COTOpnB5.js","_app/immutable/chunks/entry.a6gQbV6m.js","_app/immutable/chunks/parseData.CC0748Oa.js","_app/immutable/chunks/_commonjsHelpers.BosuxZz1.js","_app/immutable/chunks/Tooltip.YbxJkuyW.js","_app/immutable/chunks/updater.C1ZFZVgO.js","_app/immutable/chunks/popover-trigger.Dez8sWdy.js","_app/immutable/chunks/helpers.CwfhyKXk.js"];
export const stylesheets = ["_app/immutable/assets/20.DNetjm5d.css","_app/immutable/assets/PanelHeader.B2hXp4er.css","_app/immutable/assets/GridList.Bb-2nD9b.css","_app/immutable/assets/metadata-formatting.CtHEyitU.css","_app/immutable/assets/MusicBrainzSearch.B9DaSbD8.css"];
export const fonts = [];
