import { initRenderer, scene, camera, renderer, playerGroup } from './render.js';
import { setupMovement, updateMovement } from './movement.js';
import { loadLevel } from './levels.js';
import { addItem, getBestAxe } from './inventory.js'; // Import getBestAxe
import { openBank } from './bank.js';
import { openShop } from './shop.js';
import * as THREE from 'three';

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let choppingInterval = null; // Store the interval ID

export function initGame() {
    initRenderer();
    setupMovement(camera, scene, playerGroup);
    loadLevel(scene, 'lumbridge');
    window.addEventListener('pointerdown', onInteract);
    animate();
}

function onInteract(e) {
    if (e.target.id !== 'game-ui' && e.target.tagName !== 'CANVAS') return;

    // Stop chopping if we move or click something else
    if(choppingInterval) {
        clearInterval(choppingInterval);
        choppingInterval = null;
        document.getElementById('context-text').innerText = "";
    }

    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    for (let hit of intersects) {
        const data = hit.object.userData;
        const group = data.parentGroup;

        if (group) {
            if (group.userData.type === 'tree') {
                attemptChop(group);
                break;
            }
            if (group.userData.type === 'bank_booth') {
                openBank();
                break;
            }
            if (group.userData.type === 'shop_stall') {
                openShop();
                break;
            }
        }
    }
}

function attemptChop(treeGroup) {
    if (treeGroup.userData.respawning) return;

    // 1. Check for Axe
    const axe = getBestAxe();
    if (!axe) {
        document.getElementById('context-text').innerText = "You need an axe to chop this tree.";
        document.getElementById('context-text').style.color = "#ff5555";
        return;
    }

    // 2. Check Level Requirements
    const wcLevel = window.gameState.skills.woodcutting.level;
    
    // Axe Level Req
    if (wcLevel < axe.req) {
        document.getElementById('context-text').innerText = `You need lvl ${axe.req} WC to use ${axe.name}.`;
        return;
    }
    // Tree Level Req
    if (wcLevel < treeGroup.userData.levelReq) {
        document.getElementById('context-text').innerText = `You need lvl ${treeGroup.userData.levelReq} WC to chop ${treeGroup.userData.treeName}.`;
        return;
    }

    // 3. Start Chopping Loop (Tick System)
    document.getElementById('context-text').innerText = "Swinging " + axe.name + "...";
    document.getElementById('context-text').style.color = "#00ff00";

    choppingInterval = setInterval(() => {
        // Stop if tree despawned (someone else chopped it)
        if (treeGroup.userData.respawning) {
            clearInterval(choppingInterval);
            document.getElementById('context-text').innerText = "";
            return;
        }

        // ROLL FOR LOG
        // Formula: (Level + AxePower) vs Difficulty
        // Difficulty: Normal=10, Oak=20
        // Axe Power: Bronze=1, Rune=5
        
        const roll = Math.random() * treeGroup.userData.difficulty; // e.g., 0 to 20
        const power = wcLevel + axe.power; // e.g., Lvl 10 + Bronze(1) = 11
        
        // Debug log to console to see rates
        // console.log(`Rolled ${roll.toFixed(1)} vs Power ${power}`);

        if (power > roll) {
            // SUCCESS
            if(addItem('logs', 'Logs', 1)) {
                // XP Drop
                window.gameState.skills.woodcutting.xp += treeGroup.userData.xp;
                updateUI();
                
                document.getElementById('context-text').innerText = "You get some logs.";
                
                // Stop Chopping (Standard Tree Logic: 1 log = stump)
                // For Oaks/High level, you usually get multiple, but let's stick to 1 for now
                clearInterval(choppingInterval);
                choppingInterval = null;

                // Visual Despawn
                treeGroup.userData.respawning = true;
                if(treeGroup.children[1]) treeGroup.children[1].visible = false;
                
                setTimeout(() => {
                    if(treeGroup.children[1]) treeGroup.children[1].visible = true;
                    treeGroup.userData.respawning = false;
                }, 3000);
            } else {
                // Inventory Full
                clearInterval(choppingInterval);
                document.getElementById('context-text').innerText = "Inventory full!";
                document.getElementById('context-text').style.color = "#ff5555";
            }
        }
        // If fail, just wait for next tick (loop continues)

    }, 600); // 600ms = 1 RuneScape Tick
}

function updateUI() {
    const xp = window.gameState.skills.woodcutting.xp;
    document.getElementById('wc-xp').innerText = xp;
    const lvl = Math.floor(1 + Math.sqrt(xp / 10)); // Simple curve
    document.getElementById('wc-level').innerText = lvl;
    window.gameState.skills.woodcutting.level = lvl;
}

// ... (Keep triggerTeleport, closeWindows, animate same as before) ...
// Ensure you copy them from the previous main.js or keep them if editing the file directly.

export function triggerTeleport(locationName) {
    loadLevel(scene, locationName);
    playerGroup.position.set(0, 0, 0);
    document.getElementById('context-text').innerText = "Welcome to " + locationName;
}

export function closeWindows() {
    document.getElementById('bank-window').style.display = 'none';
    document.getElementById('shop-window').style.display = 'none';
}

function animate() {
    requestAnimationFrame(animate);
    updateMovement();
    renderer.render(scene, camera);
}
