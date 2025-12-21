import { createGround, createRiver, createBridge, createPath } from './assets_env.js';
import { createBuilding, createFence } from './assets_buildings.js';
import { createInteractable, createTree, createChessTable } from './assets_entities.js';

export function buildLumbridge(scene) {
    console.log("Building Lumbridge...");

    // 1. ENVIRONMENT
    createGround(scene, 0x2d5a27); 

    // --- FIX: Split River into 2 parts to leave a gap for the bridge ---
    // River Part 1 (South of bridge)
    createRiver(scene, 35, -50, 15, 60); 
    // River Part 2 (North of bridge) - Starts at z=14 to leave gap
    createRiver(scene, 35, 60, 15, 100); 

    // Bridge fits in the gap (z=10 to z=14 approx)
    createBridge(scene, 35, 10, 18, 6); 

    // 2. PATHS
    createPath(scene, 0, 15, 4, 30); 
    createPath(scene, 15, 10, 30, 4, 0);

    // 3. BUILDINGS
    createBuilding(scene, 'lum_castle', 0, -5); 
    createBuilding(scene, 'bobs_axes', -10, 25);
    createBuilding(scene, 'church', 20, 35);
    
    createFence(scene, 50, 0, 20); 
    createFence(scene, 50, 20, 20);

    // 4. OBJECTS
    createInteractable(scene, 'bank_booth', -5, -8); 
    createInteractable(scene, 'shop_stall', -10, 25); 
    createChessTable(scene, 2, -8);

    // 5. TREES
    createTree(scene, 'oak', 55, 5);
    createTree(scene, 'tree', 60, 15);
    createTree(scene, 'oak', 50, -5);
}
