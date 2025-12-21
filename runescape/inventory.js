// --- STATE ---
export const inventory = [
    { id: 'axe_bronze', name: 'Bronze Axe', amount: 1 } // Start with an axe!
];
export let coins = 100;

// --- AXE STATS ---
const AXE_STATS = {
    'axe_bronze': { power: 1, req: 1 },
    'axe_iron':   { power: 1.5, req: 1 },
    'axe_steel':  { power: 2, req: 5 },
    'axe_mithril':{ power: 3, req: 20 },
    'axe_adamant':{ power: 4, req: 30 },
    'axe_rune':   { power: 5, req: 40 },
    'axe_dragon': { power: 8, req: 60 }
};

// --- THIS IS THE MISSING FUNCTION ---
export function getBestAxe() {
    let bestAxe = null;
    let bestStats = null;

    inventory.forEach(item => {
        if (AXE_STATS[item.id]) {
            const stats = AXE_STATS[item.id];
            // If we haven't found an axe yet, OR this one is stronger
            if (!bestStats || stats.power > bestStats.power) {
                bestAxe = item;
                bestStats = stats;
            }
        }
    });

    // Return combined object (Item data + Axe stats)
    return bestAxe ? { ...bestAxe, ...bestStats } : null;
}

export function addItem(id, name, amount = 1) {
    const existing = inventory.find(i => i.id === id);
    
    if (existing) {
        existing.amount += amount;
    } else {
        if (inventory.length < 28) {
            inventory.push({ id, name, amount });
        } else {
            console.log("Inventory Full!");
            return false;
        }
    }
    updateInvUI();
    return true;
}

export function removeItem(id, amount = 1) {
    const idx = inventory.findIndex(i => i.id === id);
    if (idx > -1) {
        inventory[idx].amount -= amount;
        if (inventory[idx].amount <= 0) {
            inventory.splice(idx, 1);
        }
        updateInvUI();
        return true;
    }
    return false;
}

// --- COINS ---
export function addCoins(amount) {
    coins += amount;
    updateInvUI();
}

export function removeCoins(amount) {
    if (coins >= amount) {
        coins -= amount;
        updateInvUI();
        return true;
    }
    return false;
}

// --- UI ---
export function updateInvUI() {
    const grid = document.getElementById('inv-grid');
    if (!grid) return;

    grid.innerHTML = '';
    
    const coinDisplay = document.getElementById('coin-display');
    if (coinDisplay) coinDisplay.innerText = coins;

    inventory.forEach(item => {
        const slot = document.createElement('div');
        slot.className = 'item-slot';
        
        let icon = '❓';
        if(item.id === 'logs') icon = '🪵';
        if(item.id === 'tinderbox') icon = '🔥';
        if(item.id.includes('axe')) icon = '🪓'; 
        if(item.id === 'fish') icon = '🐟';

        slot.innerHTML = `
            <span style="font-size:18px">${icon}</span>
            <span class="item-count">${item.amount}</span>
        `;
        
        slot.title = item.name;
        grid.appendChild(slot);
    });
}
