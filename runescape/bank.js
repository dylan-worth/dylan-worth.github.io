import { addItem, removeItem } from './inventory.js'; // Imports must match inventory.js
import { addChatMessage } from './chat.js';

window.gameState = window.gameState || {};
window.gameState.bank = [];

export function openBank() {
    const bankWindow = document.getElementById('bank-window');
    if (bankWindow) {
        bankWindow.style.display = 'flex';
        updateBankUI();
        window.gameState.uiMode = 'bank';
    }
}

export function deposit(id, name, amount) {
    // Remove from Inv
    if (removeItem(id, amount)) {
        // Add to Bank
        const existing = window.gameState.bank.find(i => i.id === id);
        if (existing) {
            existing.amount += amount;
        } else {
            window.gameState.bank.push({ id, name, amount });
        }
        updateBankUI();
    }
}

export function withdraw(id, name, amount) {
    const bankItem = window.gameState.bank.find(i => i.id === id);
    if (!bankItem) return;

    if (bankItem.amount >= amount) {
        // Add to Inv
        if (addItem(id, name, amount)) {
            // Remove from Bank
            bankItem.amount -= amount;
            if (bankItem.amount <= 0) {
                const idx = window.gameState.bank.indexOf(bankItem);
                window.gameState.bank.splice(idx, 1);
            }
            updateBankUI();
        }
    }
}

function updateBankUI() {
    const grid = document.getElementById('bank-grid');
    if (!grid) return;
    grid.innerHTML = '';

    window.gameState.bank.forEach(item => {
        const slot = document.createElement('div');
        slot.className = 'item-slot';
        slot.innerText = item.name.substring(0, 2);
        
        const count = document.createElement('div');
        count.className = 'item-count';
        count.innerText = item.amount;
        slot.appendChild(count);

        slot.onclick = () => withdraw(item.id, item.name, 1);
        grid.appendChild(slot);
    });
}
