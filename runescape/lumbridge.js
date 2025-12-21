import { createGround, createRiver, createBridge, createPath } from './assets_env.js';
import { createBuilding, createFence } from './assets_buildings.js';
import { createInteractable, createTree, createChessTable, createSnowPile } from './assets_entities.js';

export function buildLumbridge(scene) {
    createGround(scene, 0x2d5a27); 

    // 1. South River (Solid)
    createRiver(scene, 35, -50, 15, 60, true); 
    // 2. North River (Solid)
    createRiver(scene, 35, 60, 15, 100, true); 
    
    // 3. BRIDGE WATER (Visual Only, No Collision)
    createRiver(scene, 35, 10, 15, 60, false); 
    
    // 4. The Bridge itself
    createBridge(scene, 35, 10, 18, 6); 

    // Paths
    createPath(scene, 0, 15, 4, 30); 
    createPath(scene, 15, 10, 30, 4, 0);

    // Buildings
    createBuilding(scene, 'lum_castle', 0, -5); 
    createBuilding(scene, 'bobs_axes', -10, 25);
    createBuilding(scene, 'church', 20, 35);
    createFence(scene, 50, 0, 20); 
    createFence(scene, 50, 20, 20);

    // Objects
    createInteractable(scene, 'bank_booth', -5, -8); 
    createInteractable(scene, 'shop_stall', -10, 25); 
    createChessTable(scene, 2, -8);

    // SNOW PILES
    createSnowPile(scene, 5, 5);
    createSnowPile(scene, -5, 20);
    createSnowPile(scene, 45, 10);

    // Trees
    createTree(scene, 'oak', 55, 5);
    createTree(scene, 'tree', 60, 15);
    createTree(scene, 'oak', 50, -5);
}
