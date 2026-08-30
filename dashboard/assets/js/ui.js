/* ui.js — icons, sidebar/topbar builders, theme application,
   and the shared simulation tick used by every page. */

const ICONS = {
  home:'<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
  clipboard:'<rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1"/><path d="M9 12h6M9 16h4"/>',
  mappin:'<path d="M12 22s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="10" r="2.4"/>',
  briefcase:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  activity:'<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  message:'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  wifi:'<path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1"/>',
  bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
  pause:'<rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" stroke="none"/><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" stroke="none"/>',
  play:'<path d="M7 4l14 8-14 8V4z" fill="currentColor" stroke="none"/>',
  stop:'<rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" stroke="none"/>',
  up:'<path d="M12 5l7 7M12 5l-7 7M12 5v14"/>',
  down:'<path d="M12 19l7-7M12 19l-7-7M12 19V5"/>',
  left:'<path d="M5 12l7-7M5 12l7 7M5 12h14"/>',
  right:'<path d="M19 12l-7-7M19 12l-7 7M19 12H5"/>',
};
function icon(name){ return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]}</svg>`; }

/* Each nav item's file path is given relative to the PROJECT ROOT.
   basePath ('' on index.html, '../' on pages/*.html) is prefixed to it
   so links work correctly regardless of which page is currently open. */
const NAV_ITEMS = [
  {id:'dashboard', file:'index.html', icon:'home'},
  {id:'mission', file:'pages/mission.html', icon:'clipboard'},
  {id:'navigation', file:'pages/navigation.html', icon:'mappin'},
  {id:'inventory', file:'pages/inventory.html', icon:'briefcase'},
  {id:'system', file:'pages/system.html', icon:'activity'},
  {id:'messages', file:'pages/messages.html', icon:'message'},
  {id:'settings', file:'pages/settings.html', icon:'gear'},
];

function renderSidebar(state, activeId, basePath){
  const el = document.getElementById('sidebar');
  el.innerHTML = `
    <a class="logo-dot" href="${basePath}index.html">${(state.robotName||'C')[0]}</a>
    <div class="nav">
      ${NAV_ITEMS.map(n => `<a class="nav-btn ${activeId===n.id?'active':''}" href="${basePath}${n.file}">${icon(n.icon)}</a>`).join('')}
    </div>
    <a class="batt-ring" href="${basePath}index.html" title="Battery">
      <svg width="44" height="44" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r="18" fill="none" stroke="#eef2ff" stroke-width="5"/>
        <circle cx="22" cy="22" r="18" fill="none" stroke="${state.battery<20?'#ef4444':(state.charging?'#4f46e5':'#22c55e')}" stroke-width="5"
          stroke-linecap="round" stroke-dasharray="113.1" stroke-dashoffset="${113.1*(1-state.battery/100)}"/>
      </svg>
      <span>${state.battery}%</span>
    </a>`;
}

function renderTopbar(state, basePath){
  const el = document.getElementById('topbar');
  const d = new Date();
  el.innerHTML = `
    <div class="brand"><b>${state.robotName}</b><span>Healthcare Assistant Robot</span></div>
    <div class="stat-icons">
      <span>${d.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</span>
      <span style="color:#cbd5e1">|</span>
      <span>${d.toLocaleDateString([], {day:'2-digit',month:'short',year:'numeric'})}</span>
      <span class="grp">${icon('wifi')}</span>
      <span class="grp">${state.battery}%</span>
      <a class="bell-wrap grp" href="${basePath}pages/messages.html">
        ${icon('bell')}
        ${state.unread>0?`<span class="bell-dot">${state.unread>9?'9+':state.unread}</span>`:''}
      </a>
    </div>`;
}

function applyTheme(state){
  document.getElementById('screen').style.filter = `brightness(${state.brightness/100})`;
  document.getElementById('screen').classList.toggle('dark', state.theme==='dark');
}

function fmtEta(sec){
  const m = Math.floor(sec/60), s = sec%60;
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}
function statusLabel(state){
  return {active:'Active Delivery', paused:'Mission Paused', stopped:'Mission Stopped', idle:'Idle — Awaiting Task'}[state.missionState];
}

/* Shared simulation: mission progress/eta countdown, battery drain while
   active, battery charge while docked. Runs on every page so the world
   keeps moving no matter which screen is open; each page's onTick
   callback just re-renders whatever it needs to. */
function startGlobalTick(state, currentView, onTick){
  return setInterval(()=>{
    if(state.missionState==='active' && state.eta>0){
      state.eta -= 1;
      state.progress = Math.min(100, Math.round(((120-state.eta)/120)*100));
      if(!state.charging){
        state._battTick = (state._battTick||0) + 1;
        if(state._battTick>=15){ state._battTick=0; state.battery=Math.max(5,state.battery-1); }
      }
      if(state.eta<=0){
        const t = state.missionQueue.find(x=>x.status==='active');
        if(t){
          t.status='done'; state.progress=100;
          logMessage(state, `Completed: ${t.title}`, 'success', currentView);
          const next = state.missionQueue.find(x=>x.status==='queued');
          if(next){ next.status='active'; state.missionState='active'; state.progress=0; state.eta=120; }
          else { state.missionState='idle'; }
        } else {
          state.missionState='idle';
        }
      }
    }
    if(state.charging && state.battery<100){
      state._chargeTick = (state._chargeTick||0) + 1;
      if(state._chargeTick>=3){ state._chargeTick=0; state.battery=Math.min(100,state.battery+1); }
      if(state.battery>=100) state.charging=false;
    }
    saveState(state);
    onTick();
  }, 1000);
}
