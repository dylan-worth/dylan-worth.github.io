import { addItem } from './inventory.js';
import { addChatMessage } from './chat.js';

const DROP_TABLES = {
    'man': [
        { id: 'bones', name: 'Bones', chance: 1.0, min: 1, max: 1 },
        { id: 'coins', name: 'Coins', chance: 0.7, min: 3, max: 20 },
        { id: 'dagger_bronze', name: 'Bronze Dagger', chance: 0.1, min: 1, max: 1 }
    ],
    'woman': [
        { id: 'bones', name: 'Bones', chance: 1.0, min: 1, max: 1 },
        { id: 'coins', name: 'Coins', chance: 0.7, min: 3, max: 20 },
        { id: 'dagger_bronze', name: 'Bronze Dagger', chance: 0.1, min: 1, max: 1 }
    ],
    'goblin': [
        { id: 'bones', name: 'Bones', chance: 1.0, min: 1, max: 1 },
        { id: 'coins', name: 'Coins', chance: 0.5, min: 1, max: 15 },
        { id: 'axe_bronze', name: 'Bronze Axe', chance: 0.05, min: 1, max: 1 }
    ]
};

export function rollLoot(npcType) {
    const table = DROP_TABLES[npcType];
    if (!table) return;

    let drops = [];

    table.forEach(entry => {
        if (Math.random() < entry.chance) {
            const amount = Math.floor(Math.random() * (entry.max - entry.min + 1)) + entry.min;
            
            // For now, add directly to inventory
            // (In a full engine, this would spawn a Ground Item)
            if (addItem(entry.id, entry.name, amount)) {
                drops.push(`${amount}x ${entry.name}`);
            } else {
                addChatMessage(`You couldn't take the ${entry.name} (Inv full).`, "red");
            }
        }
    });

    if (drops.length > 0) {
        addChatMessage(`Loot: ${drops.join(', ')}`, "lime");
    }
}
