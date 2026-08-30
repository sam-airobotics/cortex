/* system.js — Subsystem diagnostics with fault simulation toggles */
const BASE = '../';
let S = loadState();

function refresh(){
  renderSidebar(S, 'system', BASE);
  renderTopbar(S, BASE);
  document.getElementById('content').innerHTML = contentHTML();
  applyTheme(S);
}

function contentHTML(){
  return `
  <div class="card" style="flex:1;min-height:0;">
    <div class="eyebrow">SYSTEM DIAGNOSTICS</div>
    <div class="rowlist">
      ${Object.entries(S.systems).map(([k,v]) => `
        <div class="rowitem">
          <div class="ri-left">
            <div class="ri-title">${k}</div>
            <div class="ri-sub">${v==='ok'?'Operating normally':'Fault detected'}</div>
          </div>
          <button class="btn ${v==='ok'?'red':'green'}" onclick="toggleSystem('${k}')">${v==='ok'?'Simulate Fault':'Clear Fault'}</button>
        </div>`).join('')}
    </div>
  </div>`;
}

function toggleSystem(key){
  S.systems[key] = S.systems[key]==='ok' ? 'fault' : 'ok';
  logMessage(S, `${key} ${S.systems[key]==='fault'?'reported a fault':'fault cleared'}`, S.systems[key]==='fault'?'error':'success', 'system');
  saveState(S); refresh();
}

refresh();
startGlobalTick(S, 'system', refresh);
