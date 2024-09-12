import { c as create_ssr_component, d as add_attribute } from "./ssr.js";
const decoration = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='43.001'%20height='10.409'%20viewBox='0%200%2043.001%2010.409'%3e%3cpath%20id='Path_141'%20data-name='Path%20141'%20d='M-21.163,16.736H9.259c.118.4.976,2.634.976,2.634l1.884-7.054L14,22.422a32.132,32.132,0,0,0,1.436-5.685h5.4'%20transform='translate(21.663%20-12.187)'%20fill='none'%20stroke='%23454C6C'%20stroke-linecap='square'%20stroke-linejoin='bevel'%20stroke-width='1'/%3e%3c/svg%3e";
const css = {
  code: "div.svelte-t56pim{display:flex;flex-direction:row;border-top:1px solid var(--freq-color-border-panel);border-bottom:1px solid var(--freq-color-border-panel);margin:var(--freq-spacing-3x-small) 0;align-items:center}h1.svelte-t56pim{text-transform:uppercase;font-size:var(--freq-font-size-medium);color:var(--freq-color-primary);padding:0 var(--freq-width-spacer-half)}",
  map: '{"version":3,"file":"PanelHeader.svelte","sources":["PanelHeader.svelte"],"sourcesContent":["<script lang=\\"ts\\">import decoration from \\"$lib/assets/images/panel-header-decoration.svg\\";\\n<\/script>\\n\\n<div>\\n    <img src={decoration} alt=\\"decoration\\" />\\n    <h1>\\n        <slot />\\n    </h1>\\n</div>\\n\\n<style>\\n    div {\\n        display: flex;\\n        flex-direction: row;\\n        border-top: 1px solid var(--freq-color-border-panel);\\n        border-bottom: 1px solid var(--freq-color-border-panel);\\n        margin: var(--freq-spacing-3x-small) 0;\\n        align-items: center;\\n    }\\n    h1 {\\n        text-transform: uppercase;\\n        font-size: var(--freq-font-size-medium);\\n        color: var(--freq-color-primary);\\n        padding: 0 var(--freq-width-spacer-half);\\n    }\\n</style>"],"names":[],"mappings":"AAWI,iBAAI,CACA,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,GAAG,CACnB,UAAU,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,yBAAyB,CAAC,CACpD,aAAa,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,yBAAyB,CAAC,CACvD,MAAM,CAAE,IAAI,uBAAuB,CAAC,CAAC,CAAC,CACtC,WAAW,CAAE,MACjB,CACA,gBAAG,CACC,cAAc,CAAE,SAAS,CACzB,SAAS,CAAE,IAAI,uBAAuB,CAAC,CACvC,KAAK,CAAE,IAAI,oBAAoB,CAAC,CAChC,OAAO,CAAE,CAAC,CAAC,IAAI,wBAAwB,CAC3C"}'
};
const PanelHeader = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<div class="svelte-t56pim"><img${add_attribute("src", decoration, 0)} alt="decoration"> <h1 class="svelte-t56pim">${slots.default ? slots.default({}) : ``}</h1> </div>`;
});
export {
  PanelHeader as P
};
