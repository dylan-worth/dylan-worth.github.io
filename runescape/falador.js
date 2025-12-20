import * as THREE from 'three';
import { createBuilding, clearColliders } from './buildings.js';
import { createTree } from './foliage.js';

export function loadFalador(scene) {
    clearColliders();

    // 1. Ground (Paved/White)
    const groundGeo = new THREE.PlaneGeometry(200, 200);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0xcccccc });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    // 2. White Walls (The Castle Area)
    createBuilding(scene, 'white_wall', 0, 10);
    createBuilding(scene, 'white_wall', 10, 10);
    createBuilding(scene, 'white_wall', -10, 10);

    // 3. Park Trees
    createTree(scene, 'oak', 15, -15);
    createTree(scene, 'oak', 25, -10);
}
