import * as server from '../entries/pages/welcome/_page.server.ts.js';

export const index = 26;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/welcome/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/welcome/+page.server.ts";
export const imports = ["_app/immutable/nodes/26.DlcgiJfw.js","_app/immutable/chunks/scheduler.CXRP0wEC.js","_app/immutable/chunks/index.a6HmqSPn.js","_app/immutable/chunks/forms.CTZFOOt3.js","_app/immutable/chunks/entry.a6gQbV6m.js","_app/immutable/chunks/PanelHeader.CqWWMOkt.js","_app/immutable/chunks/NotificationModal.C0Og5Del.js"];
export const stylesheets = ["_app/immutable/assets/26.QuPa1FKq.css","_app/immutable/assets/posts.DyIiHDwj.css","_app/immutable/assets/PanelHeader.B2hXp4er.css"];
export const fonts = [];
