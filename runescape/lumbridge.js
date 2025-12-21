import { createGround, createRiver, createBridge, createPath } from './assets_env.js';
import { createBuilding, createFence } from './assets_buildings.js';
// We added createChessTable to the imports here
import { createInteractable, createTree, createChessTable } from './assets_entities.js';

export function buildLumbridge(scene) {
    console.log("Building Lumbridge...");

    // 1. ENVIRONMENT
    createGround(scene, 0x2d5a27); // Dark Green Grass
    createRiver(scene, 35, 0, 15, 200);
    createBridge(scene, 35, 10, 18, 6); 

    // 2. PATHS
    // Path from Castle to Bridge
    createPath(scene, 0, 15, 4, 30); 
    // Path along the river
    createPath(scene, 15, 10, 30, 4, 0);

    // 3. BUILDINGS
    createBuilding(scene, 'lum_castle', 0, -5); 
    createBuilding(scene, 'bobs_axes', -10, 25);
    createBuilding(scene, 'church', 20, 35);
    
    // Fences near the cows/goblins area
    createFence(scene, 50, 0, 20); 
    createFence(scene, 50, 20, 20);

    // 4. OBJECTS & FURNITURE
    createInteractable(scene, 'bank_booth', -5, -8); // Bank inside/near castle
    createInteractable(scene, 'shop_stall', -10, 25); // Shop near Bob's
    
    // The New Chess Table (Inside Castle Courtyard)
    createChessTable(scene, 2, -8);

    // 5. TREES
    createTree(scene, 'oak', 55, 5);
    createTree(scene, 'tree', 60, 15);
    createTree(scene, 'oak', 50, -5);
}
