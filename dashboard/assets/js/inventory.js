/* inventory.js — Medicine/supply stock with quantity steppers */
const BASE = '../';
let S = loadState();

function refresh(){
  renderSidebar(S, 'inventory', BASE);
  renderTopbar(S, BASE);
  document.getElementById('content').innerHTML = contentHTML();
  applyTheme(S);
}

function contentHTML(){
  return `
  <div class="card" style="flex:1;min-height:0;">
    <div class="eyebrow">INVENTORY</div>
    <div class="rowlist">
      ${S.inventory.map(it => `
        <div class="rowitem">
          <div class="ri-left">
            <div class="ri-title">${it.name}</div>
            <div class="ri-sub">${it.qty<=3?'<span class="low-flag">LOW STOCK</span>':'In stock'}</div>
          </div>
          <div class="stepper">
            <button onclick="adjustQty(${it.id},-1)">&minus;</button>
            <span class="qty">${it.qty}</span>
            <button onclick="adjustQty(${it.id},1)">+</button>
          </div>
        </div>`).join('')}
    </div>
  </div>`;
}

function adjustQty(id,delta){
  const it=S.inventory.find(x=>x.id===id);
  it.qty = Math.max(0, it.qty+delta);
  if(it.qty<=3) logMessage(S, `${it.name} running low (${it.qty} left)`, 'warn', 'inventory');
  saveState(S); refresh();
}

refresh();
startGlobalTick(S, 'inventory', refresh);
