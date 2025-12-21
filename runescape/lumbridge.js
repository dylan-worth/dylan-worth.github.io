import { createGround, createRiver, createBridge, createPath } from './assets_env.js';
import { createBuilding, createFence } from './assets_buildings.js';
import { createInteractable, createTree, createChessTable, createSnowPile, createNPC } from './assets_entities.js';

export function buildLumbridge(scene) {
    // 1. Environment
    createGround(scene, 0x2d5a27); 

    // RIVER FIX:
    // River 1: Ends at z=-20
    createRiver(scene, 35, -50, 15, 60, true); 
    // River 2: Starts at z=65 (Length 100 means extent is 15 to 115)
    // Bridge is at z=10. Gap is now -20 to 15. Safe.
    createRiver(scene, 35, 65, 15, 100, true); 
    
    // Visual Water under bridge (No collision)
    createRiver(scene, 35, 10, 15, 60, false); 
    
    // The Bridge
    createBridge(scene, 35, 10, 18, 6); 

    // 2. Paths
    createPath(scene, 0, 15, 4, 30); 
    createPath(scene, 15, 10, 30, 4, 0);

    // 3. Buildings
    createBuilding(scene, 'lum_castle', 0, -5); 
    createBuilding(scene, 'bobs_axes', -10, 25);
    createBuilding(scene, 'church', 20, 35);
    createFence(scene, 50, 0, 20); 
    createFence(scene, 50, 20, 20);

    // 4. Objects
    createInteractable(scene, 'bank_booth', -5, -8); 
    createInteractable(scene, 'shop_stall', -10, 25); 
    createChessTable(scene, 2, -8);
    createSnowPile(scene, 5, 5);

    // 5. QUEST NPCS (Using new types)
    createNPC(scene, 'cook', 4, -4);    // Inside Castle
    createNPC(scene, 'cow', 52, 5);     // Cow Pen
    createNPC(scene, 'chicken', 48, 15); // Chicken Pen

    // Wheat (Using shop stall as placeholder for now, colored yellow)
    const wheat = createInteractable(scene, 'shop_stall', -15, 35); 
    wheat.children.forEach(c => c.material.color.setHex(0xeedd00)); 
    wheat.userData.name = "Wheat";
    wheat.userData.type = 'quest_npc'; 

    // 6. Normal NPCs
    createNPC(scene, 'man', 10, 10);
    createNPC(scene, 'goblin', 30, 30);

    // 7. Trees
    createTree(scene, 'oak', 55, 5);
    createTree(scene, 'tree', 60, 15);
}
