import * as THREE from 'three';
import { createGround, createTree, createWall } from './assets.js';

export function loadLevel(scene, levelName) {
    // 1. CLEAR SCENE (Except Player & Lights)
    // We filter out anything that isn't a Light or the Player Group
    for(let i = scene.children.length - 1; i >= 0; i--) {
        const obj = scene.children[i];
        if (!obj.isLight && obj.type !== 'Group') { 
            // Note: Player is a 'Group', but trees are also 'Groups'. 
            // We need to be careful. In main.js we stored playerGroup.
            // A safer way is checking UUID or name, but for this demo:
            // We assume the Player Group has a specific child count or structure.
            // Better yet, we just rebuild the environment layers.
            scene.remove(obj);
        }
        // Remove Trees (Groups that have userData.type = tree)
        if (obj.userData && obj.userData.type === 'tree') {
            scene.remove(obj);
        }
    }

    // 2. BUILD NEW WORLD
    if (levelName === 'lumbridge') {
        scene.background = new THREE.Color(0x87CEEB); // Blue Sky
        createGround(scene, 0x2d5a27); // Green Grass

        // Castle Walls
        createWall(scene, 'castle', -5, 5);
        createWall(scene, 'castle', 5, 5);
        createWall(scene, 'castle', 0, -5, Math.PI/2);

        // Oak Trees
        createTree(scene, 'oak', -10, -10);
        createTree(scene, 'oak', -15, 5);
        createTree(scene, 'oak', 12, -8);
    } 
    else if (levelName === 'falador') {
        scene.background = new THREE.Color(0xaaccff); // Lighter Sky
        createGround(scene, 0xdddddd); // Paved White

        // White Walls
        createWall(scene, 'white', -6, 6);
        createWall(scene, 'white', 6, 6);
        
        // Park Trees
        createTree(scene, 'oak', 0, -10);
        createTree(scene, 'oak', 10, -10);
    }
    else if (levelName === 'menaphos') {
        scene.background = new THREE.Color(0xffeebb); // Yellowish Sky
        createGround(scene, 0xe6c288); // Sand

        // Sandstone Walls
        createWall(scene, 'sandstone', -8, 8);
        createWall(scene, 'sandstone', 8, 8);
        
        // Palm Trees
        createTree(scene, 'palm', -10, -5);
        createTree(scene, 'palm', 10, -5);
        createTree(scene, 'palm', 0, -12);
        createTree(scene, 'palm', 15, 5);
    }
}
