/* dashboard.js — Home page: mission overview + quick actions + status strip */
const BASE = '';
let S = loadState();

function refresh(){
  renderSidebar(S, 'dashboard', BASE);
  renderTopbar(S, BASE);
  document.getElementById('content').innerHTML = contentHTML();
  applyTheme(S);
}

function contentHTML(){
  const activeTask = S.missionQueue.find(t=>t.status==='active');
  return `
  <div class="grid-row1">
    <div class="card mission">
      <div class="eyebrow">MISSION STATUS</div>
      <div class="mission-status-row ${S.missionState}"><div class="dot"></div><span>${statusLabel(S)}</span></div>
      <div>
        <div class="task-label">Current Task</div>
        <div class="task-title">${activeTask ? activeTask.title : 'No active task'}</div>
      </div>
      <div class="mission-bottom">
        <div style="font-size:10px;color:var(--sub)">Mission Progress</div>
        <div class="progress-row">
          <div class="progress-track"><div class="progress-fill" style="width:${S.progress}%"></div></div>
          <div class="progress-pct">${S.progress}%</div>
        </div>
        <div class="eta-row"><span class="eta-val">${fmtEta(S.eta)}</span><span class="eta-label">min remaining</span></div>
      </div>
    </div>
    <div class="card actions">
      <div class="eyebrow">QUICK ACTIONS</div>
      <div class="action-grid">
        <div class="action-btn ${S.missionState==='idle'||S.missionState==='stopped'?'disabled':''}" onclick="togglePause()">
          <div class="icon-circ" style="background:#4f46e5">${icon(S.missionState==='paused'?'play':'pause')}</div>
          <label>${S.missionState==='paused'?'Resume':'Pause'}</label>
        </div>
        <div class="action-btn" onclick="returnHome()">
          <div class="icon-circ" style="background:#22c55e">${icon('home')}</div>
          <label>Return Home</label>
        </div>
        <div class="action-btn ${S.missionState==='idle'?'disabled':''}" onclick="stopMission()">
          <div class="icon-circ" style="background:#ef4444">${icon('stop')}</div>
          <label>Stop</label>
        </div>
        <a class="action-btn" href="${BASE}pages/navigation.html">
          <div class="icon-circ" style="background:#a855f7">${icon('mappin')}</div>
          <label>View Map</label>
        </a>
      </div>
    </div>
  </div>
  <div class="strip">
    ${Object.entries(S.systems).map(([k,v])=>`
      <a class="chip" href="${BASE}pages/system.html">
        <div class="chip-label">${k.toUpperCase()}</div>
        <div class="chip-val"><span class="d ${v==='fault'?'fault':''}"></span>${v==='ok'?'OK':'FAULT'}</div>
      </a>`).join('')}
    <a class="chip" href="${BASE}index.html">
      <div class="chip-label">BATTERY</div>
      <div class="chip-val"><span class="d"></span>${S.battery}%</div>
    </a>
  </div>`;
}

function togglePause(){
  if(S.missionState==='active'){ S.missionState='paused'; logMessage(S,'Mission paused','task','dashboard'); }
  else if(S.missionState==='paused'){ S.missionState='active'; logMessage(S,'Mission resumed','task','dashboard'); }
  saveState(S); refresh();
}
function stopMission(){
  S.missionState='stopped'; S.progress=0; S.eta=0;
  const t=S.missionQueue.find(x=>x.status==='active'); if(t) t.status='queued';
  logMessage(S,'Mission stopped by operator','error','dashboard');
  saveState(S); refresh();
}
function returnHome(){
  S.missionState='idle'; S.charging=true; S.robotPos={x:50,y:50};
  logMessage(S,'Returning to home / charging dock','nav','dashboard');
  saveState(S); refresh();
}

refresh();
startGlobalTick(S, 'dashboard', refresh);
