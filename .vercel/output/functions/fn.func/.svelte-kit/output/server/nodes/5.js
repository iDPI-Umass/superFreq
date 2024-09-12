import * as server from '../entries/pages/(authed)/account/create-profile/_page.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(authed)/account/create-profile/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/(authed)/account/create-profile/+page.server.ts";
export const imports = ["_app/immutable/nodes/5.CJlIHFOw.js","_app/immutable/chunks/scheduler.CXRP0wEC.js","_app/immutable/chunks/index.a6HmqSPn.js","_app/immutable/chunks/forms.CTZFOOt3.js","_app/immutable/chunks/entry.a6gQbV6m.js","_app/immutable/chunks/PanelHeader.CqWWMOkt.js","_app/immutable/chunks/MusicBrainzSearch.COTOpnB5.js","_app/immutable/chunks/each.Chb-s0GO.js","_app/immutable/chunks/parseData.CC0748Oa.js","_app/immutable/chunks/_commonjsHelpers.BosuxZz1.js","_app/immutable/chunks/NotificationModal.C0Og5Del.js","_app/immutable/chunks/RedirectModal.CU5NUfaj.js"];
export const stylesheets = ["_app/immutable/assets/4.BZZgLD9T.css","_app/immutable/assets/PanelHeader.B2hXp4er.css","_app/immutable/assets/MusicBrainzSearch.B9DaSbD8.css","_app/immutable/assets/RedirectModal.BEQCaRJx.css"];
export const fonts = [];
