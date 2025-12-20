import * as THREE from 'three';

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

export function setupWoodcuttingInteraction(scene, camera) {
    window.addEventListener('pointerdown', (e) => {
        if (e.target.id !== 'game-ui' && e.target.tagName !== 'CANVAS') return;

        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children, true);

        for (let hit of intersects) {
            const data = hit.object.userData;
            const group = data.parentGroup;

            // Check if we hit a tree
            if (group && group.userData.type === 'tree') {
                chopTree(group);
                break; 
            }
        }
    });
}

function chopTree(treeGroup) {
    if (treeGroup.userData.respawning) {
        updateContext("Tree is empty.", "#ff5555");
        return;
    }

    updateContext("Chopping...", "#00ff00");

    setTimeout(() => {
        if(treeGroup.userData.respawning) return; // Already chopped

        // XP Drop
        window.gameState.skills.woodcutting.xp += 25;
        updateUI();
        updateContext("You get some logs.", "#00ccff");

        // "Cut" animation (Hide leaves)
        treeGroup.userData.respawning = true;
        // Leaves are usually the 2nd child (index 1) in our assets.js
        if(treeGroup.children[1]) treeGroup.children[1].visible = false; 
        
        // Respawn
        setTimeout(() => {
            if(treeGroup.children[1]) treeGroup.children[1].visible = true;
            treeGroup.userData.respawning = false;
        }, 3000);

    }, 1000);
}

function updateContext(msg, color) {
    const ctx = document.getElementById('context-text');
    ctx.innerText = msg;
    ctx.style.color = color;
}

function updateUI() {
    const xp = window.gameState.skills.woodcutting.xp;
    document.getElementById('wc-xp').innerText = xp;
    const lvl = Math.floor(1 + Math.sqrt(xp / 10));
    document.getElementById('wc-level').innerText = lvl;
}
