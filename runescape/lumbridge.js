import { createGround, createRiver, createBridge, createPath } from './assets_env.js';
import { createBuilding, createFence } from './assets_buildings.js';
import { createInteractable, createTree, createChessTable, createSnowPile, createNPC, createLantern } from './assets_entities.js';
import { addChatMessage } from './chat.js'; // Ensure chat is imported

/**
 * Builds the Lumbridge region with Guard interaction logic.
 */
export function buildLumbridge(scene) {
    // 1. ENVIRONMENT
    createGround(scene, 0x2d5a27); 
    createRiver(scene, 0, -15, 20, 4, false); 
    createRiver(scene, 0, 10, 20, 4, false);  
    createRiver(scene, -12, -5, 4, 25, true); 
    createRiver(scene, 12, -5, 4, 25, true);  

    // 2. THE CASTLE & BRIDGE
    createBuilding(scene, 'lum_castle', 0, -5); 
    createBridge(scene, 0, -15, 6, 8); 

    // 3. THE CASTLE GUARDS
    const guards = [];
    const guardL = createNPC(scene, 'man', -2.5, -18);
    const guardR = createNPC(scene, 'man', 2.5, -18);

    [guardL, guardR].forEach(g => {
        g.userData.name = "Castle Guard";
        g.userData.hasGreeted = false; // Prevent spamming
        g.children.forEach(c => { if (c.material) c.material.color.setHex(0xcccccc); });
        guards.push(g);
    });

    // --- PROXIMITY SCRIPT ---
    // We check every second if the player is near the drawbridge
    setInterval(() => {
        if (!window.gameState.player) return;
        
        guards.forEach(guard => {
            const dist = guard.position.distanceTo(window.gameState.player.position);
            
            if (dist < 5 && !guard.userData.hasGreeted) {
                addChatMessage(`${guard.userData.name}: Welcome to Lumbridge, traveler!`, "white");
                guard.userData.hasGreeted = true;
                
                // Reset greeting after 30 seconds so it can happen again later
                setTimeout(() => { guard.userData.hasGreeted = false; }, 30000);
            }
        });
    }, 1000);

    // 4. INFRASTRUCTURE
    createPath(scene, 0, -25, 4, 30);
    createBuilding(scene, 'church', 25, 15);
    createBuilding(scene, 'bobs_axes', -20, 10);
    createLantern(scene, 5, -18); 
    createLantern(scene, -5, -18);

    // 5. NPCS & OBJECTS
    createInteractable(scene, 'bank_booth', 0, -3); 
    createNPC(scene, 'cook', 0, 0); 
    createNPC(scene, 'goblin', -20, -30);
    createTree(scene, 'tree', -2.9, 7.4);
    createTree(scene, 'tree', -3.7, 14.7);
    createTree(scene, 'tree', 4.1, 13.2);

    // 6. FOREST FILL
    for(let i=0; i<40; i++) {
        const x = (Math.random() * 180) - 90; 
        const z = (Math.random() * 180) - 90;
        if (Math.abs(x) < 18 && Math.abs(z + 5) < 18) continue;
        createTree(scene, 'tree', x, z);
    }
}
