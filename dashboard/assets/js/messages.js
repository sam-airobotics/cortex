/* messages.js — Full activity log */
const BASE = '../';
let S = loadState();
S.unread = 0;
saveState(S);

function refresh(){
  renderSidebar(S, 'messages', BASE);
  renderTopbar(S, BASE);
  document.getElementById('content').innerHTML = contentHTML();
  applyTheme(S);
}

function contentHTML(){
  return `
  <div class="card" style="flex:1;min-height:0;">
    <div class="eyebrow">ALL MESSAGES</div>
    <div class="rowlist">
      ${S.messages.map(m => `
        <div class="rowitem">
          <div class="ri-left">
            <div class="ri-title">${m.text}</div>
            <div class="ri-sub">${m.time}</div>
          </div>
        </div>`).join('')}
    </div>
  </div>`;
}

refresh();
startGlobalTick(S, 'messages', refresh);
