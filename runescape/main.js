import { initRenderer, scene, camera, renderer, playerGroup } from './render.js';
import { setupMovement, updateMovement } from './movement.js';
import { loadLevel } from './levels.js';
import { addItem } from './inventory.js';
import { openBank } from './bank.js';
import { openShop } from './shop.js';
import * as THREE from 'three';

// Raycaster for main interactions
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

export function initGame() {
    initRenderer();
    setupMovement(camera, scene, playerGroup);
    
    // Initial Load
    loadLevel(scene, 'lumbridge');
    
    // Add Interaction Listener
    window.addEventListener('pointerdown', onInteract);
    
    animate();
}

function onInteract(e) {
    if (e.target.id !== 'game-ui' && e.target.tagName !== 'CANVAS') return;

    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    for (let hit of intersects) {
        const data = hit.object.userData;
        const group = data.parentGroup;

        if (group) {
            // Woodcutting
            if (group.userData.type === 'tree') {
                chopTree(group);
                break;
            }
            // Bank
            if (group.userData.type === 'bank_booth') {
                openBank();
                break;
            }
            // Shop
            if (group.userData.type === 'shop_stall') {
                openShop();
                break;
            }
        }
    }
}

// Woodcutting Logic
function chopTree(treeGroup) {
    if (treeGroup.userData.respawning) return;
    
    document.getElementById('context-text').innerText = "Chopping...";
    
    setTimeout(() => {
        if(treeGroup.userData.respawning) return;
        
        // Add Log to Inventory
        if(addItem('logs', 'Logs', 1)) {
            document.getElementById('context-text').innerText = "You get some logs.";
            
            // Visual Despawn
            treeGroup.userData.respawning = true;
            if(treeGroup.children[1]) treeGroup.children[1].visible = false;
            
            setTimeout(() => {
                if(treeGroup.children[1]) treeGroup.children[1].visible = true;
                treeGroup.userData.respawning = false;
            }, 3000);
        } else {
            document.getElementById('context-text').innerText = "Inventory full!";
        }
    }, 1000);
}

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
