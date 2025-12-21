import { initRenderer, scene, camera, renderer, playerGroup } from './render.js';
import { setupMovement, updateMovement } from './movement.js';
import { loadLevel } from './levels.js';
import { addItem, getBestAxe } from './inventory.js'; 
import { openBank, deposit } from './bank.js';
import { openShop, sell } from './shop.js';
import { openChess } from './chess.js'; // Chess UI
import { setupChat, addChatMessage } from './chat.js';
import { startCombat, triggerSmite } from './combat.js'; 
import { INITIAL_SKILLS, addXp } from './stats.js';
import { updateStatsUI, closeWindows, switchTab } from './ui.js';
import { updateMinimap } from './minimap.js'; // Minimap
import * as THREE from 'three';

// 1. SETUP GAME STATE
window.gameState = {
    skills: JSON.parse(JSON.stringify(INITIAL_SKILLS)),
    uiMode: 'normal',
    colliders: [],
    buildings: [],
    player: null,
    // Critical: Initialize empty arrays to prevent crashes
    inventory: [], 
    bank: []
};

const raycaster = new THREE.Raycaster();
let choppingInterval = null;

export function initGame() {
    initRenderer();
    window.gameState.player = playerGroup; 
    
    // Pass 'onInteract' to movement.js (only fires on Taps, not Swipes)
    setupMovement(camera, scene, playerGroup, onInteract);
    setupChat();
    
    try { 
        loadLevel(scene, 'lumbridge'); 
        addChatMessage("Welcome to Open881.", "yellow");
        
        // Grant Starter Item if inventory is empty
        if(window.gameState.inventory.length === 0) {
             addItem('axe_bronze', 'Bronze Axe', 1);
        }
        updateStatsUI(); 
    } 
    catch(e) { console.error(e); }

    animate();
}

// This function receives normalized mouse coordinates (-1 to 1)
function onInteract(mouse) {
    if(choppingInterval) { clearInterval(choppingInterval); choppingInterval = null; }

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    for (let hit of intersects) {
        let group = hit.object.userData.parentGroup;
        if (group) {
            const type = group.userData.type;

            if (type === 'npc') { startCombat(group); break; }
            if (type === 'tree') { attemptChop(group); break; }
            if (type === 'bank_booth') { openBank(); break; }
            if (type === 'shop_stall') { openShop(); break; }
            if (type === 'chess_table') { openChess(); break; } 
        }
    }
}

function attemptChop(treeGroup) {
    if(treeGroup.userData.respawning) return;
    
    const axe = getBestAxe();
    if(!axe) { addChatMessage("You do not have an axe for this.", "red"); return; }
    
    const req = treeGroup.userData.levelReq || 1;
    if(window.gameState.skills.woodcutting.level < req) {
        addChatMessage(`${treeGroup.userData.treeName} requires level ${req}.`, "red");
        return;
    }

    addChatMessage(`You swing your axe at the ${treeGroup.userData.treeName}...`, "white");
    
    choppingInterval = setInterval(() => {
        if(treeGroup.userData.respawning) { clearInterval(choppingInterval); return; }
        
        if(Math.random() * 10 < (window.gameState.skills.woodcutting.level + axe.power)) {
            if(addItem('logs', 'Logs', 1)) {
                if (addXp('woodcutting', treeGroup.userData.xp)) {
                    addChatMessage("Congratulations, you advanced a Woodcutting level!", "gold");
                }
                
                addChatMessage("You get some logs.", "lime");
                updateStatsUI();
                
                clearInterval(choppingInterval);
                choppingInterval = null;
                
                // Respawn Logic
                treeGroup.userData.respawning = true;
                if(treeGroup.children[1]) treeGroup.children[1].visible = false;
                setTimeout(() => {
                    treeGroup.children[1].visible = true; 
                    treeGroup.userData.respawning = false;
                }, 3000);
            } else {
                clearInterval(choppingInterval);
                addChatMessage("Backpack full.", "red");
            }
        }
    }, 600);
}

export function triggerTeleport(loc) {
    window.gameState.colliders = [];
    window.gameState.buildings = [];
    loadLevel(scene, loc);
    playerGroup.position.set(0,0,0);
    addChatMessage(`Teleported to ${loc}.`, "cyan");
}

function smiteCommand() { triggerSmite(scene); }

function animate() {
    requestAnimationFrame(animate);
    
    updateMovement();
    
    // Update the Minimap Radar
    updateMinimap(scene, playerGroup);
    
    renderer.render(scene, camera);
}

// Global Exports for UI/Console
window.game = {
    teleport: triggerTeleport,
    closeWindows: closeWindows,
    deposit: deposit,
    sell: sell,
    openBank: openBank,
    switchTab: switchTab,
    smite: smiteCommand,
    openChess: openChess 
};
