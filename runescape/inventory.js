import { addChatMessage } from './chat.js';

// STARTING INVENTORY
window.gameState = window.gameState || {};
window.gameState.inventory = [];
const MAX_SLOTS = 20;

export function addItem(id, name, amount = 1) {
    const inv = window.gameState.inventory;

    // 1. Stackable Check (Coins)
    if (id === 'coins') {
        const existing = inv.find(item => item.id === 'coins');
        if (existing) {
            existing.amount += amount;
            updateInventoryUI();
            return true;
        }
    }

    // 2. Space Check
    if (inv.length >= MAX_SLOTS) {
        addChatMessage("Your backpack is full!", "red");
        return false;
    }

    // 3. Add New Item
    inv.push({ id, name, amount });
    updateInventoryUI();
    return true;
}

// --- THIS WAS THE MISSING FUNCTION ---
export function removeItem(id, amount = 1) {
    const inv = window.gameState.inventory;
    const index = inv.findIndex(item => item.id === id);

    if (index === -1) return false; // Item not found

    const item = inv[index];

    if (item.amount > amount) {
        item.amount -= amount;
    } else {
        // Remove the slot entirely if amount reaches 0
        inv.splice(index, 1);
    }
    
    updateInventoryUI();
    return true;
}

export function hasItem(id, amount = 1) {
    const item = window.gameState.inventory.find(i => i.id === id);
    return item && item.amount >= amount;
}

export function getBestAxe() {
    // Returns an axe object or a default 'hand' object
    return window.gameState.inventory.find(i => i.id.includes('axe')) || { power: 1 }; 
}

export function updateInventoryUI() {
    const grid = document.getElementById('inv-grid');
    if (!grid) return;
    grid.innerHTML = '';

    window.gameState.inventory.forEach((item) => {
        const slot = document.createElement('div');
        slot.className = 'item-slot';
        // Display first 2 letters as a "icon"
        slot.innerText = item.name.substring(0, 2); 
        
        if (item.amount > 1) {
            const count = document.createElement('div');
            count.className = 'item-count';
            count.innerText = item.amount;
            slot.appendChild(count);
        }

        // Click to identify
        slot.onclick = () => {
            addChatMessage(`Selected: ${item.name}`, "cyan");
        };

        grid.appendChild(slot);
    });
}
