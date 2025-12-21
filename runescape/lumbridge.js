import { createGround, createRiver, createBridge, createPath, createBuilding, createInteractable, createTree, createFence } from './assets.js';

export function buildLumbridge(scene) {
    console.log("Building Lumbridge Layout...");

    // 1. GROUND & RIVER
    createGround(scene, 0x2d5a27); // Grass
    createRiver(scene, 35, 0, 15, 200); // River at x=35
    createBridge(scene, 35, 10); // Bridge at z=10

    // 2. PATHS
    // Path South from Castle
    createPath(scene, 0, 15, 4, 30); 
    // Path East to Bridge
    createPath(scene, 15, 10, 30, 4, 0);

    // 3. CASTLE (West Side)
    // Castle Center
    createBuilding(scene, 'lum_castle', 0, -5); 
    // Bank inside Castle (shifted so it doesn't block door)
    createInteractable(scene, 'bank_booth', -5, -8); 

    // 4. TOWN BUILDINGS
    // Bob's Axes (South)
    createBuilding(scene, 'bobs_axes', -10, 25);
    createInteractable(scene, 'shop_stall', -10, 25); 

    // Church (South East)
    createBuilding(scene, 'church', 20, 35);

    // 5. GOBLIN AREA (East of River)
    createFence(scene, 50, 0, 20); 
    createFence(scene, 50, 20, 20);
    
    // Trees
    createTree(scene, 'oak', 55, 5);
    createTree(scene, 'tree', 60, 15);
    createTree(scene, 'oak', 50, -5);
}
