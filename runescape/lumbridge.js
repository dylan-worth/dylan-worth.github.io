import { createGround, createPath } from './assets_env.js';
import { createBuilding } from './assets_buildings.js';
import { createInteractable, createTree, createChessTable, createSnowPile, createNPC, createLantern } from './assets_entities.js';
import { addChatMessage } from './chat.js';

// Hans Patrol State
let hansNPC = null;
let currentHansTarget = 0;
const hansPath = [
    { x: 8.2,  z: 23.1 }, // Point A (Start)
    { x: -8.2, z: 23.1 }, // Point B
    { x: -8.2, z: 15.0 }, // Point C
    { x: 8.2,  z: 15.0 }  // Point D
];

/**
 * Builds the Lumbridge region with the massive open-interior castle and through-paths.
 */
export function buildLumbridge(scene) {
    // 1. BASE ENVIRONMENT
    createGround(scene, 0x2d5a27); 

    // 2. THE MASSIVE CASTLE (30x30 with openings)
    // Centered at z: -5, spans from z: -20 to z: 10
    createBuilding(scene, 'lum_castle', 0, -5); 

    // 3. THROUGH-PATHS (No moat, paths go all the way to doors)
    createPath(scene, 0, 25, 6, 30);  // South Entrance Path
    createPath(scene, 0, -35, 6, 30); // North Exit Path
    createPath(scene, 30, -5, 30, 6, 0); // East path toward Church

    // 4. THE CASTLE GUARDS
    const guardL = createNPC(scene, 'man', -4, 14);
    const guardR = createNPC(scene, 'man', 4, 14);
    [guardL, guardR].forEach(g => {
        g.userData.name = "Castle Guard";
        g.children.forEach(c => { if (c.material) c.material.color.setHex(0xcccccc); });
    });

    // 5. HANS (Unique character with patrol)
    hansNPC = createNPC(scene, 'hans', 8.2, 23.1);

    // 6. INTERIOR FURNISHING & NPCs
    createNPC(scene, 'cook', 0, -5); 
    createInteractable(scene, 'bank_booth', -10, -5); 
    createChessTable(scene, 10, -5);
    createSnowPile(scene, -10, 5);

    // 7. EXTERIOR BUILDINGS & LIGHTS
    createBuilding(scene, 'church', 45, -5);
    createBuilding(scene, 'bobs_axes', -35, -5);
    
    createLantern(scene, 6, 12); 
    createLantern(scene, -6, 12);
    createLantern(scene, 20, -5);

    // 8. USER SPECIFIC TREES
    createTree(scene, 'tree', -2.9, 7.4);
    createTree(scene, 'tree', -3.7, 14.7);
    createTree(scene, 'tree', 4.1, 13.2);

    // 9. FOREST GENERATION (Avoiding the castle footprint)
    for(let i=0; i<60; i++) {
        const x = (Math.random() * 200) - 100; 
        const z = (Math.random() * 200) - 100;
        
        if (Math.abs(x) < 18 && Math.abs(z + 5) < 18) continue;
        if (Math.abs(x) < 5) continue; // Keep paths clear

        createTree(scene, Math.random() > 0.8 ? 'oak' : 'tree', x, z);
    }
}

/**
 * Updates Hans's patrol movement. Call this in the main animate loop.
 */
export function updateHans() {
    if (!hansNPC) return;

    const target = hansPath[currentHansTarget];
    const dx = target.x - hansNPC.position.x;
    const dz = target.z - hansNPC.position.z;
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist < 0.2) {
        // Move to next point in the square
        currentHansTarget = (currentHansTarget + 1) % hansPath.length;
    } else {
        const speed = 0.035;
        hansNPC.position.x += (dx / dist) * speed;
        hansNPC.position.z += (dz / dist) * speed;
        
        // Face the walking direction
        hansNPC.rotation.y = Math.atan2(dx, dz);
    }
}
