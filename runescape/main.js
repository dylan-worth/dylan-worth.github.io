import { initRenderer, scene, camera, renderer, playerGroup } from './render.js';
import { setupMovement, updateMovement } from './movement.js';
import { loadLevel } from './levels.js';
import { addItem, removeItem, getBestAxe } from './inventory.js'; 
import { openBank, deposit } from './bank.js';
import { openShop, sell } from './shop.js';
import { openChess } from './chess.js'; 
import { setupChat, addChatMessage } from './chat.js';
import { startCombat, triggerSmite, pacifyNPC } from './combat.js'; 
import { INITIAL_SKILLS, addXp } from './stats.js';
import { updateStatsUI, closeWindows, switchTab } from './ui.js';
import { updateMinimap } from './minimap.js';
import { triggerSnowballEvent } from './events.js'; // Random Event
import { triggerSnowWeather } from './weather.js'; // Weather
import { createSnowman } from './assets_entities.js'; // Building Snowmen
import * as THREE from 'three';

// 1. SETUP GAME STATE
window.gameState = {
    skills: JSON.parse(JSON.stringify(INITIAL_SKILLS)),
    uiMode: 'normal',
    colliders: [],
    buildings: [],
    player: null,
    inventory: [], 
    bank: [],
    // New interaction states
    selectedSnowPile: null, 
    selectedItem: null 
};

const raycaster = new THREE.Raycaster();
let choppingInterval = null;

export function initGame() {
    initRenderer();
    window.gameState.player = playerGroup; 
    
    setupMovement(camera, scene, playerGroup, onInteract);
    setupChat();
    
    try { 
        loadLevel(scene, 'lumbridge'); 
        addChatMessage("Welcome to Open881.", "yellow");
        
        // Starter Items
        if(window.gameState.inventory.length === 0) {
             addItem('axe_bronze', 'Bronze Axe', 1);
        }
        updateStatsUI(); 
    } 
    catch(e) { console.error(e); }

    // --- RANDOM LOOPS ---
    setInterval(() => {
        // 1. Weather (1% chance per second)
        if(Math.random() < 0.01) triggerSnowWeather(scene, playerGroup);
        
        // 2. Random Event (0.2% chance per second)
        if(Math.random() < 0.002) triggerSnowballEvent(scene, playerGroup);
    }, 1000);

    animate();
}

// --- INTERACTION HANDLER ---
function onInteract(mouse) {
    if(choppingInterval) { clearInterval(choppingInterval); choppingInterval = null; }

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    for (let hit of intersects) {
        let group = hit.object.userData.parentGroup;
        if (group) {
            const type = group.userData.type;

            // 1. NPC INTERACTION (Combat vs Snowball)
            if (type === 'npc') {
                if (window.gameState.selectedItem === 'snowball') {
                    // Throw Snowball logic
                    if (removeItem('snowball', 1)) {
                        addChatMessage(`You throw a snowball at the ${group.userData.name}!`, "cyan");
                        pacifyNPC(group); // Stuns them
                        window.gameState.selectedItem = null; // Reset selection
                        // Visual update needed for inventory slot deselection (optional)
                    } else {
                        addChatMessage("You don't have any snowballs left!", "red");
                    }
                } else {
                    // Normal Attack
                    startCombat(group); 
                }
                break; 
            }

            // 2. SNOW PILES
            if (type === 'snow_pile') {
                window.gameState.selectedSnowPile = group;
                // Show the modal
                const modal = document.getElementById('snow-modal');
                if(modal) modal.style.display = 'flex';
                break;
            }

            // 3. STANDARD OBJECTS
            if (type === 'tree') { attemptChop(group); break; }
            if (type === 'bank_booth') { openBank(); break; }
            if (type === 'shop_stall') { openShop(); break; }
            if (type === 'chess_table') { openChess(); break; } 
        }
    }
}

// --- GLOBAL HELPERS (Called by UI) ---

// 1. Select Item (Called from inventory.js onclick)
window.selectItem = (id) => {
    window.gameState.selectedItem = id;
    // addChatMessage(`Equipped: ${id}`, "yellow"); 
};

// 2. Snow Modal Choice (Called from HTML buttons)
window.handleSnowChoice = (choice) => {
    const pile = window.gameState.selectedSnowPile;
    if (!pile) return;

    if (choice === 'take') {
        if(addItem('snowball', 'Snowball', 1)) {
            addChatMessage("You pack some snow into a ball.", "white");
        }
    } else if (choice === 'build') {
        createSnowman(scene, pile.position.x, pile.position.z);
        pile.visible = false; // Hide the pile used
        addChatMessage("You build a snowman!", "cyan");
    }
    
    // Close Modal
    document.getElementById('snow-modal').style.display = 'none';
    window.gameState.selectedSnowPile = null;
};

// --- SKILLING LOGIC ---

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
                
                // Respawn
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

// --- ENGINE LOGIC ---

export function triggerTeleport(loc) {
    window.gameState.colliders = [];
    window.gameState.buildings = [];
    loadLevel(scene, loc);
    playerGroup.position.set(0,0,0);
    addChatMessage(`Teleported to ${loc}.`, "cyan");
}

function smiteCommand() { triggerSmite(scene); }

// Command wrapper for chat
function commandTriggerEvent() { triggerSnowballEvent(scene, playerGroup); }

function animate() {
    requestAnimationFrame(animate);
    
    updateMovement();
    updateMinimap(scene, playerGroup); // Draw Minimap
    
    renderer.render(scene, camera);
}

// EXPORTS
window.game = {
    teleport: triggerTeleport,
    closeWindows: closeWindows,
    deposit: deposit,
    sell: sell,
    openBank: openBank,
    switchTab: switchTab,
    smite: smiteCommand,
    openChess: openChess,
    triggerEvent: commandTriggerEvent
};
