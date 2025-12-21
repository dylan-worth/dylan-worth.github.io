import { createGround, createRiver, createBridge, createPath } from './assets_env.js';
import { createBuilding, createFence } from './assets_buildings.js';
import { createInteractable, createTree, createChessTable, createSnowPile, createNPC, createLantern } from './assets_entities.js';

/**
 * Builds the Lumbridge region with the upgraded Castle Moat and complex geometry.
 * We have ensured the castle is centered on an island with a functional drawbridge.
 */
export function buildLumbridge(scene) {
    // 1. ENVIRONMENT & GROUND
    createGround(scene, 0x2d5a27); 

    // 2. THE MOAT (Encircling the Castle Island)
    // Front moat
    createRiver(scene, 0, -15, 20, 4, false); 
    // Back moat
    createRiver(scene, 0, 10, 20, 4, false);  
    // Left moat
    createRiver(scene, -12, -5, 4, 25, true); 
    // Right moat
    createRiver(scene, 12, -5, 4, 25, true);  

    // 3. THE UPGRADED CASTLE
    // This now uses the complex geometry with towers and spires
    createBuilding(scene, 'lum_castle', 0, -5); 

    // 4. DRAWBRIDGE
    // Connects the mainland to the castle island over the front moat
    createBridge(scene, 0, -15, 6, 8); 

    // 5. CITY PATHS
    createPath(scene, 0, -25, 4, 30); // Main path leading to bridge
    createPath(scene, 20, -20, 30, 4, 0); // Path toward the Church

    // 6. BUILDINGS & INFRASTRUCTURE
    createBuilding(scene, 'church', 25, 15);
    createBuilding(scene, 'bobs_axes', -20, 10);
    
    // Lanterns for night-time visibility
    createLantern(scene, 5, -18); 
    createLantern(scene, -5, -18);
    createLantern(scene, 20, 10);

    // 7. INTERACTABLES
    createInteractable(scene, 'bank_booth', 0, -3); 
    createChessTable(scene, 4, -2);
    createSnowPile(scene, -6, 2);

    // 8. POPULATION (NPCs)
    createNPC(scene, 'cook', 0, 0); // Located inside the main keep
    createNPC(scene, 'man', 10, -22);
    createNPC(scene, 'goblin', -20, -25);
    createNPC(scene, 'cow', 40, 5);

    // 9. USER SPECIFIC TREES (From your coordinates)
    createTree(scene, 'tree', -2.9, 7.4);
    createTree(scene, 'tree', -3.7, 14.7);
    createTree(scene, 'tree', 4.1, 13.2);

    // 10. REGIONAL FOREST GENERATION
    for(let i=0; i<60; i++) {
        const x = (Math.random() * 180) - 90; 
        const z = (Math.random() * 180) - 90;
        
        // Exclusion Zone: Don't spawn trees inside the moat or castle island
        if (Math.abs(x) < 18 && Math.abs(z + 5) < 18) continue;
        
        // Don't spawn on the main paths
        if (Math.abs(x) < 5 && z < -10) continue;

        const type = Math.random() > 0.7 ? 'oak' : 'tree';
        createTree(scene, type, x, z);
    }
}
