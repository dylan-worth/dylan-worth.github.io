import * as THREE from 'three';

// Ensure global game state exists to prevent crashes
window.gameState = window.gameState || {};
window.gameState.colliders = window.gameState.colliders || [];

// --- INTERACTABLES (Banks, Shops) ---
export function createInteractable(scene, type, x, z) {
    const group = new THREE.Group();
    
    // Add Collision Box (Invisible wall so you can't walk through the bank booth)
    window.gameState.colliders.push(new THREE.Box3().setFromCenterAndSize(
        new THREE.Vector3(x, 1, z), 
        new THREE.Vector3(1.5, 2, 1.5)
    ));

    if (type === 'bank_booth') {
        // Brown Counter
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 1), new THREE.MeshStandardMaterial({ color: 0x654321 }));
        mesh.position.y = 0.75;
        group.add(mesh);
    } else if (type === 'shop_stall') {
        // Red Stall
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 1.5), new THREE.MeshStandardMaterial({ color: 0x880000 }));
        mesh.position.y = 0.5;
        group.add(mesh);
    }
    
    group.position.set(x, 0, z);
    
    // Metadata for Click Detection
    group.userData = { type: type };
    // Ensure children point back to the group so Raycaster finds the whole object
    group.children.forEach(c => c.userData = { parentGroup: group });
    
    scene.add(group);
}

// --- TREES ---
export function createTree(scene, type, x, z) {
    // Collision Box
    window.gameState.colliders.push(new THREE.Box3().setFromCenterAndSize(
        new THREE.Vector3(x, 1, z), 
        new THREE.Vector3(1, 10, 1)
    ));
    
    const group = new THREE.Group();
    
    let color = 0x228b22; // Default Green
    let name = "Tree";
    let req = 1; 
    let xp = 25;

    // Oak Variant
    if(type === 'oak'){
        color = 0x116611; // Darker Green
        name = "Oak"; 
        req = 15; 
        xp = 37.5;
    }

    // Trunk
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3,0.4,2), new THREE.MeshStandardMaterial({color:0x3d2817}));
    trunk.position.y = 1;
    
    // Leaves (Low Poly Dodecahedron)
    const leaves = new THREE.Mesh(new THREE.DodecahedronGeometry(1.2), new THREE.MeshStandardMaterial({color: color}));
    leaves.position.y = 2.5;
    
    group.add(trunk, leaves);
    group.position.set(x, 0, z);
    
    // Metadata for Woodcutting
    group.userData = { type: 'tree', treeName: name, levelReq: req, xp: xp, respawning: false };
    trunk.userData = { parentGroup: group };
    leaves.userData = { parentGroup: group };
    
    scene.add(group);
}

// --- NPCS (Men, Women, Goblins) ---
export function createNPC(scene, type, x, z) {
    const group = new THREE.Group();
    
    let bodyColor, headColor, hp, maxHp, combatLvl, name;
    let isWoman = (type === 'woman');

    // Define Stats & Appearance
    if (type === 'man') {
        bodyColor = 0x445588; // Blue Shirt
        headColor = 0xffccaa; // Skin Tone
        hp = 7; maxHp = 7; combatLvl = 2; name = "Man";
    } 
    else if (type === 'woman') {
        bodyColor = 0x884488; // Purple Dress
        headColor = 0xffccaa; 
        hp = 7; maxHp = 7; combatLvl = 2; name = "Woman";
    }
    else if (type === 'goblin') {
        bodyColor = 0x558855; // Green Skin
        headColor = 0x00ff00; // Bright Green Head
        hp = 5; maxHp = 5; combatLvl = 2; name = "Goblin";
    }

    // Create Body Shape
    let body;
    if (isWoman) {
        // Cone/Cylinder for Dress
        body = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.5, 0.8), new THREE.MeshStandardMaterial({color: bodyColor}));
    } else {
        // Box for Shirt/Pants
        body = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 0.4), new THREE.MeshStandardMaterial({color: bodyColor}));
    }
    body.position.y = 0.8;
    
    // Create Head
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), new THREE.MeshStandardMaterial({color: headColor}));
    head.position.y = 1.4;

    group.add(body, head);
    group.position.set(x, 0, z);
    
    // Metadata for Combat
    group.userData = { 
        type: 'npc', 
        npcType: type, // Used for Loot Tables
        name: name, 
        hp: hp, 
        maxHp: maxHp, 
        combatLevel: combatLvl 
    };
    
    body.userData = { parentGroup: group };
    head.userData = { parentGroup: group };
    
    scene.add(group);
}
