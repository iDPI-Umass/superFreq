import * as server from '../entries/pages/welcome/scripts/_page.server.ts.js';

export const index = 36;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/welcome/scripts/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/welcome/scripts/+page.server.ts";
export const imports = ["_app/immutable/nodes/36.Bb-EtdAF.js","_app/immutable/chunks/Bg9kRutz.js","_app/immutable/chunks/69_IOA4Y.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/D1sabymj.js","_app/immutable/chunks/CIC73nbL.js"];
export const stylesheets = [];
export const fonts = [];
