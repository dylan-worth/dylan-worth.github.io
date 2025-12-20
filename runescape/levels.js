import { createGround, createTree, createBuilding, createInteractable } from './assets.js';

export function loadLevel(scene, levelName) {
    // Cleanup
    for(let i = scene.children.length - 1; i >= 0; i--) {
        const obj = scene.children[i];
        if (!obj.isLight && obj.type !== 'Group') scene.remove(obj);
        if (obj.userData && (obj.userData.type === 'tree' || obj.userData.type.includes('bank') || obj.userData.type.includes('shop'))) scene.remove(obj);
    }

    if (levelName === 'lumbridge') {
        scene.background.setHex(0x87CEEB);
        createGround(scene, 0x2d5a27); // Grass

        // Central Castle
        createBuilding(scene, 'lum_castle', 0, 0); 
        
        // General Store (North)
        createInteractable(scene, 'shop_stall', 0, -15);
        
        // Bank (Top Floor of Castle - Simulated on ground nearby for ease)
        createInteractable(scene, 'bank_booth', 0, 8);

        // Church (East)
        createBuilding(scene, 'church', 20, 5, Math.PI/2);

        // Forest (West)
        for(let i=0; i<10; i++) createTree(scene, 'oak', -15 - Math.random()*10, Math.random()*20 - 10);
    } 
    else if (levelName === 'falador') {
        scene.background.setHex(0xaaccff);
        createGround(scene, 0xdddddd); // Paved

        // White Castle (South)
        createBuilding(scene, 'white_castle', 0, 15);

        // East Bank (Near Park)
        createInteractable(scene, 'bank_booth', 15, -5);

        // Park (Central/East)
        for(let i=0; i<8; i++) createTree(scene, 'oak', 15 + Math.random()*5, 5 + Math.random()*5);
    }
    else if (levelName === 'menaphos') {
        scene.background.setHex(0xffeebb);
        createGround(scene, 0xe6c288); // Sand

        // Grand Pyramid (Far North)
        createBuilding(scene, 'pyramid', 0, -30);

        // Port District (South)
        createInteractable(scene, 'shop_stall', 10, 10); // Fish stall
        createInteractable(scene, 'bank_booth', -10, 10); // Port Bank

        // Palm Trees
        for(let i=0; i<10; i++) createTree(scene, 'palm', Math.random()*40-20, Math.random()*20);
    }
}
