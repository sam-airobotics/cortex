/* navigation.js — Manual drive pad + live position on a grid map */
const BASE = '../';
let S = loadState();

function refresh(){
  renderSidebar(S, 'navigation', BASE);
  renderTopbar(S, BASE);
  document.getElementById('content').innerHTML = contentHTML();
  applyTheme(S);
}

function contentHTML(){
  return `
  <div class="nav-view">
    <div class="mapbox">
      <div class="robot-dot" style="left:${S.robotPos.x}%;top:${S.robotPos.y}%;"></div>
    </div>
    <div class="pad">
      <div></div><div class="pad-btn" onclick="moveRobot(0,-1)">${icon('up')}</div><div></div>
      <div class="pad-btn" onclick="moveRobot(-1,0)">${icon('left')}</div>
      <div class="pad-center" onclick="returnHome()">HOME</div>
      <div class="pad-btn" onclick="moveRobot(1,0)">${icon('right')}</div>
      <div></div><div class="pad-btn" onclick="moveRobot(0,1)">${icon('down')}</div><div></div>
    </div>
  </div>`;
}

function moveRobot(dx,dy){
  S.robotPos.x = Math.min(90,Math.max(10, S.robotPos.x + dx*8));
  S.robotPos.y = Math.min(85,Math.max(10, S.robotPos.y + dy*8));
  logMessage(S,'Manual navigation command sent','nav','navigation');
  saveState(S); refresh();
}
function returnHome(){
  S.missionState='idle'; S.charging=true; S.robotPos={x:50,y:50};
  logMessage(S,'Returning to home / charging dock','nav','navigation');
  saveState(S); refresh();
}

refresh();
startGlobalTick(S, 'navigation', refresh);
