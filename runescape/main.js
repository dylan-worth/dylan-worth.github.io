import { initRenderer, scene, camera, renderer, playerGroup, controls, setDayNight, updateAnimations } from './render.js';
import { setupMovement, updateMovement } from './movement.js';
import { loadLevel } from './levels.js';
import { addItem } from './inventory.js'; 
import { setupChat, addChatMessage } from './chat.js';
import { startCombat, triggerSmite, pacifyNPC } from './combat.js'; 
import { INITIAL_SKILLS, addXp } from './stats.js';
import { updateStatsUI, closeWindows, switchTab } from './ui.js';
import { updateMinimap } from './minimap.js';
import { equipItem } from './equipment.js'; 
import { talkToNPC } from './quests.js';    
import * as THREE from 'three';

// 1. SETUP GLOBAL GAME STATE
window.gameState = {
    skills: JSON.parse(JSON.stringify(INITIAL_SKILLS)),
    uiMode: 'normal',
    colliders: [],
    buildings: [],
    player: null,
    inventory: [], 
    bank: [],
    selectedSnowPile: null, 
    selectedItem: null,
    gameTime: 12, // Start at Noon
    lanternLights: [] // Populated by assets_entities.js
};

const raycaster = new THREE.Raycaster();
let choppingInterval = null;

export function initGame() {
    initRenderer();
    window.gameState.player = playerGroup; 
    
    // Setup Core Systems
    setupMovement(camera, scene, playerGroup, onInteract);
    setupChat();
    
    try { 
        loadLevel(scene, 'lumbridge'); 
        addChatMessage("Welcome to Open881.", "yellow");
        
        // --- STARTER KIT: SWORD & SHIELD ---
        if (!window.gameState.inventory || window.gameState.inventory.length === 0) {
             addItem('sword_bronze', 'Bronze Sword', 1);
             addItem('shield_bronze', 'Bronze Shield', 1);
             addItem('axe_bronze', 'Bronze Axe', 1);
             addItem('dagger_bronze', 'Bronze Dagger', 1);
             addItem('santa_hat', 'Santa Hat', 1); 
             
             // Auto-Equip visual defaults
             equipItem('sword_bronze');
             equipItem('shield_bronze');
        }
        updateStatsUI(); 
    } 
    catch(e) { console.error("Level Load Error:", e); }

    // SECONDARY GAME LOOP (Environment & Random Events)
    setInterval(() => {
        // Day/Night Cycle Logic (Slowed down for realism)
        window.gameState.gameTime += 0.005; 
        if(window.gameState.gameTime >= 24) window.gameState.gameTime = 0;
        updateEnvironment();

    }, 1000);

    animate();
}

// --- LIGHTING & TIME MANAGEMENT ---
function updateEnvironment() {
    const t = window.gameState.gameTime;
    let intensity = 1.0;
    let skyColor = 0x87ceeb; // Day Blue
    let lanternOn = false;

    // Night Logic (Between 19:00 and 6:00)
    if (t > 19 || t < 6) {
        intensity = 0.2; 
        skyColor = 0x1a1a2a; // Night Navy
        lanternOn = true;
    } else if (t > 17 || t < 8) {
        intensity = 0.5; 
        skyColor = 0xffa500; // Sunset Orange
    }

    setDayNight(intensity, skyColor);
    
    // Toggle Street Lanterns
    if(window.gameState.lanternLights) {
        window.gameState.lanternLights.forEach(light => {
            light.intensity = lanternOn ? 1.0 : 0;
        });
    }
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
            const name = group.userData.name;

            // 1. QUEST & TALK PRIORITY
            if (type === 'quest_npc') {
                talkToNPC(name);
                break; 
            }

            // 2. COMBAT
            if (type === 'npc') {
                if (window.gameState.selectedItem === 'snowball') {
                    // Throwing logic (if snowball event active)
                    pacifyNPC(group); 
                    window.gameState.selectedItem = null; 
                } else {
                    startCombat(group); 
                }
                break; 
            }

            // 3. WORLD OBJECTS
            if (type === 'tree') { attemptChop(group); break; }
            if (type === 'bank_booth') { openBank(); break; }
            if (type === 'shop_stall') { openShop(); break; }
            if (type === 'chess_table') { openChess(); break; } 
        }
    }
}

// --- UI / INVENTORY CALLBACKS ---
window.selectItem = (id) => { 
    window.gameState.selectedItem = id; 
    // Handle Visual Equipping
    if (id.includes('axe') || id.includes('sword') || id.includes('dagger') || id.includes('shield') || id.includes('hat')) {
        equipItem(id);
    }
};

// --- SKILLING LOGIC ---
function attemptChop(treeGroup) {
    if(treeGroup.userData.respawning) return;
    
    // Visual auto-equip axe
    equipItem('axe_bronze');

    addChatMessage("You swing your axe at the tree...", "white");
    choppingInterval = setInterval(() => {
        if(treeGroup.userData.respawning) { clearInterval(choppingInterval); return; }
        
        if(addItem('logs', 'Logs', 1)) {
            addXp('woodcutting', treeGroup.userData.xp || 25);
            updateStatsUI();
            clearInterval(choppingInterval);
            
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
    }, 600);
}

// --- ENGINE ANIMATION LOOP ---
function animate() {
    requestAnimationFrame(animate);
    
    // Update player movement
    updateMovement();
    
    // Update visual animations (Weapon swings)
    updateAnimations(); 
    
    // Camera follow player
    if (controls && playerGroup) {
        controls.target.copy(playerGroup.position);
        controls.target.y += 1.0; 
        controls.update();
    }

    // HUD Update
    updateMinimap(scene, playerGroup);
    
    renderer.render(scene, camera);
}

// EXPOSE GLOBALS
window.game = {
    teleport: (loc) => loadLevel(scene, loc),
    closeWindows,
    switchTab,
    smite: () => triggerSmite(scene),
    openChess
};

window.onload = initGame;
