import { createGround, createRiver, createBridge, createPath } from './assets_env.js';
import { createBuilding, createFence } from './assets_buildings.js';
import { createInteractable, createTree, createChessTable, createSnowPile, createNPC, createLantern } from './assets_entities.js';

export function buildLumbridge(scene) {
    // 1. Environment
    createGround(scene, 0x2d5a27); 
    createRiver(scene, 35, -50, 15, 60, true); 
    createRiver(scene, 35, 65, 15, 100, true); 
    createRiver(scene, 35, 10, 15, 60, false); 
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

    // 4. Lanterns
    createLantern(scene, 5, -15); 
    createLantern(scene, -5, 20); 
    createLantern(scene, 15, 10); 
    createLantern(scene, 20, 30); 

    // 5. Objects
    createInteractable(scene, 'bank_booth', -5, -8); 
    createInteractable(scene, 'shop_stall', -10, 25); 
    createChessTable(scene, 2, -8);
    createSnowPile(scene, 5, 5);

    // 6. Quest NPCs
    createNPC(scene, 'cook', 4, -4);    
    createNPC(scene, 'cow', 52, 5);     
    createNPC(scene, 'chicken', 48, 15); 
    const wheat = createInteractable(scene, 'shop_stall', -15, 35); 
    wheat.children.forEach(c => c.material.color.setHex(0xeedd00)); 
    wheat.userData.name = "Wheat"; wheat.userData.type = 'quest_npc'; 

    // 7. Standard NPCs
    createNPC(scene, 'man', 10, 10);
    createNPC(scene, 'goblin', 30, 30);

    // 8. USER PLACED TREES (From your screenshot)
    createTree(scene, 'tree', -2.9, 7.4);
    createTree(scene, 'tree', -3.7, 14.7);
    createTree(scene, 'tree', 4.1, 13.2);

    // 9. FOREST GENERATION (Random Trees)
    createTree(scene, 'oak', 55, 5);
    createTree(scene, 'tree', 60, 15);
    
    // Random filler trees
    for(let i=0; i<80; i++) {
        const x = (Math.random() * 180) - 90; 
        const z = (Math.random() * 180) - 90;
        
        // Exclusion Zone (Castle & River)
        if ((x > -20 && x < 20 && z > -20 && z < 20) || (x > 25 && x < 45)) continue;

        const type = Math.random() > 0.5 ? 'oak' : 'tree';
        createTree(scene, type, x, z);
    }
}
