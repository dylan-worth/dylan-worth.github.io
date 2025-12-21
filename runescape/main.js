import { initRenderer, scene, camera, renderer, playerGroup } from './render.js';
import { setupMovement, updateMovement } from './movement.js';
import { loadLevel } from './levels.js';
import { addItem, getBestAxe } from './inventory.js'; 
import { openBank, deposit } from './bank.js';
import { openShop, sell } from './shop.js';
import { setupChat, addChatMessage } from './chat.js';
import * as THREE from 'three';

// GAME STATE
window.gameState = {
    skills: { woodcutting: { level: 1, xp: 0 } },
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
    window.gameState.player = playerGroup; // For debug
    setupMovement(camera, scene, playerGroup);
    setupChat();
    
    try { loadLevel(scene, 'lumbridge'); } 
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
            if (type === 'tree') { attemptChop(group); break; }
            if (type === 'bank_booth') { openBank(); break; }
            if (type === 'shop_stall') { openShop(); break; }
        }
    }
}

function attemptChop(treeGroup) {
    if(treeGroup.userData.respawning) return;
    
    const axe = getBestAxe();
    if(!axe) { addChatMessage("You do not have an axe which you have the woodcutting level to use.", "red"); return; }
    
    const req = treeGroup.userData.levelReq || 1;
    if(window.gameState.skills.woodcutting.level < req) {
        // REQUESTED FIX: Specific message
        addChatMessage(`${treeGroup.userData.treeName} requires level ${req} to chop.`, "red");
        return;
    }

    addChatMessage(`You swing your axe at the ${treeGroup.userData.treeName}...`, "white");
    
    choppingInterval = setInterval(() => {
        if(treeGroup.userData.respawning) { clearInterval(choppingInterval); return; }
        
        if(Math.random() * 10 < (window.gameState.skills.woodcutting.level + axe.power)) {
            if(addItem('logs', 'Logs', 1)) {
                window.gameState.skills.woodcutting.xp += treeGroup.userData.xp;
                addChatMessage("You get some logs.", "lime");
                updateSkillsUI();
                
                clearInterval(choppingInterval);
                choppingInterval = null;
                treeGroup.userData.respawning = true;
                if(treeGroup.children[1]) treeGroup.children[1].visible = false;
                setTimeout(() => {
                    treeGroup.children[1].visible = true; 
                    treeGroup.userData.respawning = false;
                }, 3000);
            } else {
                clearInterval(choppingInterval);
                addChatMessage("Your inventory is full.", "red");
            }
        }
    }, 600);
}

function updateSkillsUI() {
    const xp = window.gameState.skills.woodcutting.xp;
    const lvl = Math.floor(1 + Math.sqrt(xp/10));
    window.gameState.skills.woodcutting.level = lvl;
    const elLvl = document.getElementById('wc-level');
    const elXp = document.getElementById('wc-xp');
    if(elLvl) elLvl.innerText = lvl;
    if(elXp) elXp.innerText = xp;
}

export function triggerTeleport(loc) {
    window.gameState.colliders = [];
    window.gameState.buildings = [];
    loadLevel(scene, loc);
    playerGroup.position.set(0,0,0);
    addChatMessage(`Welcome to ${loc}.`, "cyan");
}

export function closeWindows() {
    document.getElementById('bank-window').style.display = 'none';
    document.getElementById('shop-window').style.display = 'none';
    window.gameState.uiMode = 'normal';
}

function animate() {
    requestAnimationFrame(animate);
    updateMovement();
    renderer.render(scene, camera);
}

// EXPOSE UTILS
window.game = {
    teleport: triggerTeleport,
    closeWindows: closeWindows,
    deposit: deposit,
    sell: sell
};
