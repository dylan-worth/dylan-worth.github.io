import * as THREE from 'three';

// Ensure global collision arrays exist
window.gameState = window.gameState || {};
window.gameState.colliders = []; // For walls/trees
window.gameState.buildings = []; // For roof hiding

// --- GROUND ---
export function createGround(scene, colorHex) {
    const geo = new THREE.PlaneGeometry(200, 200);
    const mat = new THREE.MeshStandardMaterial({ color: colorHex });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true;
    mesh.name = "ground";
    scene.add(mesh);
}

// --- HELPER: Create a Wall with Collision ---
function createWall(x, z, width, depth, height, color, rotY, scene) {
    const geo = new THREE.BoxGeometry(width, height, depth);
    const mat = new THREE.MeshStandardMaterial({ color: color });
    const wall = new THREE.Mesh(geo, mat);
    
    // Position is center of box
    wall.position.set(x, height/2, z); 
    wall.rotation.y = rotY;
    wall.castShadow = true;
    wall.receiveShadow = true;
    
    scene.add(wall);
    
    // Create Bounding Box for Collision
    // Note: Box3 is axis-aligned. Rotated walls need more complex math, 
    // but for this demo, we keep walls mostly axis-aligned.
    const box = new THREE.Box3().setFromObject(wall);
    window.gameState.colliders.push(box);
    
    return wall;
}

// --- BUILDINGS ---
export function createBuilding(scene, type, x, z, rotY = 0) {
    // For simplicity, we are building these relative to (x,z)
    
    if (type === 'lum_castle') {
        const c = 0x777777;
        // North
        createWall(x, z - 5, 10, 1, 6, c, 0, scene);
        // West
        createWall(x - 5, z, 1, 10, 6, c, 0, scene);
        // East
        createWall(x + 5, z, 1, 10, 6, c, 0, scene);
        // South (Door Gap)
        createWall(x - 3.5, z + 5, 4, 1, 6, c, 0, scene);
        createWall(x + 3.5, z + 5, 4, 1, 6, c, 0, scene);

        // Roof
        const roof = new THREE.Mesh(new THREE.ConeGeometry(8, 4, 4), new THREE.MeshStandardMaterial({ color: 0x443333 }));
        roof.position.set(x, 8, z);
        roof.rotation.y = Math.PI/4;
        scene.add(roof);
        
        // Register for hiding
        window.gameState.buildings.push({ x, z, radius: 6, roofMesh: roof });
    }
    else if (type === 'church') {
        const c = 0x555555;
        // Walls
        createWall(x, z - 4, 6, 1, 5, c, 0, scene); // N
        createWall(x - 3, z, 1, 8, 5, c, 0, scene); // W
        createWall(x + 3, z, 1, 8, 5, c, 0, scene); // E
        createWall(x - 2, z + 4, 3, 1, 5, c, 0, scene); // S Left
        createWall(x + 2, z + 4, 3, 1, 5, c, 0, scene); // S Right

        // Roof
        const roof = new THREE.Mesh(new THREE.CylinderGeometry(0, 5, 4, 4, 1), new THREE.MeshStandardMaterial({ color: 0x333333 }));
        roof.position.set(x, 7, z);
        roof.rotation.y = Math.PI/4;
        scene.add(roof);
        
        window.gameState.buildings.push({ x, z, radius: 5, roofMesh: roof });
    }
    else if (type === 'white_castle') {
        // Simple big box for Falador for now to prevent complexity errors
        createWall(x, z-6, 12, 1, 8, 0xeeeeee, 0, scene);
        createWall(x-6, z, 1, 12, 8, 0xeeeeee, 0, scene);
        createWall(x+6, z, 1, 12, 8, 0xeeeeee, 0, scene);
        createWall(x-4, z+6, 5, 1, 8, 0xeeeeee, 0, scene);
        createWall(x+4, z+6, 5, 1, 8, 0xeeeeee, 0, scene);
        
        // No roof hiding for this big guy yet, just collisions
    }
    // (Add Menaphos Pyramid here if desired, basically a big wall)
}

// --- INTERACTABLES & TREES ---
export function createInteractable(scene, type, x, z) {
    const group = new THREE.Group();
    
    // Add collision box for the object
    const box = new THREE.Box3().setFromCenterAndSize(new THREE.Vector3(x, 1, z), new THREE.Vector3(2, 5, 2));
    window.gameState.colliders.push(box);

    // Visuals (Simplified from before)
    if (type === 'bank_booth') {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(2, 1.5, 1), new THREE.MeshStandardMaterial({ color: 0x654321 }));
        mesh.position.y = 0.75;
        group.add(mesh);
    } else if (type === 'shop_stall') {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(3, 1, 2), new THREE.MeshStandardMaterial({ color: 0x880000 }));
        mesh.position.y = 0.5;
        group.add(mesh);
    }

    group.position.set(x, 0, z);
    group.userData = { type: type };
    group.children.forEach(c => c.userData = { parentGroup: group });
    scene.add(group);
}

export function createTree(scene, type, x, z) {
    // Collision for trunk
    const box = new THREE.Box3().setFromCenterAndSize(new THREE.Vector3(x, 1, z), new THREE.Vector3(1, 10, 1));
    window.gameState.colliders.push(box);

    const group = new THREE.Group();
    
    // Data setup
    let color = 0x228b22;
    let name = "Tree";
    let req = 1;
    let xp = 25;
    
    if(type === 'oak') { color = 0x116611; name = "Oak"; req = 15; xp = 37; }
    
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 2), new THREE.MeshStandardMaterial({color:0x3d2817}));
    trunk.position.y = 1;
    
    const leaves = new THREE.Mesh(new THREE.DodecahedronGeometry(1.5), new THREE.MeshStandardMaterial({color:color}));
    leaves.position.y = 2.5;
    
    group.add(trunk, leaves);
    group.position.set(x, 0, z);
    
    group.userData = { type: 'tree', treeName: name, levelReq: req, xp: xp, hp: 3 };
    trunk.userData = { parentGroup: group };
    leaves.userData = { parentGroup: group };
    
    scene.add(group);
}
