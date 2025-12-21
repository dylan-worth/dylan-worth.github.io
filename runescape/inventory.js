// STATE
export const inventory = [
    { id: 'axe_bronze', name: 'Bronze Axe', amount: 1 }
];
export let coins = 100;

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
    inventory.forEach(i => {
        if(AXE_STATS[i.id]) {
            if(!best || AXE_STATS[i.id].power > best.power) best = { ...i, ...AXE_STATS[i.id] };
        }
    });
    return best;
}

export function addItem(id, name, amount=1) {
    let exists = inventory.find(i => i.id === id);
    if(exists) exists.amount += amount;
    else {
        if(inventory.length >= 28) return false;
        inventory.push({ id, name, amount });
    }
    updateInvUI();
    return true;
}

export function removeItem(id, amount=1) {
    let idx = inventory.findIndex(i => i.id === id);
    if(idx > -1) {
        inventory[idx].amount -= amount;
        if(inventory[idx].amount <= 0) inventory.splice(idx, 1);
        updateInvUI();
        return true;
    }
    return false;
}

export function addCoins(n) { coins += n; updateInvUI(); }
export function removeCoins(n) { 
    if(coins >= n) { coins -= n; updateInvUI(); return true; } 
    return false; 
}

export function updateInvUI() {
    const grid = document.getElementById('inv-grid');
    if(!grid) return;
    grid.innerHTML = '';
    
    document.getElementById('coin-display').innerText = coins;

    inventory.forEach(item => {
        const slot = document.createElement('div');
        slot.className = 'item-slot';
        
        let icon = '❓';
        if(item.id.includes('axe')) icon = '🪓';
        if(item.id === 'logs') icon = '🪵';
        if(item.id === 'tinderbox') icon = '🔥';
        
        slot.innerHTML = `<span style="font-size:18px">${icon}</span><span class="item-count">${item.amount}</span>`;
        
        // CLICK LOGIC
        slot.onclick = () => {
            if(window.gameState.uiMode === 'bank') {
                // Call global deposit to avoid circular dependency
                if(window.game && window.game.deposit) window.game.deposit(item);
            } else if(window.gameState.uiMode === 'shop') {
                if(window.game && window.game.sell) window.game.sell(item);
            } else {
                console.log("Clicked", item.name);
            }
        };
        grid.appendChild(slot);
    });
}
