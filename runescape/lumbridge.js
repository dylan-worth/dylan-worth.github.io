import { createGround, createPath } from './assets_env.js';
import { createBuilding } from './assets_buildings.js';
import { createTree, createNPC, createInteractable, createChessTable, createSnowPile, createLantern } from './assets_entities.js';
import { addChatMessage } from './chat.js';
import { getObjectById } from './id_map.js';

let hansNPC = null;
let currentHansTarget = 0;
const hansPath = [
    { x: 8.2,  z: 23.1 }, 
    { x: -8.2, z: 23.1 }, 
    { x: -8.2, z: 15.0 }, 
    { x: 8.2,  z: 15.0 }  
];

export async function buildLumbridge(scene) {
    // 1. ENVIRONMENT
    createGround(scene, 0x2d5a27); 
    createBuilding(scene, 'lum_castle', 0, -5); 

    // 2. DATA-DRIVEN TREES (Safe Fetch Method)
    try {
        const response = await fetch('./tree.json');
        const data = await response.json();
        
        data.trees.forEach(entry => {
            const config = getObjectById(entry.id);
            if (config && config.type === 'tree') {
                createTree(scene, config.name, entry.x, entry.z);
            }
        });
    } catch (e) {
        console.error("Could not load tree.json:", e);
    }

    // 3. REMAINING SETUP
    createPath(scene, 0, 25, 6, 30);  
    createPath(scene, 0, -35, 6, 30); 
    setupGuards(scene);
    hansNPC = createNPC(scene, 'hans', 8.2, 23.1);
    createNPC(scene, 'cook', 0, -5); 
    
    createBuilding(scene, 'church', 45, -5);
    createBuilding(scene, 'bobs_axes', -35, -5);
}

// ... (rest of setupGuards and updateHans functions remain the same)
