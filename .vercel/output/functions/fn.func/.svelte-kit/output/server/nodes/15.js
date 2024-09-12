import * as server from '../entries/pages/(authed)/user/top-albums/_page.server.ts.js';

export const index = 15;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(authed)/user/top-albums/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/(authed)/user/top-albums/+page.server.ts";
export const imports = ["_app/immutable/nodes/15.DLP61x9I.js","_app/immutable/chunks/scheduler.CXRP0wEC.js","_app/immutable/chunks/index.a6HmqSPn.js","_app/immutable/chunks/entry.a6gQbV6m.js","_app/immutable/chunks/localStorage.Bej6gSz_.js","_app/immutable/chunks/PanelHeader.CqWWMOkt.js","_app/immutable/chunks/GridList.Bf6pcDOU.js","_app/immutable/chunks/each.Chb-s0GO.js","_app/immutable/chunks/index.CvmYViMX.js","_app/immutable/chunks/spread.CgU5AtxT.js","_app/immutable/chunks/Icon.3yADeopG.js","_app/immutable/chunks/MusicBrainzSearch.COTOpnB5.js","_app/immutable/chunks/parseData.CC0748Oa.js","_app/immutable/chunks/_commonjsHelpers.BosuxZz1.js"];
export const stylesheets = ["_app/immutable/assets/15.PBAJgk8l.css","_app/immutable/assets/PanelHeader.B2hXp4er.css","_app/immutable/assets/GridList.Bb-2nD9b.css","_app/immutable/assets/metadata-formatting.CtHEyitU.css","_app/immutable/assets/MusicBrainzSearch.B9DaSbD8.css"];
export const fonts = [];
