import * as THREE from 'three';

// Ensure global game state exists
window.gameState = window.gameState || {};
window.gameState.colliders = []; 
window.gameState.buildings = []; 

// --- GROUND & NATURE ---
export function createGround(scene, colorHex) {
    const geo = new THREE.PlaneGeometry(200, 200);
    const mat = new THREE.MeshStandardMaterial({ color: colorHex });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true;
    mesh.name = "ground";
    scene.add(mesh);
}

export function createRiver(scene, x, z, width, length) {
    const geo = new THREE.PlaneGeometry(width, length);
    const mat = new THREE.MeshStandardMaterial({ color: 0x0066ff, roughness: 0.1 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(x, 0.05, z);
    mesh.receiveShadow = true;
    scene.add(mesh);
    // Collision (Invisible wall)
    window.gameState.colliders.push(new THREE.Box3().setFromCenterAndSize(new THREE.Vector3(x, 1, z), new THREE.Vector3(width, 5, length)));
}

// THIS IS THE FUNCTION YOU WERE MISSING
export function createPath(scene, x, z, width, length, rotY=0) {
    const geo = new THREE.PlaneGeometry(width, length);
    const mat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b }); // Dirt Brown
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.rotation.z = rotY;
    mesh.position.set(x, 0.02, z); // Slightly above grass
    mesh.receiveShadow = true;
    mesh.name = "ground"; // Walkable
    scene.add(mesh);
}

// --- STRUCTURES ---
function createWall(x, z, width, depth, height, color, rotY, scene) {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), new THREE.MeshStandardMaterial({ color: color }));
    wall.position.set(x, height/2, z);
    wall.rotation.y = rotY;
    wall.castShadow = true;
    wall.receiveShadow = true;
    scene.add(wall);
    window.gameState.colliders.push(new THREE.Box3().setFromObject(wall));
}

export function createBridge(scene, x, z) {
    const bridge = new THREE.Mesh(new THREE.BoxGeometry(8, 0.2, 4), new THREE.MeshStandardMaterial({ color: 0x5c4033 }));
    bridge.position.set(x, 0.1, z);
    bridge.receiveShadow = true;
    bridge.name = "ground";
    scene.add(bridge);
}

export function createFence(scene, x, z, length, rotY=0) {
    const group = new THREE.Group();
    const postGeo = new THREE.BoxGeometry(0.2, 1.2, 0.2);
    const railGeo = new THREE.BoxGeometry(length, 0.1, 0.1);
    const mat = new THREE.MeshStandardMaterial({ color: 0x654321 });

    const p1 = new THREE.Mesh(postGeo, mat); p1.position.set(-length/2, 0.6, 0);
    const p2 = new THREE.Mesh(postGeo, mat); p2.position.set(length/2, 0.6, 0);
    const r1 = new THREE.Mesh(railGeo, mat); r1.position.set(0, 0.9, 0);
    
    group.add(p1, p2, r1);
    group.position.set(x, 0, z);
    group.rotation.y = rotY;
    scene.add(group);

    // Collision
    window.gameState.colliders.push(new THREE.Box3().setFromCenterAndSize(new THREE.Vector3(x, 0.5, z), new THREE.Vector3(length, 2, 0.2)));
}

export function createBuilding(scene, type, x, z, rotY = 0) {
    if (type === 'lum_castle') {
        const c = 0x888888;
        createWall(x, z-8, 14, 1, 10, c, 0, scene); // N
        createWall(x-7, z-2, 1, 12, 10, c, 0, scene); // W
        createWall(x+7, z-2, 1, 12, 10, c, 0, scene); // E
        createWall(x-5, z+5, 1, 6, 6, c, 0, scene); // Court W
        createWall(x+5, z+5, 1, 6, 6, c, 0, scene); // Court E
        createWall(x-4, z+8, 3, 1, 6, c, 0, scene); // Gate L
        createWall(x+4, z+8, 3, 1, 6, c, 0, scene); // Gate R

        const roof = new THREE.Mesh(new THREE.ConeGeometry(10, 5, 4), new THREE.MeshStandardMaterial({color:0x555555}));
        roof.position.set(x, 12, z-2);
        roof.rotation.y = Math.PI/4;
        scene.add(roof);
        window.gameState.buildings.push({ x, z: z-2, radius: 8, roofMesh: roof });
    }
    else if (type === 'bobs_axes') {
        const c = 0x8b4513; 
        createWall(x, z-4, 8, 1, 5, c, 0, scene);
        createWall(x-4, z, 1, 8, 5, c, 0, scene);
        createWall(x+4, z, 1, 8, 5, c, 0, scene);
        createWall(x-3, z+4, 2, 1, 5, c, 0, scene);
        createWall(x+3, z+4, 2, 1, 5, c, 0, scene);
        
        const roof = new THREE.Mesh(new THREE.ConeGeometry(6, 3, 4), new THREE.MeshStandardMaterial({color:0x443322}));
        roof.position.set(x, 6, z);
        roof.rotation.y = Math.PI/4;
        scene.add(roof);
        window.gameState.buildings.push({ x, z, radius: 5, roofMesh: roof });
    }
    else if (type === 'church') {
        const c = 0x999999; 
        createWall(x, z-5, 8, 1, 7, c, 0, scene);
        createWall(x-4, z, 1, 10, 7, c, 0, scene);
        createWall(x+4, z, 1, 10, 7, c, 0, scene);
        createWall(x-3, z+5, 2, 1, 7, c, 0, scene);
        createWall(x+3, z+5, 2, 1, 7, c, 0, scene);
        
        const roof = new THREE.Mesh(new THREE.CylinderGeometry(0, 6, 4, 4, 1), new THREE.MeshStandardMaterial({color:0x333333}));
        roof.position.set(x, 9, z);
        roof.rotation.y = Math.PI/4;
        scene.add(roof);
        window.gameState.buildings.push({ x, z, radius: 6, roofMesh: roof });
    }
    else if (type === 'white_castle') {
        createWall(x, z, 10, 10, 10, 0xeeeeee, 0, scene);
    }
}

// --- INTERACTABLES ---
export function createInteractable(scene, type, x, z) {
    const group = new THREE.Group();
    window.gameState.colliders.push(new THREE.Box3().setFromCenterAndSize(new THREE.Vector3(x, 1, z), new THREE.Vector3(1.5, 2, 1.5)));

    if (type === 'bank_booth') {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 1), new THREE.MeshStandardMaterial({ color: 0x654321 }));
        mesh.position.y = 0.75;
        group.add(mesh);
    } else if (type === 'shop_stall') {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 1.5), new THREE.MeshStandardMaterial({ color: 0x880000 }));
        mesh.position.y = 0.5;
        group.add(mesh);
    }
    group.position.set(x, 0, z);
    group.userData = { type: type };
    group.children.forEach(c => c.userData = { parentGroup: group });
    scene.add(group);
}

// --- NPCS ---
export function createNPC(scene, type, x, z) {
    const group = new THREE.Group();
    const bodyColor = (type === 'goblin') ? 0x00ff00 : 0xffccaa;
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 0.4), new THREE.MeshStandardMaterial({color: (type==='goblin'?0x558855:0x555555)}));
    body.position.y = 0.8;
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), new THREE.MeshStandardMaterial({color: bodyColor}));
    head.position.y = 1.4;
    
    group.add(body, head);
    group.position.set(x, 0, z);
    
    group.userData = { type: 'npc', npcType: type, name: (type==='goblin'?'Goblin':'Man'), hp: 5 };
    body.userData = { parentGroup: group };
    head.userData = { parentGroup: group };
    
    scene.add(group);
}

// --- TREES ---
export function createTree(scene, type, x, z) {
    window.gameState.colliders.push(new THREE.Box3().setFromCenterAndSize(new THREE.Vector3(x, 1, z), new THREE.Vector3(1, 10, 1)));
    const group = new THREE.Group();
    let color = 0x228b22, name="Tree", req=1, xp=25;
    if(type==='oak'){color=0x116611; name="Oak"; req=15; xp=37;}
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3,0.4,2), new THREE.MeshStandardMaterial({color:0x3d2817}));
    trunk.position.y=1;
    const leaves = new THREE.Mesh(new THREE.DodecahedronGeometry(1.2), new THREE.MeshStandardMaterial({color:color}));
    leaves.position.y=2.5;
    group.add(trunk,leaves);
    group.position.set(x,0,z);
    group.userData={type:'tree', treeName:name, levelReq:req, xp:xp, respawning:false};
    trunk.userData={parentGroup:group};
    leaves.userData={parentGroup:group};
    scene.add(group);
}
