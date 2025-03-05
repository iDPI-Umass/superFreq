import * as universal from '../entries/pages/collection/_layout.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/collection/+layout.ts";
export const imports = ["_app/immutable/nodes/4.CAERfW8_.js","_app/immutable/chunks/B4yzidyb.js","_app/immutable/chunks/Bg9kRutz.js","_app/immutable/chunks/7L0UikBt.js","_app/immutable/chunks/DMW5TJkn.js","_app/immutable/chunks/0wwrcJyA.js"];
export const stylesheets = [];
export const fonts = [];
