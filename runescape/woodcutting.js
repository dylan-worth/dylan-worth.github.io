import * as THREE from 'three';

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

export function setupWoodcutting(scene, camera) {
    // 1. Create Trees
    for(let i=0; i<5; i++) {
        createTree(scene, -8 + (i*4), -6);
        createTree(scene, -8 + (i*4), -12);
    }

    // 2. Add Event Listener specifically for chopping
    window.addEventListener('pointerdown', (e) => onTreeClick(e, scene, camera));
}

function createTree(scene, x, z) {
    const group = new THREE.Group();
    
    // Trunk
    const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.4, 0.6, 2),
        new THREE.MeshStandardMaterial({ color: 0x3d2817 })
    );
    trunk.position.y = 1;
    trunk.castShadow = true;
    
    // Leaves
    const leaves = new THREE.Mesh(
        new THREE.DodecahedronGeometry(1.5),
        new THREE.MeshStandardMaterial({ color: 0x228b22 })
    );
    leaves.position.y = 2.5;
    
    group.add(trunk, leaves);
    group.position.set(x, 0, z);
    
    // Identifiers for logic
    group.userData = { type: 'tree', hp: 3, respawning: false };
    // We add user data to children too so raycaster finds it easier
    trunk.userData = { parentGroup: group };
    leaves.userData = { parentGroup: group };
    
    scene.add(group);
}

function onTreeClick(event, scene, camera) {
    if (event.target.id !== 'game-ui' && event.target.tagName !== 'CANVAS') return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    for (let hit of intersects) {
        // Check if we hit a part of a tree
        const data = hit.object.userData;
        const group = data.parentGroup;

        if (group && group.userData.type === 'tree') {
            chopTree(group);
            break; // Stop raycasting once we hit a tree
        }
    }
}

function chopTree(treeGroup) {
    if (treeGroup.userData.respawning) {
        updateContext("This tree is empty.", "#ff0000");
        return;
    }

    updateContext("Chopping...", "#00ff00");

    // Simulate delay
    setTimeout(() => {
        if(treeGroup.userData.respawning) return;

        // Success!
        window.gameState.skills.woodcutting.xp += 25;
        updateUI();
        updateContext("You get some logs.", "#00ccff");

        // Stump Logic (Hide leaves)
        treeGroup.userData.respawning = true;
        treeGroup.children[1].visible = false; // Hide leaves
        
        // Respawn timer
        setTimeout(() => {
            treeGroup.children[1].visible = true; // Show leaves
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
    
    // Simple level formula
    const lvl = Math.floor(1 + Math.sqrt(xp / 10));
    document.getElementById('wc-level').innerText = lvl;
}
