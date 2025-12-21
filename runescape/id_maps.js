export const OBJECT_IDS = {
    1: { name: 'tree', type: 'tree', xp: 25 },
    2: { name: 'oak', type: 'tree', xp: 37 },
    3: { name: 'willow', type: 'tree', xp: 60 },
    10: { name: 'bank_booth', type: 'interactable' },
    20: { name: 'hans', type: 'npc' },
    21: { name: 'cook', type: 'npc' }
};

export function getObjectById(id) {
    return OBJECT_IDS[id] || null;
}
