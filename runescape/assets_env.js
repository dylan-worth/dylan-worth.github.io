import * as THREE from 'three';

window.gameState = window.gameState || {};
window.gameState.colliders = window.gameState.colliders || []; 

export function createGround(scene, defaultColorHex) {
    // 1. SEASONAL LOGIC (Automatic Snow)
    const month = new Date().getMonth(); // 0 = Jan, 11 = Dec
    const isWinter = (month === 11 || month === 0 || month === 1);
    
    // If winter, force white snow. Otherwise use level color.
    const finalColor = isWinter ? 0xffffff : defaultColorHex;

    const geo = new THREE.PlaneGeometry(200, 200);
    const mat = new THREE.MeshStandardMaterial({ color: finalColor });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true;
    
    // Tag for Minimap
    mesh.name = "ground_terrain"; 
    scene.add(mesh);
}

// Added 'hasCollision' to allow walking over the bridge
export function createRiver(scene, x, z, width, length, hasCollision = true) {
    const geo = new THREE.PlaneGeometry(width, length);
    const mat = new THREE.MeshStandardMaterial({ color: 0x0066ff, roughness: 0.1 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(x, 0.05, z);
    mesh.receiveShadow = true;
    
    // Tag for Minimap
    mesh.name = "water_terrain"; 
    scene.add(mesh);
    
    if (hasCollision) {
        window.gameState.colliders.push(new THREE.Box3().setFromCenterAndSize(
            new THREE.Vector3(x, 1, z), 
            new THREE.Vector3(width, 5, length)
        ));
    }
}

export function createPath(scene, x, z, width, length, rotY=0) {
    const geo = new THREE.PlaneGeometry(width, length);
    const mat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b }); // Dirt path
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.rotation.z = rotY;
    mesh.position.set(x, 0.06, z); // Slightly higher than ground to stop z-fighting
    mesh.receiveShadow = true;
    
    // Tag for Minimap
    mesh.name = "path_terrain"; 
    scene.add(mesh);
}

export function createBridge(scene, x, z, width = 8, length = 4) {
    // Physical Bridge Mesh
    const bridge = new THREE.Mesh(
        new THREE.BoxGeometry(width, 0.5, length), 
        new THREE.MeshStandardMaterial({ color: 0x5c4033 })
    );
    bridge.position.set(x, 0.25, z); // Sits above water
    bridge.receiveShadow = true;
    
    // Tag for Minimap (Show as path)
    bridge.name = "path_terrain"; 
    scene.add(bridge);
}
