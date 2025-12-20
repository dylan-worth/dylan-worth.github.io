import * as THREE from 'three';

let colliders = [];

export function getColliders() {
    return colliders;
}

export function clearColliders() {
    colliders = [];
}

export function createBuilding(scene, type, x, z, rotation = 0) {
    const group = new THREE.Group();
    
    let w, h, d, color;

    if (type === 'castle_wall') {
        w = 10; h = 6; d = 2; color = 0x888888;
        // Battlements
        const bat1 = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 2), new THREE.MeshStandardMaterial({color}));
        bat1.position.set(-3, 3.5, 0); group.add(bat1);
        const bat2 = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 2), new THREE.MeshStandardMaterial({color}));
        bat2.position.set(3, 3.5, 0); group.add(bat2);
    } 
    else if (type === 'house_medieval') {
        w = 6; h = 4; d = 6; color = 0x6d4e34; // Wood/Daub
        // Roof
        const roof = new THREE.Mesh(new THREE.ConeGeometry(5, 3, 4), new THREE.MeshStandardMaterial({color: 0x4a3c31}));
        roof.position.y = 3.5;
        roof.rotation.y = Math.PI/4;
        group.add(roof);
    }
    else if (type === 'pyramid_wall') {
        w = 8; h = 5; d = 8; color = 0xe6c288; // Sandstone
        const geometry = new THREE.ConeGeometry(6, 6, 4);
        const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({color}));
        mesh.position.y = 3;
        group.add(mesh);
        // Collision for pyramid is approximate box
    }
    else if (type === 'white_wall') {
        w = 8; h = 7; d = 1; color = 0xeeeeee; // Falador White
    }

    // Main Box Structure
    if(type !== 'pyramid_wall') {
        const geometry = new THREE.BoxGeometry(w, h, d);
        const material = new THREE.MeshStandardMaterial({ color: color });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.y = h / 2;
        mesh.receiveShadow = true;
        mesh.castShadow = true;
        group.add(mesh);
    }

    // Position & Rotate
    group.position.set(x, 0, z);
    group.rotation.y = rotation;
    scene.add(group);

    // Register Collision Box (AABB)
    // We create a Box3 representing the world space of this building
    const box = new THREE.Box3().setFromObject(group);
    colliders.push(box);
}
