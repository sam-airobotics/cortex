/* mission.js — Mission queue page */
const BASE = '../';
let S = loadState();

function refresh(){
  renderSidebar(S, 'mission', BASE);
  renderTopbar(S, BASE);
  document.getElementById('content').innerHTML = contentHTML();
  applyTheme(S);
}

function contentHTML(){
  return `
  <div class="card" style="flex:1;min-height:0;">
    <div class="eyebrow">MISSION QUEUE</div>
    <div class="rowlist">
      ${S.missionQueue.map(t => `
        <div class="rowitem">
          <div class="ri-left">
            <div class="ri-title">${t.title}</div>
            <div class="ri-sub">Task #${t.id}</div>
          </div>
          <div style="display:flex;align-items:center;gap:6px;">
            <span class="badge ${t.status}">${t.status}</span>
            ${t.status==='queued' ? `<button class="btn blue" onclick="startTask(${t.id})">Start</button>` : ''}
            ${t.status==='active' ? `<button class="btn green" onclick="completeTask(${t.id})">Complete</button>` : ''}
          </div>
        </div>`).join('')}
    </div>
  </div>`;
}

function startTask(id){
  S.missionQueue.forEach(t=>{ if(t.status==='active') t.status='queued'; });
  const t=S.missionQueue.find(x=>x.id===id);
  t.status='active'; S.missionState='active'; S.progress=0; S.eta=120; S.charging=false;
  logMessage(S, `Started: ${t.title}`, 'task', 'mission');
  saveState(S); refresh();
}
function completeTask(id){
  const t=S.missionQueue.find(x=>x.id===id);
  t.status='done'; S.progress=100;
  logMessage(S, `Completed: ${t.title}`, 'success', 'mission');
  const next = S.missionQueue.find(x=>x.status==='queued');
  if(next){ startTask(next.id); return; }
  S.missionState='idle';
  saveState(S); refresh();
}

refresh();
startGlobalTick(S, 'mission', refresh);
