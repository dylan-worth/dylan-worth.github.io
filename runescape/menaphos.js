import * as THREE from 'three';
import { createBuilding, clearColliders } from './buildings.js';
import { createTree } from './foliage.js';

export function loadMenaphos(scene) {
    clearColliders();

    // 1. Ground (Sand)
    const groundGeo = new THREE.PlaneGeometry(200, 200);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0xe6c288 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    // 2. Pyramids / Architecture
    createBuilding(scene, 'pyramid_wall', 20, 20);
    createBuilding(scene, 'pyramid_wall', -20, 20);
    createBuilding(scene, 'pyramid_wall', 0, 40);

    // 3. Palm Trees (Oasis style)
    for(let i=0; i<8; i++) {
        createTree(scene, 'palm', Math.random()*40 - 20, -10 + Math.random()*10);
    }
}
