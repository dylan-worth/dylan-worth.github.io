import { createNPC } from './assets_entities.js';

export function spawnLevelNPCs(scene, levelName) {
    if (levelName === 'lumbridge') {
        // Castle Courtyard
        createNPC(scene, 'man', 0, 15); 
        createNPC(scene, 'woman', 2, 18);
        
        // Near General Store
        createNPC(scene, 'woman', -5, 20);
        createNPC(scene, 'man', -8, 22);
        
        // Bob at his shop
        createNPC(scene, 'man', -10, 28);

        // Goblins across the river
        for(let i=0; i<6; i++) {
            createNPC(scene, 'goblin', 45 + Math.random()*15, 5 + Math.random()*20);
        }
    }
}
