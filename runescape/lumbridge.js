import { createGround, createPath } from './assets_env.js';
import { createBuilding } from './assets_buildings.js';
import { createInteractable, createTree, createChessTable, createSnowPile, createNPC, createLantern } from './assets_entities.js';
import { addChatMessage } from './chat.js';

/**
 * Builds the Lumbridge region with the massive open-interior castle and through-paths.
 */
export function buildLumbridge(scene) {
    // 1. BASE ENVIRONMENT
    createGround(scene, 0x2d5a27); 

    // 2. THE MASSIVE CASTLE (30x30 with openings)
    // Positioned at z: -5, so it spans from z: -20 to z: 10
    createBuilding(scene, 'lum_castle', 0, -5); 

    // 3. THROUGH-PATHS
    // Path entering from the South (Front)
    createPath(scene, 0, 25, 6, 30);  
    // Path exiting to the North (Back)
    createPath(scene, 0, -35, 6, 30); 
    // East path toward the Church
    createPath(scene, 30, -5, 30, 6, 0); 

    // 4. THE CASTLE GUARDS (Stationed at the front entrance)
    const guards = [];
    const guardL = createNPC(scene, 'man', -4, 16);
    const guardR = createNPC(scene, 'man', 4, 16);

    [guardL, guardR].forEach(g => {
        g.userData.name = "Castle Guard";
        g.userData.hasGreeted = false;
        g.children.forEach(c => { if (c.material) c.material.color.setHex(0xcccccc); });
        guards.push(g);
    });

    // Proximity greeting logic
    setInterval(() => {
        if (!window.gameState.player) return;
        guards.forEach(guard => {
            const dist = guard.position.distanceTo(window.gameState.player.position);
            if (dist < 5 && !guard.userData.hasGreeted) {
                addChatMessage(`${guard.userData.name}: Welcome to the Great Hall of Lumbridge!`, "white");
                guard.userData.hasGreeted = true;
                setTimeout(() => { guard.userData.hasGreeted = false; }, 30000);
            }
        });
    }, 1000);

    // 5. INTERIOR FURNISHING & NPCs (Spaced out in the 30x30 hall)
    createNPC(scene, 'cook', 0, -5);           // Center of the room
    createInteractable(scene, 'bank_booth', -10, -5); // To the left
    createChessTable(scene, 10, -5);          // To the right
    createSnowPile(scene, -10, 5);            // Near the front-left corner

    // 6. EXTERIOR BUILDINGS
    createBuilding(scene, 'church', 45, -5);
    createBuilding(scene, 'bobs_axes', -35, -5);
    
    // Lanterns for the paths
    createLantern(scene, 6, 12); 
    createLantern(scene, -6, 12);
    createLantern(scene, 20, -5);

    // 7. WORLD POPULATION
    createNPC(scene, 'man', 15, 20);
    createNPC(scene, 'goblin', -25, -30);
    createNPC(scene, 'cow', 50, 15);

    // 8. USER SPECIFIC TREES (Kept at your requested coords)
    createTree(scene, 'tree', -2.9, 7.4);
    createTree(scene, 'tree', -3.7, 14.7);
    createTree(scene, 'tree', 4.1, 13.2);

    // 9. REGIONAL FOREST GENERATION
    for(let i=0; i<80; i++) {
        const x = (Math.random() * 200) - 100; 
        const z = (Math.random() * 200) - 100;
        
        // Exclusion Zone: Don't spawn trees inside the 30x30 castle footprint
        if (Math.abs(x) < 18 && Math.abs(z + 5) < 18) continue;
        
        // Don't spawn on the north/south paths
        if (Math.abs(x) < 5) continue;

        const type = Math.random() > 0.8 ? 'oak' : 'tree';
        createTree(scene, type, x, z);
    }
}
