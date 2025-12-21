import { 
    initRenderer, 
    scene, 
    camera, 
    renderer, 
    playerGroup, 
    controls, 
    setDayNight, 
    updateAnimations 
} from './render.js';
import { setupMovement, updateMovement } from './movement.js';
import { loadLevel } from './levels.js';
import { updateHans } from './lumbridge.js'; 
import { addItem } from './inventory.js'; 
import { setupChat, addChatMessage } from './chat.js';
import { startCombat, pacifyNPC } from './combat.js'; 
import { INITIAL_SKILLS } from './stats.js';
import { updateStatsUI, closeWindows, switchTab } from './ui.js';
import { updateMinimap } from './minimap.js';
import { equipItem } from './equipment.js'; 
import * as THREE from 'three';

// 1. GLOBAL GAME STATE
window.gameState = {
    skills: JSON.parse(JSON.stringify(INITIAL_SKILLS)),
    uiMode: 'normal',
    colliders: [],
    buildings: [],
    player: null,
    inventory: [], 
    selectedItem: null,
    gameTime: 12, // Noon start
    lanternLights: []
};

const raycaster = new THREE.Raycaster();
let choppingInterval = null;

export function initGame() {
    initRenderer();
    window.gameState.player = playerGroup; 
    
    // Core Logic Setup
    setupMovement(camera, scene, playerGroup, onInteract);
    setupChat();
    
    try { 
        loadLevel(scene, 'lumbridge'); 
        addChatMessage("Welcome to Lumbridge.", "yellow");
        
        // --- STARTER KIT ---
        if (window.gameState.inventory.length === 0) {
             addItem('sword_bronze', 'Bronze Sword', 1);
             addItem('shield_bronze', 'Bronze Shield', 1);
             addItem('axe_bronze', 'Bronze Axe', 1);
             equipItem('sword_bronze');
             equipItem('shield_bronze');
        }
        updateStatsUI(); 
    } 
    catch(e) { console.error("Level Load Error:", e); }

    // Logic Loop (Time & Events)
    setInterval(() => {
        window.gameState.gameTime += 0.005; 
        if(window.gameState.gameTime >= 24) window.gameState.gameTime = 0;
        updateEnvironment();
    }, 1000);

    animate();
}

// --- ENVIRONMENT & LIGHTING ---
function updateEnvironment() {
    const t = window.gameState.gameTime;
    let intensity = 1.0;
    let skyColor = 0x87ceeb; 
    let lanternOn = false;

    if (t > 19 || t < 6) { // Night
        intensity = 0.2; 
        skyColor = 0x1a1a2a; 
        lanternOn = true;
    } else if (t > 17 || t < 8) { // Dusk/Dawn
        intensity = 0.5; 
        skyColor = 0xffa500; 
    }

    setDayNight(intensity, skyColor);
    
    if(window.gameState.lanternLights) {
        window.gameState.lanternLights.forEach(light => {
            light.intensity = lanternOn ? 1.0 : 0;
        });
    }
}

// --- WORLD INTERACTION ---
function onInteract(mouse) {
    if(choppingInterval) { clearInterval(choppingInterval); choppingInterval = null; }

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    for (let hit of intersects) {
        let group = hit.object.userData.parentGroup;
        if (group) {
            const type = group.userData.type;
            const npcType = group.userData.npcType;

            // Handle NPCs (Hans, Guards, Cook)
            if (type === 'npc') {
                // If it's a friendly/unique NPC with dialogue
                if (group.userData.onInteract) {
                    const response = group.userData.onInteract();
                    if (response) addChatMessage(response, "yellow");
                    return; 
                }
                
                // Otherwise, standard combat
                startCombat(group); 
                break; 
            }

            if (type === 'tree') { attemptChop(group); break; }
            if (type === 'bank_booth') { addChatMessage("Banker: Welcome to the bank of Lumbridge.", "green"); break; }
            if (type === 'chess_table') { addChatMessage("You look at the chess board. It's a stalemate.", "white"); break; } 
        }
    }
}

// --- WOODCUTTING LOGIC ---
function attemptChop(treeGroup) {
    if(treeGroup.userData.respawning) return;
    equipItem('axe_bronze');
    addChatMessage("You begin swinging at the tree...", "white");
    
    choppingInterval = setInterval(() => {
        if(treeGroup.userData.respawning) { clearInterval(choppingInterval); return; }
        
        if(addItem('logs', 'Logs', 1)) {
            addChatMessage("You get some logs.", "white");
            clearInterval(choppingInterval);
            
            treeGroup.userData.respawning = true;
            if(treeGroup.children[1]) treeGroup.children[1].visible = false;
            
            setTimeout(() => { 
                treeGroup.children[1].visible = true; 
                treeGroup.userData.respawning = false; 
            }, 5000);
        } else {
            clearInterval(choppingInterval);
            addChatMessage("Your inventory is full.", "red");
        }
    }, 1200);
}

// --- RENDER ENGINE LOOP ---
function animate() {
    requestAnimationFrame(animate);
    
    // Update movement and unique AI
    updateMovement();
    updateAnimations(); // Handles Roof Hiding & Hit Splats
    updateHans();       // Keeps Hans walking his square path
    
    // Camera follow player
    if (controls && playerGroup) {
        controls.target.lerp(playerGroup.position, 0.1);
        controls.update();
    }

    updateMinimap(scene, playerGroup);
    renderer.render(scene, camera);
}

// Global API
window.game = {
    teleport: (loc) => loadLevel(scene, loc),
    closeWindows,
    switchTab,
    selectItem: (id) => { 
        window.gameState.selectedItem = id; 
        equipItem(id);
    }
};

window.onload = initGame;
