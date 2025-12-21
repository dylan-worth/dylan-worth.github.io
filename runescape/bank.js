import { addItem, removeItem } from './inventory.js';

const bankItems = [
    { id: 'logs', name: 'Logs', amount: 50 },
    { id: 'axe_rune', name: 'Rune Axe', amount: 1 }
];

export function openBank() {
    document.getElementById('shop-window').style.display = 'none';
    document.getElementById('bank-window').style.display = 'flex';
    window.gameState.uiMode = 'bank'; // Tell inventory we are banking
    renderBank();
}

function renderBank() {
    const grid = document.getElementById('bank-grid');
    grid.innerHTML = '';
    
    bankItems.forEach(item => {
        const slot = document.createElement('div');
        slot.className = 'item-slot';
        slot.innerHTML = `<span>${getIcon(item.id)}</span><span class="item-count">${item.amount}</span>`;
        slot.title = item.name;
        // Withdraw
        slot.onclick = () => {
            if(item.amount > 0 && addItem(item.id, item.name, 1)) {
                item.amount--;
                renderBank();
            }
        };
        grid.appendChild(slot);
    });
}

// Called by main.js via window.game.deposit
export function deposit(invItem) {
    let bItem = bankItems.find(i => i.id === invItem.id);
    if(bItem) bItem.amount++;
    else bankItems.push({ id: invItem.id, name: invItem.name, amount: 1 });
    
    removeItem(invItem.id, 1);
    renderBank();
}

function getIcon(id) {
    if(id.includes('axe')) return '🪓';
    if(id === 'logs') return '🪵';
    return '📦';
}
