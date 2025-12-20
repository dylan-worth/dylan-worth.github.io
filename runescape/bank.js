import { inventory, addItem, removeItem } from './inventory.js';

const bankItems = [
    { id: 'logs', name: 'Logs', amount: 100 },
    { id: 'fish', name: 'Raw Shrimp', amount: 50 }
];

export function openBank() {
    document.getElementById('bank-window').style.display = 'flex';
    document.getElementById('shop-window').style.display = 'none';
    renderBank();
}

function renderBank() {
    const grid = document.getElementById('bank-grid');
    grid.innerHTML = '';

    bankItems.forEach(item => {
        const slot = document.createElement('div');
        slot.className = 'item-slot';
        
        let icon = '❓';
        if(item.id === 'logs') icon = '🪵';
        if(item.id === 'fish') icon = '🐟';

        slot.innerHTML = `<span>${icon}</span><span class="item-count">${item.amount}</span>`;
        
        // Click to Withdraw
        slot.onclick = () => {
            if (item.amount > 0) {
                if(addItem(item.id, item.name, 1)) {
                    item.amount--;
                    renderBank();
                }
            }
        };
        grid.appendChild(slot);
    });
}
