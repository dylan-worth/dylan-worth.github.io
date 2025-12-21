import { inventory, coins } from './inventory.js'; // Self import works for state? No, better to keep state here.

// State needs to be defined here
const invData = [ { id: 'axe_bronze', name: 'Bronze Axe', amount: 1 } ];
let coinCount = 100;

// AXE STATS
const AXE_STATS = {
    'axe_bronze': { power: 1, req: 1 },
    'axe_iron': { power: 1.5, req: 1 },
    'axe_steel': { power: 2, req: 5 },
    'axe_mithril': { power: 3, req: 20 },
    'axe_rune': { power: 5, req: 40 }
};

export function getBestAxe() {
    let best = null;
    invData.forEach(i => {
        if(AXE_STATS[i.id]) {
            if(!best || AXE_STATS[i.id].power > best.power) best = { ...i, ...AXE_STATS[i.id] };
        }
    });
    return best;
}

export function addItem(id, name, amount=1) {
    let exists = invData.find(i => i.id === id);
    if(exists) exists.amount += amount;
    else {
        if(invData.length >= 28) return false;
        invData.push({ id, name, amount });
    }
    updateInvUI();
    return true;
}

export function removeItem(id, amount=1) {
    let idx = invData.findIndex(i => i.id === id);
    if(idx > -1) {
        invData[idx].amount -= amount;
        if(invData[idx].amount <= 0) invData.splice(idx, 1);
        updateInvUI();
        return true;
    }
    return false;
}

export function addCoins(n) { coinCount += n; updateInvUI(); }
export function removeCoins(n) { 
    if(coinCount >= n) { coinCount -= n; updateInvUI(); return true; } 
    return false; 
}

export function updateInvUI() {
    const grid = document.getElementById('inv-grid');
    if(!grid) return;
    grid.innerHTML = '';
    
    document.getElementById('coin-display').innerText = coinCount;

    invData.forEach(item => {
        const slot = document.createElement('div');
        slot.className = 'item-slot';
        
        let icon = '❓';
        if(item.id.includes('axe')) icon = '🪓';
        if(item.id === 'logs') icon = '🪵';
        if(item.id === 'tinderbox') icon = '🔥';
        
        slot.innerHTML = `<span style="font-size:18px">${icon}</span><span class="item-count">${item.amount}</span>`;
        
        // CLICK LOGIC
        slot.onclick = () => {
            // Check global game state
            if(window.gameState && window.gameState.uiMode === 'bank') {
                if(window.game && window.game.deposit) window.game.deposit(item);
            } else if(window.gameState && window.gameState.uiMode === 'shop') {
                if(window.game && window.game.sell) window.game.sell(item);
            } else {
                console.log("Clicked", item.name);
            }
        };
        grid.appendChild(slot);
    });
}
