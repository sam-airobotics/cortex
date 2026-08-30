/* settings.js — Robot name, brightness, volume, theme, factory reset */
const BASE = '../';
let S = loadState();

function refresh(){
  renderSidebar(S, 'settings', BASE);
  renderTopbar(S, BASE);
  document.getElementById('content').innerHTML = contentHTML();
  applyTheme(S);
}

function contentHTML(){
  return `
  <div class="card" style="flex:1;min-height:0;">
    <div class="eyebrow">SETTINGS</div>
    <div class="settings-list">
      <div class="setting-row">
        <div class="sr-top"><label>Robot Name</label></div>
        <input type="text" value="${S.robotName}" oninput="setRobotName(this.value)" maxlength="12"/>
      </div>
      <div class="setting-row">
        <div class="sr-top"><label>Screen Brightness</label><span class="val">${S.brightness}%</span></div>
        <input type="range" min="30" max="100" value="${S.brightness}" oninput="setBrightness(this.value)"/>
      </div>
      <div class="setting-row">
        <div class="sr-top"><label>Speaker Volume</label><span class="val">${S.volume}%</span></div>
        <input type="range" min="0" max="100" value="${S.volume}" oninput="setVolume(this.value)"/>
      </div>
      <div class="setting-row">
        <div class="sr-top">
          <label>Dark Mode</label>
          <div class="toggle ${S.theme==='dark'?'on':''}" onclick="toggleTheme()"></div>
        </div>
      </div>
      <div class="setting-row">
        <button class="btn gray" style="align-self:flex-start;padding:8px 14px;" onclick="factoryReset()">Factory Reset</button>
      </div>
    </div>
  </div>`;
}

function setRobotName(v){ S.robotName = v || 'CURA'; saveState(S); refresh(); }
function setBrightness(v){ S.brightness = +v; saveState(S); refresh(); }
function setVolume(v){ S.volume = +v; saveState(S); refresh(); }
function toggleTheme(){ S.theme = S.theme==='dark'?'light':'dark'; saveState(S); refresh(); }
function factoryReset(){ S = resetState(); refresh(); }

refresh();
startGlobalTick(S, 'settings', refresh);
