import { createGround } from './assets_env.js';
import { createBuilding } from './assets_buildings.js';
import { createInteractable } from './assets_entities.js';
import { buildLumbridge } from './lumbridge.js';
import { spawnLevelNPCs } from './npcs.js';

export function loadLevel(scene, levelName) {
    // 1. CLEANUP
    for(let i = scene.children.length - 1; i >= 0; i--) {
        const obj = scene.children[i];
        if (obj.isLight || obj.isCamera) continue;
        if (obj.userData && (obj.userData.type || obj.userData.treeName || obj.userData.npcType)) {
            scene.remove(obj);
        }
        if (obj.name === 'ground') scene.remove(obj);
        // Clean up River planes
        if (obj.geometry && obj.geometry.type === 'PlaneGeometry' && obj.material && obj.material.color && obj.material.color.getHex() === 0x0066ff) {
            scene.remove(obj);
        }
    }

    console.log("Loading Level:", levelName);

    // 2. LOAD NEW LEVEL
    if (levelName === 'lumbridge') {
        scene.background.setHex(0x87CEEB); 
        buildLumbridge(scene);
        spawnLevelNPCs(scene, 'lumbridge');
    } 
    else if (levelName === 'falador') {
        scene.background.setHex(0xffffff);
        createGround(scene, 0xdddddd);
        createBuilding(scene, 'white_castle', 0, 0);
        createInteractable(scene, 'bank_booth', 10, -5);
    }
    else if (levelName === 'menaphos') {
        scene.background.setHex(0xffaa00);
        createGround(scene, 0xe6c288);
        createInteractable(scene, 'bank_booth', 0, 0);
    }
}
