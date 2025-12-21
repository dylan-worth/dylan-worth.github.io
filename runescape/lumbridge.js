import { createGround, createRiver, createBridge, createBuilding, createInteractable, createTree, createFence } from './assets.js';

export function buildLumbridge(scene) {
    console.log("Building Custom Lumbridge Map...");

    // 1. GROUND & RIVER
    createGround(scene, 0x2d5a27); // Dark Green Grass
    
    // River Lum (East of Castle)
    // Runs North to South (z: -100 to 100) at x: 25
    createRiver(scene, 25, 0, 12, 200);

    // Bridge to Goblin side
    createBridge(scene, 25, 5); // x=25, z=5

    // 2. CASTLE (Center)
    // We place the main keep and the walls
    createBuilding(scene, 'lum_castle', 0, 0); 
    
    // Bank Booth inside the castle courtyard/foyer
    createInteractable(scene, 'bank_booth', 0, 5);

    // 3. TOWN BUILDINGS
    // General Store (North)
    createBuilding(scene, 'general_store', -10, -25);
    createInteractable(scene, 'shop_stall', -10, -22); // Outside store
    
    // Church (South East of Castle, near river)
    createBuilding(scene, 'church', 10, 20);

    // 4. FENCES & PATHS
    // Fence blocking the goblin side (East side of river)
    createFence(scene, 40, -10, 15); // North part of goblin field
    createFence(scene, 40, 20, 15);  // South part of goblin field

    // 5. TREES & NPCS (Static placement for "Handcrafted" look)
    
    // -- West Woods (behind General Store) --
    createTree(scene, 'tree', -25, -30);
    createTree(scene, 'tree', -35, -25);
    createTree(scene, 'tree', -30, -15);
    createTree(scene, 'oak', -40, -10); // Big Oak

    // -- Graveyard / Swamp area (South) --
    createTree(scene, 'tree', -5, 35);
    createTree(scene, 'tree', 5, 40);

    // -- Goblin/Cow Field (East across bridge) --
    // These are the "training" trees
    createTree(scene, 'oak', 35, 0);
    createTree(scene, 'oak', 45, 5);
    createTree(scene, 'tree', 40, 15);
    createTree(scene, 'tree', 35, -5);
}
