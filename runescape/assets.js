import * as THREE from 'three';

// --- GROUND ---
export function createGround(scene, colorHex) {
    const geo = new THREE.PlaneGeometry(200, 200);
    const mat = new THREE.MeshStandardMaterial({ color: colorHex });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true;
    mesh.name = "ground"; // Required for movement raycast
    scene.add(mesh);
}

// --- TREES ---
export function createTree(scene, type, x, z) {
    const group = new THREE.Group();
    
    let trunkColor = 0x3d2817;
    let leafColor = 0x228b22;
    let trunkGeo, leafGeo;

    if (type === 'palm') {
        // MENAPHOS PALM
        trunkGeo = new THREE.CylinderGeometry(0.3, 0.5, 3);
        leafGeo = new THREE.ConeGeometry(2.5, 1, 6);
        leafColor = 0x88aa00;
        
        const trunk = new THREE.Mesh(trunkGeo, new THREE.MeshStandardMaterial({color: trunkColor}));
        trunk.position.y = 1.5;
        trunk.castShadow = true;
        
        const leaves = new THREE.Mesh(leafGeo, new THREE.MeshStandardMaterial({color: leafColor}));
        leaves.position.y = 3;
        
        group.add(trunk, leaves);
    } 
    else {
        // STANDARD OAK
        trunkGeo = new THREE.CylinderGeometry(0.5, 0.7, 2);
        leafGeo = new THREE.DodecahedronGeometry(1.5);
        
        const trunk = new THREE.Mesh(trunkGeo, new THREE.MeshStandardMaterial({color: trunkColor}));
        trunk.position.y = 1;
        trunk.castShadow = true;
        
        const leaves = new THREE.Mesh(leafGeo, new THREE.MeshStandardMaterial({color: leafColor}));
        leaves.position.y = 2.5;
        
        group.add(trunk, leaves);
    }

    group.position.set(x, 0, z);
    
    // TAG FOR WOODCUTTING
    group.userData = { type: 'tree', hp: 3, respawning: false };
    // Tag children for raycasting
    group.children.forEach(c => c.userData = { parentGroup: group });

    scene.add(group);
}

// --- BUILDINGS ---
export function createWall(scene, type, x, z, rotY=0) {
    let geo, mat, mesh;

    if (type === 'castle') {
        // Lumbridge Grey Wall
        geo = new THREE.BoxGeometry(8, 5, 1);
        mat = new THREE.MeshStandardMaterial({ color: 0x555555 });
    } 
    else if (type === 'white') {
        // Falador White Wall
        geo = new THREE.BoxGeometry(8, 6, 1);
        mat = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
    }
    else if (type === 'sandstone') {
        // Menaphos Sandstone
        geo = new THREE.BoxGeometry(8, 5, 2);
        mat = new THREE.MeshStandardMaterial({ color: 0xd2b48c });
    }

    mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, 2.5, z);
    mesh.rotation.y = rotY;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
}
