import { initRenderer, scene, camera, renderer, playerGroup } from './render.js';
import { setupMovement, updateMovement } from './movement.js';
import { loadLevel } from './levels.js';
import { addItem, getBestAxe } from './inventory.js'; 
import { openBank, deposit } from './bank.js';
import { openShop, sell } from './shop.js';
import * as THREE from 'three';

// GAME STATE
window.gameState = {
    skills: { woodcutting: { level: 1, xp: 0 } },
    uiMode: 'normal', // 'normal', 'bank', 'shop'
    colliders: [],
    buildings: []
};

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let choppingInterval = null;

export function initGame() {
    initRenderer();
    setupMovement(camera, scene, playerGroup);
    
    try { loadLevel(scene, 'lumbridge'); } 
    catch(e) { console.error(e); }

    window.addEventListener('pointerdown', onInteract);
    animate();
}

function onInteract(e) {
    if (e.target.id !== 'game-ui' && e.target.tagName !== 'CANVAS') return;
    if (e.button === 2) return; // Ignore right click (camera)

    // Stop chopping if we move
    if(choppingInterval) { clearInterval(choppingInterval); choppingInterval = null; updateContext("", ""); }

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
    if(!axe) { updateContext("Need Axe!", "red"); return; }
    
    if(window.gameState.skills.woodcutting.level < (treeGroup.userData.levelReq || 1)) {
        updateContext("Level too low", "red"); return;
    }

    updateContext("Chopping...", "lime");
    
    choppingInterval = setInterval(() => {
        if(treeGroup.userData.respawning) { clearInterval(choppingInterval); return; }
        
        // Success chance
        if(Math.random() * 10 < (window.gameState.skills.woodcutting.level + axe.power)) {
            if(addItem('logs', 'Logs', 1)) {
                window.gameState.skills.woodcutting.xp += treeGroup.userData.xp;
                updateContext("Got log", "cyan");
                updateSkillsUI();
                
                // Despawn
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
                updateContext("Inv Full", "red");
            }
        }
    }, 600);
}

function updateContext(msg, color) {
    const el = document.getElementById('context-text');
    if(el) { el.innerText = msg; el.style.color = color; }
}

function updateSkillsUI() {
    const xp = window.gameState.skills.woodcutting.xp;
    const lvl = Math.floor(1 + Math.sqrt(xp/10));
    window.gameState.skills.woodcutting.level = lvl;
    const elLvl = document.getElementById('wc-level');
    if(elLvl) elLvl.innerText = lvl;
}

export function triggerTeleport(loc) {
    // Clear old colliders/buildings before loading new level
    window.gameState.colliders = [];
    window.gameState.buildings = [];
    loadLevel(scene, loc);
    playerGroup.position.set(0,0,0);
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

// EXPOSE UTILS FOR INVENTORY.JS
window.game = {
    teleport: triggerTeleport,
    closeWindows: closeWindows,
    deposit: deposit,
    sell: sell
};
