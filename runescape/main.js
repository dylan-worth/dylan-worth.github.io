import { initRenderer, scene, camera, renderer, playerGroup } from './render.js';
import { setupMovement, updateMovement } from './movement.js';
import { loadLevel } from './levels.js';
import { addItem, getBestAxe } from './inventory.js'; 
import { openBank, deposit } from './bank.js';
import { openShop, sell } from './shop.js';
import { setupChat, addChatMessage } from './chat.js';
import { startCombat } from './combat.js'; 
import { INITIAL_SKILLS, addXp } from './stats.js';
import { updateStatsUI, closeWindows, switchTab } from './ui.js';
import * as THREE from 'three';

// 1. SETUP GAME STATE
window.gameState = {
    // Deep copy stats so we don't edit the constant
    skills: JSON.parse(JSON.stringify(INITIAL_SKILLS)),
    uiMode: 'normal',
    colliders: [],
    buildings: [],
    player: null
};

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let choppingInterval = null;

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
    if (e.target.id !== 'game-ui' && e.target.tagName !== 'CANVAS') return;
    if (e.button === 2) return; 

    if(choppingInterval) { clearInterval(choppingInterval); choppingInterval = null; }

    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    for (let hit of intersects) {
        let group = hit.object.userData.parentGroup;
        if (group) {
            const type = group.userData.type;

            // Combat
            if (type === 'npc') {
                startCombat(group);
                break;
            }
            
            // Skills & Shops
            if (type === 'tree') { attemptChop(group); break; }
            if (type === 'bank_booth') { openBank(); break; }
            if (type === 'shop_stall') { openShop(); break; }
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
                // XP DROP
                if (addXp('woodcutting', treeGroup.userData.xp)) {
                    addChatMessage("Congratulations, you advanced a Woodcutting level!", "gold");
                }
                
                addChatMessage("You get some logs.", "lime");
                updateStatsUI();
                
                clearInterval(choppingInterval);
                choppingInterval = null;
                
                // Despawn Tree
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

function animate() {
    requestAnimationFrame(animate);
    updateMovement();
    renderer.render(scene, camera);
}

// --- CRITICAL FIX: Attach to window.game AFTER defining functions ---
window.game = {
    teleport: triggerTeleport,
    closeWindows: closeWindows,
    deposit: deposit,
    sell: sell,
    openBank: openBank,
    switchTab: switchTab
};
