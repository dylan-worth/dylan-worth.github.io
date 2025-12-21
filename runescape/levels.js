import { createGround, createTree, createBuilding, createInteractable } from './assets.js';

export function loadLevel(scene, levelName) {
    // 1. CLEANUP: Remove old objects to prevent duplicates
    for(let i = scene.children.length - 1; i >= 0; i--) {
        const obj = scene.children[i];
        // Keep Lights and Camera
        if (obj.isLight || obj.isCamera) continue;
        // Keep Player (Group) - Assuming Player is the only other Group that ISN'T a tree/building
        // A safer check: if it has userData.type, remove it.
        if (obj.userData && (obj.userData.type || obj.userData.treeName)) {
            scene.remove(obj);
        }
        // Remove Ground
        if (obj.name === 'ground') scene.remove(obj);
    }

    console.log("Loading Level:", levelName);

    if (levelName === 'lumbridge') {
        scene.background.setHex(0x87CEEB); // Blue Sky
        createGround(scene, 0x2d5a27); // Green Grass

        // BUILDINGS
        createBuilding(scene, 'lum_castle', 0, 0); 
        createBuilding(scene, 'church', 25, 5, Math.PI/2);

        // INTERACTABLES
        createInteractable(scene, 'shop_stall', -5, -15); // General Store
        createInteractable(scene, 'bank_booth', 5, 8);   // Castle Bank

        // TREES (Mix of Normal and Oak)
        for(let i=0; i<15; i++) {
            const type = (Math.random() > 0.7) ? 'oak' : 'tree';
            createTree(scene, type, -15 - Math.random()*20, Math.random()*40 - 20);
        }
    } 
    else if (levelName === 'falador') {
        scene.background.setHex(0xaaccff);
        createGround(scene, 0xdddddd); // Paved White

        createBuilding(scene, 'white_castle', 0, 15);
        createInteractable(scene, 'bank_booth', 12, -5); // East Bank
        
        // Park Trees
        for(let i=0; i<10; i++) createTree(scene, 'oak', 15 + Math.random()*10, 5 + Math.random()*15);
    }
    else if (levelName === 'menaphos') {
        scene.background.setHex(0xffeebb); // Desert Sky
        createGround(scene, 0xe6c288); // Sand

        createBuilding(scene, 'pyramid', 0, -30);
        createInteractable(scene, 'shop_stall', 10, 10);
        createInteractable(scene, 'bank_booth', -10, 10);

        // Palm Trees
        for(let i=0; i<12; i++) createTree(scene, 'palm', Math.random()*40-20, Math.random()*30-10);
    }
}
