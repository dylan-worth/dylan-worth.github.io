import { addCoins, removeCoins, addItem, removeItem } from './inventory.js';

const shopItems = [
    { id: 'axe_bronze', name: 'Bronze Axe', price: 10 },
    { id: 'axe_iron', name: 'Iron Axe', price: 50 },
    { id: 'axe_steel', name: 'Steel Axe', price: 200 },
    { id: 'tinderbox', name: 'Tinderbox', price: 10 }
];

export function openShop() {
    document.getElementById('bank-window').style.display = 'none';
    document.getElementById('shop-window').style.display = 'flex';
    window.gameState.uiMode = 'shop';
    renderShop();
}

function renderShop() {
    const grid = document.getElementById('shop-grid');
    grid.innerHTML = '';
    
    shopItems.forEach(item => {
        const slot = document.createElement('div');
        slot.className = 'item-slot';
        slot.style.flexDirection = 'column';
        slot.innerHTML = `<span>${getIcon(item.id)}</span><span style="font-size:10px; color:gold">${item.price}gp</span>`;
        slot.title = item.name;
        // Buy
        slot.onclick = () => {
            if(removeCoins(item.price)) {
                if(!addItem(item.id, item.name, 1)) addCoins(item.price); // Refund
            }
        };
        grid.appendChild(slot);
    });
}

// Called by main.js via window.game.sell
export function sell(invItem) {
    // Sell for 5 coins hardcoded for now
    removeItem(invItem.id, 1);
    addCoins(5); 
}

function getIcon(id) {
    if(id.includes('axe')) return '🪓';
    if(id === 'tinderbox') return '🔥';
    return '❓';
}
