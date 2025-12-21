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
import { openChess } from './chess.js'; // Ensure this import exists
import * as THREE from 'three';

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
    gameTime: 12,
    lanternLights: []
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
        
        if(!window.gameState.inventory || window.gameState.inventory.length === 0) {
             addItem('sword_bronze', 'Bronze Sword', 1);
             addItem('shield_bronze', 'Bronze Shield', 1);
             addItem('axe_bronze', 'Bronze Axe', 1);
             addItem('dagger_bronze', 'Bronze Dagger', 1);
             addItem('santa_hat', 'Santa Hat', 1); 
             
             equipItem('sword_bronze');
             equipItem('shield_bronze');
        }
        updateStatsUI(); 
    } 
    catch(e) { console.error("Level Load Error:", e); }

    setInterval(() => {
        window.gameState.gameTime += 0.005; 
        if(window.gameState.gameTime >= 24) window.gameState.gameTime = 0;
        updateEnvironment();
    }, 1000);

    animate();
}

function updateEnvironment() {
    const t = window.gameState.gameTime;
    let intensity = 1.0;
    let skyColor = 0x87ceeb; 
    let lanternOn = false;

    if (t > 19 || t < 6) {
        intensity = 0.2; 
        skyColor = 0x1a1a2a; 
        lanternOn = true;
    } else if (t > 17 || t < 8) {
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

function onInteract(mouse) {
    if(choppingInterval) { clearInterval(choppingInterval); choppingInterval = null; }

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    for (let hit of intersects) {
        let group = hit.object.userData.parentGroup;
        if (group) {
            const type = group.userData.type;
            const name = group.userData.name;

            if (type === 'quest_npc') {
                talkToNPC(name);
                break; 
            }

            if (type === 'npc') {
                startCombat(group); 
                break; 
            }

            if (type === 'tree') { attemptChop(group); break; }
            if (type === 'bank_booth') { window.game.openBank(); break; }
            if (type === 'shop_stall') { window.game.openShop(); break; }
            if (type === 'chess_table') { openChess(); break; } // Triggers Chess
        }
    }
}

window.selectItem = (id) => { 
    window.gameState.selectedItem = id; 
    if (id.includes('axe') || id.includes('sword') || id.includes('dagger') || id.includes('shield') || id.includes('hat')) {
        equipItem(id);
    }
};

function attemptChop(treeGroup) {
    if(treeGroup.userData.respawning) return;
    equipItem('axe_bronze');
    addChatMessage("You swing your axe at the tree...", "white");
    choppingInterval = setInterval(() => {
        if(treeGroup.userData.respawning) { clearInterval(choppingInterval); return; }
        if(addItem('logs', 'Logs', 1)) {
            addXp('woodcutting', treeGroup.userData.xp || 25);
            updateStatsUI();
            clearInterval(choppingInterval);
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

function animate() {
    requestAnimationFrame(animate);
    updateMovement();
    updateAnimations(); 
    if (controls && playerGroup) {
        controls.target.copy(playerGroup.position);
        controls.target.y += 1.0; 
        controls.update();
    }
    updateMinimap(scene, playerGroup);
    renderer.render(scene, camera);
}

// Ensure openChess is included in this object
window.game = {
    teleport: (loc) => loadLevel(scene, loc),
    closeWindows,
    switchTab,
    smite: () => triggerSmite(scene),
    openChess: openChess 
};

window.onload = initGame;
