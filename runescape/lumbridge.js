import * as THREE from 'three';
import { createBuilding, clearColliders } from './buildings.js';
import { createTree } from './foliage.js';

export function loadLumbridge(scene) {
    clearColliders();

    // 1. Ground (Green Grass)
    const groundGeo = new THREE.PlaneGeometry(200, 200);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x44aa44 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    // 2. River Lum (Blue Strip)
    const riverGeo = new THREE.PlaneGeometry(20, 200);
    const riverMat = new THREE.MeshStandardMaterial({ color: 0x0088ff });
    const river = new THREE.Mesh(riverGeo, riverMat);
    river.rotation.x = -Math.PI / 2;
    river.position.set(40, 0.01, 0); // East of castle
    scene.add(river);

    // 3. Castle Walls
    createBuilding(scene, 'castle_wall', -10, 0, 0);
    createBuilding(scene, 'castle_wall', 10, 0, 0);
    createBuilding(scene, 'castle_wall', 0, -10, Math.PI/2);

    // 4. Houses
    createBuilding(scene, 'house_medieval', -20, 15);
    createBuilding(scene, 'house_medieval', -30, 5);

    // 5. Trees (Forest to the west)
    for(let i=0; i<10; i++) {
        createTree(scene, 'oak', -30 - Math.random()*20, Math.random()*40 - 20);
    }
}
