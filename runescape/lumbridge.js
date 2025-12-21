import { createGround, createPath } from './assets_env.js';
import { createBuilding } from './assets_buildings.js';
import { createInteractable, createTree, createChessTable, createSnowPile, createNPC, createLantern } from './assets_entities.js';
import { addChatMessage } from './chat.js';

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
 * Builds Lumbridge with Hans's patrol and the Castle Guard greetings.
 */
export function buildLumbridge(scene) {
    // 1. ENVIRONMENT
    createGround(scene, 0x2d5a27); 
    createBuilding(scene, 'lum_castle', 0, -5); 

    // 2. PATHS
    createPath(scene, 0, 25, 6, 30);  
    createPath(scene, 0, -35, 6, 30); 
    createPath(scene, 30, -5, 30, 6, 0); 

    // 3. THE CASTLE GUARDS (With Restored Greeting Logic)
    const guards = [];
    const guardL = createNPC(scene, 'man', -4, 14);
    const guardR = createNPC(scene, 'man', 4, 14);

    [guardL, guardR].forEach(g => {
        g.userData.name = "Castle Guard";
        g.userData.hasGreeted = false; // Prevents chat spam
        g.children.forEach(c => { if (c.material) c.material.color.setHex(0xcccccc); });
        guards.push(g);
    });

    // --- GUARD GREETING SCRIPT ---
    setInterval(() => {
        if (!window.gameState.player) return;
        
        guards.forEach(guard => {
            const dist = guard.position.distanceTo(window.gameState.player.position);
            
            // If player is close and guard hasn't spoken recently
            if (dist < 6 && !guard.userData.hasGreeted) {
                addChatMessage(`${guard.userData.name}: Welcome to Lumbridge, traveler!`, "white");
                guard.userData.hasGreeted = true;
                
                // Allow them to greet again after 45 seconds
                setTimeout(() => { guard.userData.hasGreeted = false; }, 45000);
            }
        });
    }, 1000);

    // 4. HANS
    hansNPC = createNPC(scene, 'hans', 8.2, 23.1);

    // 5. INTERIOR & EXTERIOR SETUP
    createNPC(scene, 'cook', 0, -5); 
    createInteractable(scene, 'bank_booth', -10, -5); 
    createChessTable(scene, 10, -5);
    createSnowPile(scene, -10, 5);

    createBuilding(scene, 'church', 45, -5);
    createBuilding(scene, 'bobs_axes', -35, -5);
    
    createLantern(scene, 6, 12); 
    createLantern(scene, -6, 12);

    // 6. USER SPECIFIC TREES
    createTree(scene, 'tree', -2.9, 7.4);
    createTree(scene, 'tree', -3.7, 14.7);
    createTree(scene, 'tree', 4.1, 13.2);

    // 7. FOREST GENERATION
    for(let i=0; i<50; i++) {
        const x = (Math.random() * 200) - 100; 
        const z = (Math.random() * 200) - 100;
        if (Math.abs(x) < 18 && Math.abs(z + 5) < 18) continue;
        if (Math.abs(x) < 5) continue; 
        createTree(scene, 'tree', x, z);
    }
}

/**
 * Updates Hans's patrol movement.
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
