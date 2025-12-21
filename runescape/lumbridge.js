import { createGround, createRiver, createBridge, createPath } from './assets_env.js';
import { createBuilding, createFence } from './assets_buildings.js';
import { createInteractable, createTree, createChessTable, createSnowPile, createNPC } from './assets_entities.js';
import * as THREE from 'three';

export function buildLumbridge(scene) {
    // Environment
    createGround(scene, 0x2d5a27); 
    createRiver(scene, 35, -50, 15, 60, true); 
    createRiver(scene, 35, 60, 15, 100, true); 
    createRiver(scene, 35, 10, 15, 60, false); 
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
    createSnowPile(scene, 5, 5);

    // --- QUEST NPCS ---
    // 1. The Cook (Inside Castle)
    const cook = createNPC(scene, 'man', 4, -4);
    cook.children[0].children[0].material.color.setHex(0xffffff); // White Apron
    cook.userData.name = "Cook"; // Override name for Quest

    // 2. The Cow (Near Fence)
    const cow = createNPC(scene, 'man', 52, 5); // Using 'man' as placeholder model
    cow.children[0].children[0].material.color.setHex(0x000000); // Black/White Cow
    cow.scale.set(1.5, 0.8, 1); // Horizontal stretch
    cow.userData.name = "Cow";
    cow.userData.type = 'quest_npc'; // Tag

    // 3. The Chicken (Near Fence)
    const chicken = createNPC(scene, 'man', 48, 15);
    chicken.scale.set(0.3, 0.3, 0.3); // Tiny
    chicken.children[0].children[0].material.color.setHex(0xccaa88); 
    chicken.userData.name = "Chicken";
    chicken.userData.type = 'quest_npc';

    // 4. Wheat Field (North)
    const wheat = createInteractable(scene, 'shop_stall', -15, 35); // Placeholder
    wheat.children.forEach(c => c.material.color.setHex(0xeedd00)); // Yellow
    wheat.userData.name = "Wheat";
    wheat.userData.type = 'quest_npc'; // Treat as NPC for talking/interaction

    // Trees
    createTree(scene, 'oak', 55, 5);
    createTree(scene, 'tree', 60, 15);
}
