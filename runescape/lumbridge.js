import { createGround, createRiver, createBridge, createPath } from './assets_env.js';
import { createBuilding, createFence } from './assets_buildings.js';
import { createInteractable, createTree, createChessTable, createSnowPile, createNPC, createLantern } from './assets_entities.js';

/**
 * Builds the Lumbridge region with the upgraded Castle Moat design and complex geometry.
 * We have ensured the castle is accessible and guarded.
 */
export function buildLumbridge(scene) {
    // 1. BASE ENVIRONMENT
    createGround(scene, 0x2d5a27); 

    // 2. THE MOAT (Encircling the Castle Island)
    createRiver(scene, 0, -15, 20, 4, false); // Front
    createRiver(scene, 0, 10, 20, 4, false);  // Back
    createRiver(scene, -12, -5, 4, 25, true); // Left
    createRiver(scene, 12, -5, 4, 25, true);  // Right

    // 3. THE UPGRADED CASTLE (Accessible Entrance)
    createBuilding(scene, 'lum_castle', 0, -5); 

    // 4. THE DRAWBRIDGE
    createBridge(scene, 0, -15, 6, 8); 

    // 5. THE CASTLE GUARDS (Stationed at the bridge entrance)
    const guardL = createNPC(scene, 'man', -2.5, -18);
    guardL.userData.name = "Castle Guard";
    // Apply silver armor coloring to the guard's mesh parts
    guardL.children.forEach(c => {
        if (c.material) c.material.color.setHex(0xcccccc); 
    });

    const guardR = createNPC(scene, 'man', 2.5, -18);
    guardR.userData.name = "Castle Guard";
    guardR.children.forEach(c => {
        if (c.material) c.material.color.setHex(0xcccccc);
    });

    // 6. CITY PATHS & INFRASTRUCTURE
    createPath(scene, 0, -25, 4, 30);      // Main entrance path
    createPath(scene, 20, -20, 30, 4, 0);  // East path to Church
    
    createBuilding(scene, 'church', 25, 15);
    createBuilding(scene, 'bobs_axes', -20, 10);
    
    // Lanterns for night-time illumination
    createLantern(scene, 5, -18); 
    createLantern(scene, -5, -18);
    createLantern(scene, 20, 10);

    // 7. KEY INTERACTABLES & INTERIOR NPCS
    createInteractable(scene, 'bank_booth', 0, -3); 
    createNPC(scene, 'cook', 0, 0); // Inside the main keep
    createChessTable(scene, 4, -2);
    createSnowPile(scene, -6, 2);

    // 8. WORLD POPULATION
    createNPC(scene, 'man', 10, -25);
    createNPC(scene, 'goblin', -20, -30);
    createNPC(scene, 'cow', 45, 5);

    // 9. USER SPECIFIC TREES (From your coordinates)
    createTree(scene, 'tree', -2.9, 7.4);
    createTree(scene, 'tree', -3.7, 14.7);
    createTree(scene, 'tree', 4.1, 13.2);

    // 10. REGIONAL FOREST GENERATION
    for(let i=0; i<60; i++) {
        const x = (Math.random() * 180) - 90; 
        const z = (Math.random() * 180) - 90;
        
        // Exclusion Zone: No trees inside the moat or on the castle island
        if (Math.abs(x) < 18 && Math.abs(z + 5) < 18) continue;
        
        // Don't spawn trees directly on the main south path
        if (Math.abs(x) < 4 && z < -15) continue;

        const type = Math.random() > 0.7 ? 'oak' : 'tree';
        createTree(scene, type, x, z);
    }
}
