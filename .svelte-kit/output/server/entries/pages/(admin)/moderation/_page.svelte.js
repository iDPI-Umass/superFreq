import { d as ensure_array_like, h as head, e as escape_html, f as attr, s as stringify, p as pop, b as push } from "../../../../chunks/index2.js";
import "../../../../chunks/client.js";
import { c as parseTimestamp } from "../../../../chunks/parseData.js";
import { N as NotificationModal } from "../../../../chunks/NotificationModal.js";
function _page($$payload, $$props) {
  push();
  let { data } = $$props;
  let { queueItems } = data;
  let resolvePromise = false;
  function itemType(item) {
    if (item.target_user_id) {
      return "user";
    } else if (item.target_post_id) {
      return "post";
    }
  }
  let showModerationLog = false;
  let showChangelog = false;
  const each_array = ensure_array_like(queueItems);
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>
        Moderation Dashboard
    </title>`;
  });
  $$payload.out += `<div class="panel svelte-48cl4j"><h1>Moderation Dashboard</h1> <table class="svelte-48cl4j"><thead><tr><th scope="col" class="svelte-48cl4j">Time</th><th scope="col" class="svelte-48cl4j">Type</th><th scope="col" class="svelte-48cl4j">User</th><th scope="col" class="svelte-48cl4j">Target User</th><th scope="col" class="svelte-48cl4j">Target Post</th><th scope="col" class="svelte-48cl4j">Moderate</th></tr></thead><tbody class="svelte-48cl4j"><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let item = each_array[$$index];
    $$payload.out += `<tr class="svelte-48cl4j"><td class="svelte-48cl4j">${escape_html(item.timestamp)}</td><td class="svelte-48cl4j">${escape_html(item.type)}</td><td class="svelte-48cl4j"><a${attr("href", `/user/${stringify(item.username)}`)}>${escape_html(item.username)}</a></td><td class="svelte-48cl4j">`;
    if (item.target_username) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<a${attr("href", `/user/${stringify(item.target_username)}`)}>${escape_html(item.target_username)}</a>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></td><td class="svelte-48cl4j">`;
    if (item.target_post_timestamp) {
      $$payload.out += "<!--[-->";
      if (Object.keys(item.post_changelog).length > 0) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<button class="more-info svelte-48cl4j">post changelog</button> `;
        {
          let headerText = function($$payload2) {
            $$payload2.out += `<!---->Post Changelog`;
          }, message = function($$payload2) {
            $$payload2.out += `<!---->${escape_html(JSON.stringify(item.post_changelog))}`;
          };
          NotificationModal($$payload, {
            showModal: showChangelog,
            headerText,
            message,
            $$slots: { headerText: true, message: true }
          });
        }
        $$payload.out += `<!---->`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--> <a${attr("href", `/posts/${stringify(item.target_post_username)}/now-playing/${stringify(parseTimestamp(item.target_post_timestamp))}`)}>${escape_html(item.target_post_username)}: ${escape_html(item.target_post_timestamp)}</a>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></td><td class="svelte-48cl4j">`;
    if (Object.keys(item.moderation_log).length > 0) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<button class="more-info svelte-48cl4j">moderation log</button> `;
      {
        let headerText = function($$payload2) {
          $$payload2.out += `<!---->Moderation Log`;
        }, message = function($$payload2) {
          $$payload2.out += `<!---->${escape_html(JSON.stringify(item.moderation_log))}`;
        };
        NotificationModal($$payload, {
          showModal: showModerationLog,
          headerText,
          message,
          $$slots: { headerText: true, message: true }
        });
      }
      $$payload.out += `<!---->`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> <form method="POST" action="?/update"><input type="hidden" name="item-id" id="item-id"${attr("value", item.moderation_item_id)}> <input type="hidden" name="item-type" id="item-type"${attr("value", itemType(item))}> <textarea name="notes" id="notes"></textarea> <div class="cell-row svelte-48cl4j"><div class="input-column svelte-48cl4j"><label for="resolved">archive</label> <input type="checkbox" name="resolved" id="resolved"></div> <button class="standard" type="submit"${attr("disabled", resolvePromise, true)}>update</button></div></form></td></tr>`;
  }
  $$payload.out += `<!--]--></tbody></table></div>`;
  pop();
}
export {
  _page as default
};
