import { createGround, createRiver, createBridge, createPath, createBuilding, createInteractable, createTree, createFence } from './assets.js';

export function buildLumbridge(scene) {
    console.log("Building Lumbridge...");

    // 1. GROUND & RIVER
    createGround(scene, 0x2d5a27); // Grass
    
    // River Lum (East side, running N/S)
    createRiver(scene, 35, 0, 15, 200);

    // Bridge (Connecting to Goblin area)
    createBridge(scene, 35, 10);

    // 2. PATHS (Dirt Walkways)
    // Path from Castle Gate (0, 8) Southwards
    createPath(scene, 0, 15, 4, 30); 
    // Path East to Bridge
    createPath(scene, 15, 10, 30, 4, 0);

    // 3. CASTLE (West Side)
    // Castle Center at 0,0. 
    createBuilding(scene, 'lum_castle', 0, -5); 
    
    // BANK (Inside Castle - Top Floor logic simulated by putting it in NW corner)
    // Placed at (-5, -5) to be inside the walls but not blocking the door at z=8
    createInteractable(scene, 'bank_booth', -5, -8); 

    // 4. TOWN BUILDINGS
    // Bob's Axes (South of Castle)
    createBuilding(scene, 'bobs_axes', -10, 25);
    createInteractable(scene, 'shop_stall', -10, 25); // Inside Bob's

    // Church (South East, near River)
    createBuilding(scene, 'church', 20, 35);
    // Church Altar/Interactable could go here

    // 5. GOBLIN AREA (East of River)
    // Fences
    createFence(scene, 50, 0, 20); // North Fence
    createFence(scene, 50, 20, 20); // South Fence
    
    // Training Trees
    createTree(scene, 'oak', 55, 5);
    createTree(scene, 'tree', 60, 15);
    createTree(scene, 'oak', 50, -5);
}
