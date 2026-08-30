/* state.js — single source of truth, persisted to localStorage so it
   survives real page navigation between the separate HTML pages. */

const STATE_KEY = 'cura_state_v1';

function nowStr(){ return new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}); }

function defaultState(){
  return {
    robotName: 'CURA',
    theme: 'light',
    brightness: 100,
    volume: 60,
    missionState: 'active',
    progress: 72,
    eta: 135,
    battery: 92,
    charging: false,
    systems: { Navigation:'ok', Manipulator:'ok', Vision:'ok', Sensors:'ok' },
    robotPos: { x: 50, y: 50 },
    inventory: [
      { id:1, name:'Medicine Kit A', qty:8 },
      { id:2, name:'Medicine Kit B', qty:3 },
      { id:3, name:'IV Supplies', qty:12 },
      { id:4, name:'Bandages', qty:5 },
    ],
    missionQueue: [
      { id:1, title:'Deliver Medicine Kit A to Patient Room 102', status:'active' },
      { id:2, title:'Deliver Medicine Kit B to Patient Room 108', status:'queued' },
      { id:3, title:'Collect samples from Room 114', status:'queued' },
    ],
    messages: [
      { time: nowStr(), text:'Item picked up successfully', type:'success' },
      { time: nowStr(), text:'Arrived at pickup zone', type:'nav' },
      { time: nowStr(), text:'Mission started', type:'task' },
    ],
    unread: 0,
    _battTick: 0,
    _chargeTick: 0,
  };
}

function loadState(){
  try{
    const raw = localStorage.getItem(STATE_KEY);
    if(raw) return JSON.parse(raw);
  }catch(e){ /* fall through to default */ }
  const s = defaultState();
  saveState(s);
  return s;
}

function saveState(s){
  try{ localStorage.setItem(STATE_KEY, JSON.stringify(s)); }catch(e){ /* storage unavailable */ }
}

function resetState(){
  const s = defaultState();
  saveState(s);
  return s;
}

function logMessage(state, text, type, currentView){
  state.messages.unshift({ time: nowStr(), text, type });
  if(state.messages.length > 30) state.messages.pop();
  if(currentView !== 'messages') state.unread++;
}
