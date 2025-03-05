import * as universal from '../entries/pages/collection/_layout.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/collection/+layout.ts";
export const imports = ["_app/immutable/nodes/4.D8fdoWC1.js","_app/immutable/chunks/D4u8frmK.js","_app/immutable/chunks/Bg9kRutz.js","_app/immutable/chunks/CIC73nbL.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/D1sabymj.js","_app/immutable/chunks/ChdiFDjO.js"];
export const stylesheets = [];
export const fonts = [];
