import { inventory, addCoins, removeCoins, addItem } from './inventory.js';

// Shop Inventory Definition
const shopItems = [
    { id: 'tinderbox',  name: 'Tinderbox',  price: 10,   icon: '🔥' },
    { id: 'axe_bronze', name: 'Bronze Axe', price: 10,   icon: '🪓' },
    { id: 'axe_iron',   name: 'Iron Axe',   price: 50,   icon: '🪓' },
    { id: 'axe_steel',  name: 'Steel Axe',  price: 200,  icon: '🪓' },
    { id: 'axe_mithril',name: 'Mithril Axe',price: 500,  icon: '🪓' },
    { id: 'axe_adamant',name: 'Adamant Axe',price: 1000, icon: '🪓' },
    { id: 'axe_rune',   name: 'Rune Axe',   price: 4000, icon: '🪓' },
    { id: 'axe_dragon', name: 'Dragon Axe', price: 15000,icon: '🪓' }
];

export function openShop() {
    // UI Management: Show Shop, Hide Bank
    const shopWin = document.getElementById('shop-window');
    const bankWin = document.getElementById('bank-window');
    
    if (shopWin) shopWin.style.display = 'flex';
    if (bankWin) bankWin.style.display = 'none';
    
    renderShop();
}

function renderShop() {
    const grid = document.getElementById('shop-grid');
    if (!grid) return;
    
    grid.innerHTML = '';

    shopItems.forEach(item => {
        const slot = document.createElement('div');
        slot.className = 'item-slot';
        slot.style.flexDirection = 'column'; // Vertical layout for price
        slot.title = item.name; // Tooltip
        
        // Formatting Name: "Mithril Axe" -> "Mithril" to save space
        let displayName = item.name.split(' ')[0];
        if (displayName === 'Tinderbox') displayName = 'Tinder';

        // HTML Content
        slot.innerHTML = `
            <span style="font-size:14px; margin-bottom:2px;">${item.icon}</span>
            <span style="font-size:9px; color:#aaa; margin-bottom:2px;">${displayName}</span>
            <span style="color:#ffd700; font-size:10px;">${item.price}gp</span>
        `;
        
        // Buy Interaction
        slot.onclick = () => {
            if (removeCoins(item.price)) {
                if (addItem(item.id, item.name, 1)) {
                    // Visual feedback could go here
                    console.log(`Bought ${item.name}`);
                } else {
                    // Refund if inventory full
                    addCoins(item.price); 
                    alert("Inventory Full!");
                }
            } else {
                alert("You need more coins!");
            }
        };
        
        grid.appendChild(slot);
    });
}
