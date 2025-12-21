import { createNPC } from './assets.js';

export function spawnLevelNPCs(scene, levelName) {
    if (levelName === 'lumbridge') {
        // Civilians around Castle
        createNPC(scene, 'man', 0, 15); 
        createNPC(scene, 'man', -5, 20);
        
        // Bob at his shop
        createNPC(scene, 'man', -10, 28);

        // Goblins across the river
        for(let i=0; i<5; i++) {
            createNPC(scene, 'goblin', 45 + Math.random()*15, 5 + Math.random()*20);
        }
    }
}
