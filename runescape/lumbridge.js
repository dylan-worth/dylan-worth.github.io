import { createGround, createPath } from './assets_env.js';
import { createBuilding } from './assets_buildings.js';
import { createTree, createNPC, createInteractable, createChessTable, createSnowPile, createLantern } from './assets_entities.js';
import { addChatMessage } from './chat.js';
import { getObjectById } from './id_map.js';

// Load our external tree coordinate data
import treeData from './tree.json' assert { type: 'json' };

// --- HANS PATROL STATE ---
let hansNPC = null;
let currentHansTarget = 0;
const hansPath = [
    { x: 8.2,  z: 23.1 }, // Point A (Start)
    { x: -8.2, z: 23.1 }, // Point B
    { x: -8.2, z: 15.0 }, // Point C
    { x: 8.2,  z: 15.0 }  // Point D
];

/**
 * The Master Lumbridge Level Builder.
 */
export function buildLumbridge(scene) {
    // 1. BASE GROUND & LARGE CASTLE
    // The Great Hall spans x: [-15, 15] and z: [-20, 10]
    createGround(scene, 0x2d5a27); 
    createBuilding(scene, 'lum_castle', 0, -5); 

    // 2. DATA-DRIVEN TREES (from tree.json)
    // We iterate through the JSON to place every manual tree via ID Map
    treeData.trees.forEach(entry => {
        const config = getObjectById(entry.id);
        if (config && config.type === 'tree') {
            createTree(scene, config.name, entry.x, entry.z);
        }
    });

    // 3. THROUGH-PATHS
    createPath(scene, 0, 25, 6, 30);      // South Entrance Path
    createPath(scene, 0, -35, 6, 30);     // North Exit Path
    createPath(scene, 30, -5, 30, 6, 0);  // East path to Church

    // 4. THE CASTLE GUARDS (Greeting Triggers)
    setupGuards(scene);

    // 5. UNIQUE NPCs
    hansNPC = createNPC(scene, 'hans', 8.2, 23.1); // Patrol Start
    createNPC(scene, 'cook', 0, -5);               // Inside Castle Center

    // 6. INTERACTIVE & DECORATIVE OBJECTS
    // Bank booth positioned inside the castle
    const bankConfig = getObjectById(10);
    if(bankConfig) createInteractable(scene, bankConfig.name, -10, -5);
    
    createChessTable(scene, 10, -5);
    createSnowPile(scene, -10, 5);

    // 7. EXTERIOR CITY BUILDINGS
    createBuilding(scene, 'church', 45, -5);
    createBuilding(scene, 'bobs_axes', -35, -5);
    
    // 8. CITY LIGHTING (Linked to day/night cycle in main.js)
    createLantern(scene, 6, 12); 
    createLantern(scene, -6, 12);
    createLantern(scene, 20, -5);

    // 9. AMBIENT POPULATION
    createNPC(scene, 'man', 15, 20);
    createNPC(scene, 'goblin', -25, -30);
    createNPC(scene, 'cow', 50, 15);

    // 10. RANDOM FOREST (Avoiding paths and buildings)
    for(let i=0; i<60; i++) {
        const x = (Math.random() * 200) - 100; 
        const z = (Math.random() * 200) - 100;
        
        // Safety check: Don't spawn trees on the castle island or paths
        if (Math.abs(x) < 18 && Math.abs(z + 5) < 18) continue;
        if (Math.abs(x) < 5) continue; 

        createTree(scene, Math.random() > 0.8 ? 'oak' : 'tree', x, z);
    }
}

/**
 * Handles proximity-based greetings for the Castle Guards.
 */
function setupGuards(scene) {
    const guards = [
        createNPC(scene, 'man', -4, 14),
        createNPC(scene, 'man', 4, 14)
    ];

    guards.forEach(g => {
        g.userData.name = "Castle Guard";
        g.userData.hasGreeted = false;
        // Apply "Iron" coloring for guard appearance
        g.children.forEach(c => { if (c.material) c.material.color.setHex(0xcccccc); });
    });

    setInterval(() => {
        if (!window.gameState.player) return;
        guards.forEach(guard => {
            const dist = guard.position.distanceTo(window.gameState.player.position);
            if (dist < 6 && !guard.userData.hasGreeted) {
                addChatMessage(`${guard.userData.name}: Welcome to Lumbridge, traveler!`, "white");
                guard.userData.hasGreeted = true;
                // Cooldown: prevent multiple greetings too quickly
                setTimeout(() => { guard.userData.hasGreeted = false; }, 45000);
            }
        });
    }, 1000);
}

/**
 * Logic to advance Hans's patrol. This is updated via the main animation loop.
 */
export function updateHans() {
    if (!hansNPC) return;

    const target = hansPath[currentHansTarget];
    const dx = target.x - hansNPC.position.x;
    const dz = target.z - hansNPC.position.z;
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist < 0.2) {
        // Switch target to the next corner of the square
        currentHansTarget = (currentHansTarget + 1) % hansPath.length;
    } else {
        const speed = 0.035;
        hansNPC.position.x += (dx / dist) * speed;
        hansNPC.position.z += (dz / dist) * speed;
        // Keep Hans facing his destination
        hansNPC.rotation.y = Math.atan2(dx, dz);
    }
}
