import { f as attr } from "./index2.js";
const decoration = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='43.001'%20height='10.409'%20viewBox='0%200%2043.001%2010.409'%3e%3cpath%20id='Path_141'%20data-name='Path%20141'%20d='M-21.163,16.736H9.259c.118.4.976,2.634.976,2.634l1.884-7.054L14,22.422a32.132,32.132,0,0,0,1.436-5.685h5.4'%20transform='translate(21.663%20-12.187)'%20fill='none'%20stroke='%23454C6C'%20stroke-linecap='square'%20stroke-linejoin='bevel'%20stroke-width='1'/%3e%3c/svg%3e";
function PanelHeader($$payload, $$props) {
  let { headerText, button } = $$props;
  $$payload.out += `<div class="panel-header svelte-1gb0swe"><img${attr("src", decoration)} alt="decoration"> <h1 class="svelte-1gb0swe">`;
  headerText($$payload);
  $$payload.out += `<!----></h1> <div class="button-spacing svelte-1gb0swe">`;
  button?.($$payload);
  $$payload.out += `<!----></div></div>`;
}
export {
  PanelHeader as P
};
