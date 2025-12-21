import { createGround, createBuilding, createInteractable } from './assets.js';
import { buildLumbridge } from './lumbridge.js'; // Import the new file

export function loadLevel(scene, levelName) {
    // 1. CLEANUP (Wipe the previous level)
    for(let i = scene.children.length - 1; i >= 0; i--) {
        const obj = scene.children[i];
        if (obj.isLight || obj.isCamera) continue;
        if (obj.userData && (obj.userData.type || obj.userData.treeName)) scene.remove(obj);
        if (obj.name === 'ground') scene.remove(obj);
        // Clean up River parts if they exist
        if (obj.geometry && obj.geometry.type === 'PlaneGeometry' && obj.material.color.getHex() === 0x0066ff) scene.remove(obj);
    }

    // 2. LOAD NEW LEVEL
    if (levelName === 'lumbridge') {
        scene.background.setHex(0x87CEEB); 
        // Call the dedicated builder
        buildLumbridge(scene);
    } 
    else if (levelName === 'falador') {
        scene.background.setHex(0xffffff);
        createGround(scene, 0xdddddd); // White Pavement
        createBuilding(scene, 'white_castle', 0, 0);
        createInteractable(scene, 'bank_booth', 10, -5);
    }
    else if (levelName === 'menaphos') {
        scene.background.setHex(0xffaa00);
        createGround(scene, 0xe6c288); // Sand
        createInteractable(scene, 'bank_booth', 0, 0);
    }
}
