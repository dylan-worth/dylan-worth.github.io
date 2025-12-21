// main.js - The Brain
import { initRenderer, scene, camera, renderer, playerGroup } from './render.js';
import { setupMovement, updateMovement } from './movement.js';
import { loadLevel } from './levels.js';
import { addItem, getBestAxe } from './inventory.js'; 
import { openBank } from './bank.js';
import { openShop } from './shop.js';
import * as THREE from 'three';

// GAME STATE
window.gameState = {
    skills: { woodcutting: { level: 1, xp: 0 } }
};

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let choppingInterval = null;

export function initGame() {
    console.log("Starting Game...");
    
    // 1. Init Graphics
    initRenderer();
    
    // 2. Init Controls
    setupMovement(camera, scene, playerGroup);
    
    // 3. Load Level (This is where it was likely failing)
    try {
        loadLevel(scene, 'lumbridge');
    } catch (err) {
        console.error("Failed to load level:", err);
        alert("Error loading level check console");
    }
    
    // 4. Input Listener
    window.addEventListener('pointerdown', onInteract);
    
    // 5. Start Loop
    animate();
}

function onInteract(e) {
    if (e.target.id !== 'game-ui' && e.target.tagName !== 'CANVAS') return;

    // Reset chopping
    if(choppingInterval) {
        clearInterval(choppingInterval);
        choppingInterval = null;
        updateContext("", "");
    }

    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    for (let hit of intersects) {
        // Find the group root (since we click children meshes)
        let group = hit.object.userData.parentGroup;
        
        if (group) {
            const type = group.userData.type;

            if (type === 'tree') {
                attemptChop(group);
                break;
            }
            if (type === 'bank_booth') {
                openBank();
                break;
            }
            if (type === 'shop_stall') {
                openShop();
                break;
            }
        }
    }
}

function attemptChop(treeGroup) {
    if (treeGroup.userData.respawning) return;

    const axe = getBestAxe();
    if (!axe) {
        updateContext("You need an axe!", "#ff5555");
        return;
    }
    
    const myLvl = window.gameState.skills.woodcutting.level;
    const req = treeGroup.userData.levelReq || 1;
    
    if (myLvl < req) {
        updateContext(`Need Lvl ${req} Woodcutting.`, "#ff5555");
        return;
    }

    updateContext(`Chopping with ${axe.name}...`, "#00ff00");

    // TICK SYSTEM
    choppingInterval = setInterval(() => {
        if (treeGroup.userData.respawning) {
            clearInterval(choppingInterval);
            return;
        }

        const difficulty = treeGroup.userData.difficulty || 10;
        const roll = Math.random() * difficulty;
        const power = myLvl + axe.power;

        if (power > roll) {
            if (addItem('logs', 'Logs', 1)) {
                window.gameState.skills.woodcutting.xp += (treeGroup.userData.xp || 25);
                updateSkillsUI();
                updateContext("You get some logs.", "#00ccff");

                clearInterval(choppingInterval);
                choppingInterval = null;
                
                // Despawn
                treeGroup.userData.respawning = true;
                if(treeGroup.children[1]) treeGroup.children[1].visible = false; 

                setTimeout(() => {
                    if(treeGroup.children[1]) treeGroup.children[1].visible = true;
                    treeGroup.userData.respawning = false;
                }, 3000);
            } else {
                clearInterval(choppingInterval);
                updateContext("Inventory Full!", "#ff5555");
            }
        }
    }, 600);
}

function updateSkillsUI() {
    const xp = window.gameState.skills.woodcutting.xp;
    const lvl = Math.floor(1 + Math.sqrt(xp / 10));
    window.gameState.skills.woodcutting.level = lvl;
    
    const elLvl = document.getElementById('wc-level');
    const elXp = document.getElementById('wc-xp');
    if(elLvl) elLvl.innerText = lvl;
    if(elXp) elXp.innerText = xp;
}

function updateContext(msg, color) {
    const ctx = document.getElementById('context-text');
    if(ctx) {
        ctx.innerText = msg;
        ctx.style.color = color;
    }
}

export function triggerTeleport(loc) {
    loadLevel(scene, loc);
    playerGroup.position.set(0,0,0);
    updateContext(`Welcome to ${loc}`, "#ffffff");
}

export function closeWindows() {
    const bank = document.getElementById('bank-window');
    const shop = document.getElementById('shop-window');
    if(bank) bank.style.display = 'none';
    if(shop) shop.style.display = 'none';
}

function animate() {
    requestAnimationFrame(animate);
    updateMovement();
    renderer.render(scene, camera);
}
