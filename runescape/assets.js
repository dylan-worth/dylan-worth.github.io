import * as THREE from 'three';

window.gameState = window.gameState || {};
window.gameState.colliders = []; 
window.gameState.buildings = []; 

// --- GROUND & WATER ---
export function createGround(scene, colorHex) {
    // Grass
    const geo = new THREE.PlaneGeometry(200, 200);
    const mat = new THREE.MeshStandardMaterial({ color: colorHex });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true;
    mesh.name = "ground";
    scene.add(mesh);
}

export function createRiver(scene, x, z, width, length) {
    // Blue strip slightly above ground to prevent glitching
    const geo = new THREE.PlaneGeometry(width, length);
    const mat = new THREE.MeshStandardMaterial({ color: 0x0066ff, roughness: 0.1 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(x, 0.05, z); // 0.05 height
    mesh.receiveShadow = true;
    scene.add(mesh);

    // River Collision (Invisible wall so you can't walk on water)
    const box = new THREE.Box3().setFromCenterAndSize(
        new THREE.Vector3(x, 1, z), 
        new THREE.Vector3(width, 5, length)
    );
    window.gameState.colliders.push(box);
}

// --- STRUCTURES ---

function createWall(x, z, width, depth, height, color, rotY, scene) {
    const wall = new THREE.Mesh(
        new THREE.BoxGeometry(width, height, depth),
        new THREE.MeshStandardMaterial({ color: color })
    );
    wall.position.set(x, height/2, z);
    wall.rotation.y = rotY;
    wall.castShadow = true;
    wall.receiveShadow = true;
    scene.add(wall);
    
    // Add Collision
    window.gameState.colliders.push(new THREE.Box3().setFromObject(wall));
    return wall;
}

export function createBridge(scene, x, z) {
    // Wooden Bridge
    const bridge = new THREE.Mesh(
        new THREE.BoxGeometry(8, 0.2, 4),
        new THREE.MeshStandardMaterial({ color: 0x8b4513 }) // Saddle Brown
    );
    bridge.position.set(x, 0.1, z);
    bridge.receiveShadow = true;
    bridge.name = "ground"; // WALKING ENABLED
    scene.add(bridge);
    // Note: We do NOT add collision here so players can walk on it
}

export function createFence(scene, x, z, length, rotY=0) {
    const group = new THREE.Group();
    // Post
    const postGeo = new THREE.BoxGeometry(0.2, 1.2, 0.2);
    const railGeo = new THREE.BoxGeometry(length, 0.1, 0.1);
    const mat = new THREE.MeshStandardMaterial({ color: 0x654321 });

    const post1 = new THREE.Mesh(postGeo, mat); post1.position.set(-length/2, 0.6, 0);
    const post2 = new THREE.Mesh(postGeo, mat); post2.position.set(length/2, 0.6, 0);
    const rail1 = new THREE.Mesh(railGeo, mat); rail1.position.set(0, 0.9, 0);
    const rail2 = new THREE.Mesh(railGeo, mat); rail2.position.set(0, 0.5, 0);
    
    group.add(post1, post2, rail1, rail2);
    group.position.set(x, 0, z);
    group.rotation.y = rotY;
    scene.add(group);

    // Collision
    const box = new THREE.Box3().setFromCenterAndSize(new THREE.Vector3(x, 0.5, z), new THREE.Vector3(length, 2, 0.2));
    // Rotate box logic is hard, so we assume axis-aligned for now or use rough box
    window.gameState.colliders.push(box);
}

export function createBuilding(scene, type, x, z, rotY = 0) {
    // LUMBRIDGE CASTLE
    if (type === 'lum_castle') {
        const c = 0x888888;
        // 4 Walls
        createWall(x, z-5, 10, 1, 8, c, 0, scene); // N
        createWall(x-5, z, 1, 10, 8, c, 0, scene); // W
        createWall(x+5, z, 1, 10, 8, c, 0, scene); // E
        createWall(x-3, z+5, 4, 1, 8, c, 0, scene); // S1
        createWall(x+3, z+5, 4, 1, 8, c, 0, scene); // S2
        
        // Roof
        const roof = new THREE.Mesh(new THREE.ConeGeometry(8, 5, 4), new THREE.MeshStandardMaterial({color:0x555555}));
        roof.position.set(x, 10.5, z);
        roof.rotation.y = Math.PI/4;
        scene.add(roof);
        window.gameState.buildings.push({ x, z, radius: 7, roofMesh: roof });
    }
    // GENERAL STORE
    else if (type === 'general_store') {
        const c = 0xbbaa88; // Tan walls
        createWall(x, z-3, 6, 1, 4, c, 0, scene);
        createWall(x-3, z, 1, 6, 4, c, 0, scene);
        createWall(x+3, z, 1, 6, 4, c, 0, scene);
        createWall(x-2, z+3, 2, 1, 4, c, 0, scene);
        createWall(x+2, z+3, 2, 1, 4, c, 0, scene);

        const roof = new THREE.Mesh(new THREE.ConeGeometry(5, 2, 4), new THREE.MeshStandardMaterial({color:0x8b0000}));
        roof.position.set(x, 5, z);
        roof.rotation.y = Math.PI/4;
        scene.add(roof);
        window.gameState.buildings.push({ x, z, radius: 5, roofMesh: roof });
    }
}

// --- INTERACTABLES ---
export function createInteractable(scene, type, x, z) {
    const group = new THREE.Group();
    // Collision
    window.gameState.colliders.push(new THREE.Box3().setFromCenterAndSize(new THREE.Vector3(x, 1, z), new THREE.Vector3(2, 2, 2)));

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

// --- TREES ---
export function createTree(scene, type, x, z) {
    window.gameState.colliders.push(new THREE.Box3().setFromCenterAndSize(new THREE.Vector3(x, 1, z), new THREE.Vector3(1, 10, 1)));
    const group = new THREE.Group();
    
    let color = 0x228b22, name = "Tree", req = 1, xp = 25;
    if(type === 'oak') { color = 0x116611; name = "Oak"; req = 15; xp = 37.5; }

    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 2), new THREE.MeshStandardMaterial({color:0x3d2817}));
    trunk.position.y = 1;
    
    // Low Poly Tree Top (Dodecahedron looks better than sphere)
    const leaves = new THREE.Mesh(new THREE.DodecahedronGeometry(1.2), new THREE.MeshStandardMaterial({color:color}));
    leaves.position.y = 2.5;
    
    group.add(trunk, leaves);
    group.position.set(x, 0, z);
    group.userData = { type: 'tree', treeName: name, levelReq: req, xp: xp, respawning: false };
    trunk.userData = { parentGroup: group };
    leaves.userData = { parentGroup: group };
    scene.add(group);
}
