// inventory.js - Handles items and backpack logic

// We do NOT import from assets.js anymore to prevent crashes
import { addChatMessage } from './chat.js';

// STARTING INVENTORY
window.gameState = window.gameState || {};
window.gameState.inventory = [];
const MAX_SLOTS = 20;

export function addItem(id, name, amount = 1) {
    const inv = window.gameState.inventory;

    // 1. Check if we already have this stackable item (e.g. coins)
    // For now, let's assume only Coins are stackable for simplicity
    if (id === 'coins') {
        const existing = inv.find(item => item.id === 'coins');
        if (existing) {
            existing.amount += amount;
            updateInventoryUI();
            return true;
        }
    }

    // 2. Check for empty space
    if (inv.length >= MAX_SLOTS) {
        addChatMessage("Your backpack is full!", "red");
        return false;
    }

    // 3. Add Item
    inv.push({ id, name, amount });
    updateInventoryUI();
    return true;
}

export function getBestAxe() {
    // Simple check: do we have an axe?
    // In future, check woodcutting level vs axe type
    return window.gameState.inventory.find(i => i.id.includes('axe')) || { power: 1 }; 
    // Default power 1 (Hands) if no axe, or handle logic in main.js
}

export function updateInventoryUI() {
    const grid = document.getElementById('inv-grid');
    if (!grid) return;
    grid.innerHTML = '';

    window.gameState.inventory.forEach((item, index) => {
        const slot = document.createElement('div');
        slot.className = 'item-slot';
        slot.innerText = item.name.substring(0, 2); // Simple icon
        
        // Count
        if (item.amount > 1) {
            const count = document.createElement('div');
            count.className = 'item-count';
            count.innerText = item.amount;
            slot.appendChild(count);
        }

        // Click to Drop/Use (Basic)
        slot.onclick = () => {
            addChatMessage(`Selected: ${item.name}`, "cyan");
        };

        grid.appendChild(slot);
    });
}
