import { createGround, createRiver, createBridge, createBuilding, createInteractable, createTree, createFence } from './assets.js';

export function loadLevel(scene, levelName) {
    // CLEANUP
    for(let i = scene.children.length - 1; i >= 0; i--) {
        const obj = scene.children[i];
        if (obj.isLight || obj.isCamera) continue;
        if (obj.userData && (obj.userData.type || obj.userData.treeName)) scene.remove(obj);
        if (obj.name === 'ground') scene.remove(obj);
    }

    console.log("Loading:", levelName);

    if (levelName === 'lumbridge') {
        scene.background.setHex(0x87CEEB); 
        createGround(scene, 0x2d5a27); // Grass

        // --- GEOGRAPHY ---
        // River Lum (Runs North/South at X=20)
        createRiver(scene, 25, 0, 10, 200); 
        
        // The Bridge
        createBridge(scene, 25, 5);

        // --- BUILDINGS ---
        // Castle (Center)
        createBuilding(scene, 'lum_castle', 0, 0);
        createInteractable(scene, 'bank_booth', 3, 3); // Bank inside castle

        // General Store (North West)
        createBuilding(scene, 'general_store', -15, -20);
        createInteractable(scene, 'shop_stall', -15, -20);

        // --- FENCES ---
        // Fence around goblin area (East of river)
        createFence(scene, 40, 10, 10);
        createFence(scene, 40, -10, 10);

        // --- NATURE ---
        // Normal Trees (West side)
        for(let i=0; i<8; i++) createTree(scene, 'tree', -10 - Math.random()*20, Math.random()*40 - 20);
        
        // Oaks (South)
        for(let i=0; i<5; i++) createTree(scene, 'oak', Math.random()*15, 20 + Math.random()*15);

        // Goblins/Cows area (East side across bridge)
        for(let i=0; i<10; i++) createTree(scene, 'oak', 35 + Math.random()*20, Math.random()*40 - 20);
    } 
    else if (levelName === 'falador') {
        // ... Falador layout ...
        scene.background.setHex(0xffffff);
        createGround(scene, 0xdddddd);
        createBuilding(scene, 'lum_castle', 0, 0); // Placeholder
        createInteractable(scene, 'bank_booth', 0, -10);
    }
    else if (levelName === 'menaphos') {
        // ... Menaphos layout ...
        scene.background.setHex(0xffaa00);
        createGround(scene, 0xe6c288);
        createInteractable(scene, 'bank_booth', 0, 0);
    }
}
