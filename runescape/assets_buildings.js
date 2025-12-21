import * as THREE from 'three';

// Helper: Create a single wall
function createWall(x, z, width, depth, height, color, rotY, scene) {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), new THREE.MeshStandardMaterial({ color: color }));
    wall.position.set(x, height/2, z);
    wall.rotation.y = rotY;
    wall.castShadow = true;
    wall.receiveShadow = true;
    scene.add(wall);
    
    // Collision
    window.gameState.colliders.push(new THREE.Box3().setFromObject(wall));
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

    // Fence Collision
    window.gameState.colliders.push(new THREE.Box3().setFromCenterAndSize(new THREE.Vector3(x, 0.5, z), new THREE.Vector3(length, 2, 0.2)));
}

export function createBuilding(scene, type, x, z, rotY = 0) {
    if (type === 'lum_castle') {
        const c = 0x888888;
        createWall(x, z-8, 14, 1, 10, c, 0, scene);
        createWall(x-7, z-2, 1, 12, 10, c, 0, scene);
        createWall(x+7, z-2, 1, 12, 10, c, 0, scene);
        createWall(x-5, z+5, 1, 6, 6, c, 0, scene);
        createWall(x+5, z+5, 1, 6, 6, c, 0, scene);
        createWall(x-4, z+8, 3, 1, 6, c, 0, scene);
        createWall(x+4, z+8, 3, 1, 6, c, 0, scene);

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
