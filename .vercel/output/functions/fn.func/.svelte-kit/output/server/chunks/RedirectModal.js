import { c as create_ssr_component, d as add_attribute } from "./ssr.js";
import "./client.js";
const css = {
  code: ".dialog-column.svelte-au4rpm{display:flex;flex-direction:column;gap:var(--freq-height-spacer)}button.svelte-au4rpm{margin:0 auto}",
  map: '{"version":3,"file":"RedirectModal.svelte","sources":["RedirectModal.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { beforeUpdate, tick } from \\"svelte\\";\\nimport { goto } from \\"$app/navigation\\";\\nexport let showModal;\\nexport let redirectPath;\\nlet dialog;\\nconsole.log(showModal);\\n$: if (dialog && showModal) dialog.showModal();\\n$: if (dialog && !showModal) dialog.close();\\nbeforeUpdate(async () => {\\n  await tick;\\n  if (showModal == true) {\\n    setTimeout(() => goto(redirectPath), 5e3);\\n  }\\n});\\n<\/script>\\n\\n<dialog class=\\"notification\\"\\n    aria-label=\\"redirect-modal\\"\\n    bind:this={dialog}\\n    on:close={() => (showModal = false)}\\n>\\n    <div class=\\"dialog-column\\">\\n        <div class=\\"dialog-header\\">\\n            <h1 class=\\"notification\\">\\n                <slot name=\\"header-text\\" />\\n            </h1>\\n        </div>\\n        <slot name=\\"message\\" />\\n        <button class=\\"standard\\" on:click={() => goto(redirectPath)}>\\n            Go now\\n        </button>\\n    </div>\\n</dialog>\\n\\n\\n<style>\\n    .dialog-column {\\n        display: flex;\\n        flex-direction: column;\\n        gap: var(--freq-height-spacer);\\n    }\\n    button {\\n        margin: 0 auto;\\n    }\\n</style>"],"names":[],"mappings":"AAoCI,4BAAe,CACX,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,GAAG,CAAE,IAAI,oBAAoB,CACjC,CACA,oBAAO,CACH,MAAM,CAAE,CAAC,CAAC,IACd"}'
};
const RedirectModal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { showModal } = $$props;
  let { redirectPath } = $$props;
  let dialog;
  console.log(showModal);
  if ($$props.showModal === void 0 && $$bindings.showModal && showModal !== void 0) $$bindings.showModal(showModal);
  if ($$props.redirectPath === void 0 && $$bindings.redirectPath && redirectPath !== void 0) $$bindings.redirectPath(redirectPath);
  $$result.css.add(css);
  return `<dialog class="notification" aria-label="redirect-modal"${add_attribute("this", dialog, 0)}><div class="dialog-column svelte-au4rpm"><div class="dialog-header"><h1 class="notification">${slots["header-text"] ? slots["header-text"]({}) : ``}</h1></div> ${slots.message ? slots.message({}) : ``} <button class="standard svelte-au4rpm" data-svelte-h="svelte-pf9ijz">Go now</button></div> </dialog>`;
});
export {
  RedirectModal as R
};
