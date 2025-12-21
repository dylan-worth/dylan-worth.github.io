import * as THREE from 'three';

window.gameState = window.gameState || {};
window.gameState.colliders = window.gameState.colliders || []; 

export function createGround(scene, defaultColorHex) {
    // SEASONAL LOGIC
    const month = new Date().getMonth(); // 0 = Jan, 11 = Dec
    const isWinter = (month === 11 || month === 0 || month === 1);
    
    // If winter, force white snow. Otherwise use level color.
    const finalColor = isWinter ? 0xffffff : defaultColorHex;

    const geo = new THREE.PlaneGeometry(200, 200);
    const mat = new THREE.MeshStandardMaterial({ color: finalColor });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true;
    mesh.name = "ground";
    scene.add(mesh);
}

export function createRiver(scene, x, z, width, length) {
    // River freezes in winter? Let's keep it blue for contrast for now.
    const geo = new THREE.PlaneGeometry(width, length);
    const mat = new THREE.MeshStandardMaterial({ color: 0x0066ff, roughness: 0.1 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(x, 0.05, z);
    mesh.receiveShadow = true;
    scene.add(mesh);
    
    window.gameState.colliders.push(new THREE.Box3().setFromCenterAndSize(
        new THREE.Vector3(x, 1, z), 
        new THREE.Vector3(width, 5, length)
    ));
}

export function createPath(scene, x, z, width, length, rotY=0) {
    const geo = new THREE.PlaneGeometry(width, length);
    const mat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b }); // Keep paths dirt color
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.rotation.z = rotY;
    mesh.position.set(x, 0.02, z);
    mesh.receiveShadow = true;
    mesh.name = "ground"; 
    scene.add(mesh);
}

export function createBridge(scene, x, z, width = 8, length = 4) {
    const bridge = new THREE.Mesh(new THREE.BoxGeometry(width, 0.2, length), new THREE.MeshStandardMaterial({ color: 0x5c4033 }));
    bridge.position.set(x, 0.1, z);
    bridge.receiveShadow = true;
    bridge.name = "ground"; 
    scene.add(bridge);
}
