import { inventory, addCoins, removeCoins, addItem } from './inventory.js';

const shopItems = [
    { id: 'tinderbox', name: 'Tinderbox', price: 10, icon: '🔥' },
    { id: 'axe', name: 'Bronze Axe', price: 15, icon: '🪓' },
    { id: 'logs', name: 'Logs', price: 5, icon: '🪵' }
];

export function openShop() {
    document.getElementById('shop-window').style.display = 'flex';
    document.getElementById('bank-window').style.display = 'none';
    renderShop();
}

function renderShop() {
    const grid = document.getElementById('shop-grid');
    grid.innerHTML = '';

    shopItems.forEach(item => {
        const slot = document.createElement('div');
        slot.className = 'item-slot';
        slot.style.flexDirection = 'column';
        
        slot.innerHTML = `<span style="font-size:16px">${item.icon}</span><span style="color:#ffd700">${item.price}gp</span>`;
        
        // Click to Buy
        slot.onclick = () => {
            if (removeCoins(item.price)) {
                addItem(item.id, item.name, 1);
            } else {
                alert("Not enough coins!");
            }
        };
        grid.appendChild(slot);
    });
}
