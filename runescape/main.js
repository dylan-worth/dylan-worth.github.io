import { initRenderer, scene, camera, renderer, playerGroup } from './render.js';
import { setupMovement, updateMovement } from './movement.js';
import { loadLevel } from './levels.js';
import { addItem, getBestAxe } from './inventory.js'; 
import { openBank, deposit } from './bank.js';
import { openShop, sell } from './shop.js';
import { setupChat, addChatMessage } from './chat.js';
import { startCombat } from './combat.js'; 

// NEW IMPORTS
import { INITIAL_SKILLS, addXp } from './stats.js';
import { updateStatsUI, closeWindows, switchTab } from './ui.js';

import * as THREE from 'three';

// 1. SETUP GAME STATE
window.gameState = {
    // Deep copy the initial skills so we don't modify the constant
    skills: JSON.parse(JSON.stringify(INITIAL_SKILLS)),
    uiMode: 'normal',
    colliders: [],
    buildings: [],
    player: null
};

// ... (Raycaster/Mouse setup remains same) ...

// 2. EXPOSE FUNCTIONS
window.game = {
    teleport: triggerTeleport,
    closeWindows: closeWindows, // Now from ui.js
    deposit: deposit,
    sell: sell,
    openBank: openBank,
    switchTab: switchTab // Exposed for HTML buttons
};

export function initGame() {
    initRenderer();
    window.gameState.player = playerGroup; 
    setupMovement(camera, scene, playerGroup);
    setupChat();
    
    try { 
        loadLevel(scene, 'lumbridge'); 
        addChatMessage("Welcome to Open881.", "yellow");
        updateStatsUI(); // Initial UI render
    } 
    catch(e) { console.error(e); }

    window.addEventListener('pointerdown', onInteract);
    animate();
}

function onInteract(e) {
    // ... (Same Interaction Logic) ...
    // ... (Delegates to startCombat, attemptChop, etc.) ...
}

function attemptChop(treeGroup) {
    // ... (Checks remain same) ...
    
    // REPLACE OLD XP LOGIC WITH NEW MODULE
    if(addItem('logs', 'Logs', 1)) {
        // Use the new helper!
        if (addXp('woodcutting', treeGroup.userData.xp)) {
            addChatMessage("Congratulations, you just advanced a Woodcutting level!", "gold");
        }
        
        addChatMessage("You get some logs.", "lime");
        updateStatsUI(); // Update UI via module
        
        // ... (Despawn logic remains same) ...
    }
}

// REMOVED: function updateSkillsUI() (Moved to ui.js)
// REMOVED: function closeWindows() (Moved to ui.js)

function animate() {
    requestAnimationFrame(animate);
    updateMovement();
    renderer.render(scene, camera);
}
