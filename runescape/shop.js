import { addItem, removeItem, getCoins, addCoins, removeCoins } from './inventory.js';
import { addChatMessage } from './chat.js';

const SHOP_ITEMS = [
    { id: 'axe_bronze', name: 'Bronze Axe', price: 15 },
    { id: 'axe_iron', name: 'Iron Axe', price: 50 },
    { id: 'dagger_bronze', name: 'Bronze Dagger', price: 20 }
];

export function openShop() {
    const shopWindow = document.getElementById('shop-window');
    if (shopWindow) {
        shopWindow.style.display = 'flex';
        updateShopUI();
        window.gameState.uiMode = 'shop';
        addChatMessage("You open the shop.", "yellow");
    }
}

export function sell(id, name, amount) {
    // Simple sell logic: Sell for 1 coin
    if (removeItem(id, amount)) {
        addCoins(1);
        addChatMessage(`You sold ${name} for 1 coin.`, "lime");
    }
}

export function buy(itemId) {
    const item = SHOP_ITEMS.find(i => i.id === itemId);
    if (!item) return;

    const currentCoins = getCoins();

    if (currentCoins >= item.price) {
        if (addItem(item.id, item.name, 1)) {
            removeCoins(item.price);
            addChatMessage(`Bought ${item.name} for ${item.price} coins.`, "lime");
        }
    } else {
        addChatMessage("You don't have enough coins!", "red");
    }
}

function updateShopUI() {
    const grid = document.getElementById('shop-grid');
    if (!grid) return;
    grid.innerHTML = '';

    SHOP_ITEMS.forEach(item => {
        const slot = document.createElement('div');
        slot.className = 'item-slot';
        slot.style.borderColor = "gold";
        slot.innerText = item.name.substring(0, 2);
        
        // Price Tag
        const price = document.createElement('div');
        price.className = 'item-count';
        price.style.color = "lime";
        price.innerText = item.price + "gp";
        slot.appendChild(price);

        slot.onclick = () => buy(item.id);
        grid.appendChild(slot);
    });
}
