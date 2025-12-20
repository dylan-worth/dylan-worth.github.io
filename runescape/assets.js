import * as THREE from 'three';

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

// --- INTERACTABLES ---
export function createInteractable(scene, type, x, z) {
    const group = new THREE.Group();
    let mesh, color;

    if (type === 'bank_booth') {
        // Wooden Booth
        mesh = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 1), new THREE.MeshStandardMaterial({ color: 0x654321 }));
        mesh.position.y = 1;
        
        // Glass top
        const glass = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1, 0.1), new THREE.MeshStandardMaterial({ color: 0x88ccff, opacity: 0.5, transparent: true }));
        glass.position.set(0, 2, 0);
        group.add(glass);
    } 
    else if (type === 'shop_stall') {
        // Market Stall
        mesh = new THREE.Mesh(new THREE.BoxGeometry(3, 1, 2), new THREE.MeshStandardMaterial({ color: 0x880000 }));
        mesh.position.y = 0.5;
        // Striped Roof
        const roof = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 3, 3, 1, false, 0, Math.PI), new THREE.MeshStandardMaterial({ color: 0xffffff }));
        roof.rotation.z = Math.PI / 2;
        roof.position.y = 2.5;
        group.add(roof);
    }

    group.add(mesh);
    group.position.set(x, 0, z);
    
    // Interaction Data
    group.userData = { type: type };
    group.children.forEach(c => c.userData = { parentGroup: group }); // Raycast helper
    
    scene.add(group);
}

// --- BUILDINGS ---
export function createBuilding(scene, type, x, z, rot=0) {
    const group = new THREE.Group();

    if (type === 'lum_castle') {
        // Main Keep
        const keep = new THREE.Mesh(new THREE.BoxGeometry(10, 8, 10), new THREE.MeshStandardMaterial({ color: 0x777777 }));
        keep.position.y = 4;
        group.add(keep);
        // Battlements
        const top = new THREE.Mesh(new THREE.BoxGeometry(11, 1, 11), new THREE.MeshStandardMaterial({ color: 0x666666 }));
        top.position.y = 8.5;
        group.add(top);
    }
    else if (type === 'white_castle') {
        // Falador White
        const keep = new THREE.Mesh(new THREE.BoxGeometry(12, 10, 8), new THREE.MeshStandardMaterial({ color: 0xeeeeee }));
        keep.position.y = 5;
        group.add(keep);
        // Bridge
        const bridge = new THREE.Mesh(new THREE.BoxGeometry(4, 0.5, 6), new THREE.MeshStandardMaterial({ color: 0x444444 }));
        bridge.position.set(0, 0.25, 6);
        group.add(bridge);
    }
    else if (type === 'pyramid') {
        const pyr = new THREE.Mesh(new THREE.ConeGeometry(8, 10, 4), new THREE.MeshStandardMaterial({ color: 0xd2b48c }));
        pyr.rotation.y = Math.PI / 4; // Align square
        pyr.position.y = 5;
        group.add(pyr);
    }
    else if (type === 'church') {
        const body = new THREE.Mesh(new THREE.BoxGeometry(6, 5, 8), new THREE.MeshStandardMaterial({ color: 0x555555 }));
        body.position.y = 2.5;
        group.add(body);
        const tower = new THREE.Mesh(new THREE.BoxGeometry(3, 10, 3), new THREE.MeshStandardMaterial({ color: 0x555555 }));
        tower.position.set(0, 5, 3.5);
        group.add(tower);
    }

    group.position.set(x, 0, z);
    group.rotation.y = rot;
    scene.add(group);
}

// --- TREES ---
export function createTree(scene, type, x, z) {
    const group = new THREE.Group();
    let trunkColor = 0x3d2817;
    let leafColor = 0x228b22;
    let trunkGeo = new THREE.CylinderGeometry(0.5, 0.7, 2);
    let leafGeo = new THREE.DodecahedronGeometry(1.5);
    let name = "Oak Tree";

    if (type === 'palm') {
        leafColor = 0x88aa00;
        trunkGeo = new THREE.CylinderGeometry(0.3, 0.5, 3);
        leafGeo = new THREE.ConeGeometry(2.5, 1, 6);
        name = "Palm Tree";
    }

    const trunk = new THREE.Mesh(trunkGeo, new THREE.MeshStandardMaterial({color: trunkColor}));
    trunk.position.y = 1;
    trunk.castShadow = true;
    
    const leaves = new THREE.Mesh(leafGeo, new THREE.MeshStandardMaterial({color: leafColor}));
    leaves.position.y = (type==='palm') ? 3 : 2.5;

    group.add(trunk, leaves);
    group.position.set(x, 0, z);
    
    // DATA
    group.userData = { type: 'tree', treeName: name, hp: 3, respawning: false };
    trunk.userData = { parentGroup: group };
    leaves.userData = { parentGroup: group };

    scene.add(group);
}
