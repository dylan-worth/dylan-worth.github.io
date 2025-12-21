import { createGround, createPath } from './assets_env.js';
import { createBuilding } from './assets_buildings.js';
import { createTree, createNPC, createInteractable, createChessTable, createSnowPile, createLantern } from './assets_entities.js';
import { addChatMessage } from './chat.js';
import { getObjectById } from './id_map.js';

// Import JSON data (Ensure your bundler/server supports JSON imports)
import treeData from './tree.json' assert { type: 'json' };

// Hans Patrol State
let hansNPC = null;
let currentHansTarget = 0;
const hansPath = [
    { x: 8.2,  z: 23.1 }, 
    { x: -8.2, z: 23.1 }, 
    { x: -8.2, z: 15.0 }, 
    { x: 8.2,  z: 15.0 }  
];

/**
 * Builds Lumbridge using external JSON data for object placement.
 */
export function buildLumbridge(scene) {
    // 1. STATIC ENVIRONMENT
    createGround(scene, 0x2d5a27); 
    createBuilding(scene, 'lum_castle', 0, -5); 

    // 2. DATA-DRIVEN TREES (from tree.json)
    treeData.trees.forEach(entry => {
        const config = getObjectById(entry.id);
        if (config && config.type === 'tree') {
            createTree(scene, config.name, entry.x, entry.z);
        }
    });

    // 3. THROUGH-PATHS
    createPath(scene, 0, 25, 6, 30);  
    createPath(scene, 0, -35, 6, 30); 
    createPath(scene, 30, -5, 30, 6, 0); 

    // 4. THE CASTLE GUARDS (Greeting Logic)
    setupGuards(scene);

    // 5. UNIQUE NPCs
    hansNPC = createNPC(scene, 'hans', 8.2, 23.1);
    createNPC(scene, 'cook', 0, -5); 

    // 6. INTERACTIVE OBJECTS
    const bankConfig = getObjectById(10); // ID 10 = Bank Booth
    if(bankConfig) createInteractable(scene, bankConfig.name, -10, -5);
    
    createChessTable(scene, 10, -5);
    createSnowPile(scene, -10, 5);

    // 7. EXTERIOR BUILDINGS
    createBuilding(scene, 'church', 45, -5);
    createBuilding(scene, 'bobs_axes', -35, -5);
    
    // 8. WORLD LIGHTING
    createLantern(scene, 6, 12); 
    createLantern(scene, -6, 12);
}

/**
 * Internal helper to setup guards and their proximity triggers.
 */
function setupGuards(scene) {
    const guards = [
        createNPC(scene, 'man', -4, 14),
        createNPC(scene, 'man', 4, 14)
    ];

    guards.forEach(g => {
        g.userData.name = "Castle Guard";
        g.userData.hasGreeted = false;
        g.children.forEach(c => { if (c.material) c.material.color.setHex(0xcccccc); });
    });

    setInterval(() => {
        if (!window.gameState.player) return;
        guards.forEach(guard => {
            const dist = guard.position.distanceTo(window.gameState.player.position);
            if (dist < 6 && !guard.userData.hasGreeted) {
                addChatMessage(`${guard.userData.name}: Welcome to Lumbridge, traveler!`, "white");
                guard.userData.hasGreeted = true;
                setTimeout(() => { guard.userData.hasGreeted = false; }, 45000);
            }
        });
    }, 1000);
}

/**
 * Updates Hans's patrol movement (called in main.js loop).
 */
export function updateHans() {
    if (!hansNPC) return;

    const target = hansPath[currentHansTarget];
    const dx = target.x - hansNPC.position.x;
    const dz = target.z - hansNPC.position.z;
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist < 0.2) {
        currentHansTarget = (currentHansTarget + 1) % hansPath.length;
    } else {
        const speed = 0.035;
        hansNPC.position.x += (dx / dist) * speed;
        hansNPC.position.z += (dz / dist) * speed;
        hansNPC.rotation.y = Math.atan2(dx, dz);
    }
}
