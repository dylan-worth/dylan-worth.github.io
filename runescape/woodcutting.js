import * as THREE from 'three';

export function setupWoodcutting(scene) {
    // Spawn 5 Trees
    for(let i=0; i<5; i++) {
        createTree(scene, -10 + (i*5), -5);
    }
    
    // Add specific click listener for trees
    window.addEventListener('pointerdown', (e) => handleClick(e, scene));
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
    trunk.name = "Tree Trunk"; // Used for raycasting
    
    // Leaves
    const leaves = new THREE.Mesh(
        new THREE.DodecahedronGeometry(1.5),
        new THREE.MeshStandardMaterial({ color: 0x228b22 })
    );
    leaves.position.y = 2.5;
    leaves.name = "Tree Leaves";
    
    group.add(trunk, leaves);
    group.position.set(x, 0, z);
    
    // Mark this group as a tree for logic
    group.userData = { type: 'tree', hp: 3, respawning: false };
    
    scene.add(group);
}

function handleClick(event, scene) {
    // Quick raycaster setup (simplified for brevity, usually shared)
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const camera = scene.children.find(c => c.isCamera) || window.gameState.player.parent.children.find(c=>c.isCamera); 
    // Note: Ideally pass camera in. Using global from window for now as fallback:
    
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Need camera from render module really, but let's grab it via module scope in real app
    // Assuming user clicks tree:
    
    // LOGIC:
    // If intersects tree -> chopTree()
}

// We expose a function to call from main loop or event listener
export function checkWoodcutting(intersectedObject) {
    // Logic moved to Click event inside main.js or movement.js ideally
    // But here is the specific tree logic:
    
    const root = intersectedObject.parent; // Group
    if(root && root.userData.type === 'tree' && !root.userData.respawning) {
        
        // Update UI
        document.getElementById('context-text').innerText = "Chopping Tree...";
        document.getElementById('context-text').style.color = "#00ff00";

        // Simulate Chop delay
        setTimeout(() => {
            if(root.userData.respawning) return;
            
            // Give XP
            window.gameState.skills.woodcutting.xp += 25;
            updateUI();
            
            // Hide Tree (Stump logic)
            root.visible = false;
            root.userData.respawning = true;
            
            // Respawn after 3 seconds
            setTimeout(() => {
                root.visible = true;
                root.userData.respawning = false;
            }, 3000);
            
        }, 1000);
    }
}

function updateUI() {
    const xp = window.gameState.skills.woodcutting.xp;
    document.getElementById('wc-xp').innerText = xp;
    
    // Simple level up calculation
    const lvl = Math.floor(1 + Math.sqrt(xp / 10));
    document.getElementById('wc-level').innerText = lvl;
}
