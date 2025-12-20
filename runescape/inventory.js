// State
export const inventory = [];
export let coins = 100; // Start with 100gp

export function addItem(id, name, amount = 1) {
    // Check if stackable (Simulated)
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
        if (inventory[idx].amount <= 0) inventory.splice(idx, 1);
        updateInvUI();
        return true;
    }
    return false;
}

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

export function updateInvUI() {
    const grid = document.getElementById('inv-grid');
    grid.innerHTML = '';
    
    // Update Coin Text
    document.getElementById('coin-display').innerText = coins;

    inventory.forEach(item => {
        const slot = document.createElement('div');
        slot.className = 'item-slot';
        
        // Simple Icon Logic
        let icon = '❓';
        if(item.id === 'logs') icon = '🪵';
        if(item.id === 'fish') icon = '🐟';
        
        slot.innerHTML = `<span>${icon}</span><span class="item-count">${item.amount}</span>`;
        slot.title = item.name;
        grid.appendChild(slot);
    });
}
