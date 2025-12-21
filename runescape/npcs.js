import { createNPC } from './assets.js';

export function spawnLevelNPCs(scene, levelName) {
    if (levelName === 'lumbridge') {
        // MEN / WOMEN (Around Castle)
        createNPC(scene, 'man', 0, 15); // Walking on path
        createNPC(scene, 'man', -5, 20);
        createNPC(scene, 'man', 5, -5); // Inside courtyard

        // GOBLINS (East of River)
        for(let i=0; i<5; i++) {
            createNPC(scene, 'goblin', 45 + Math.random()*15, 5 + Math.random()*20);
        }
        
        // BOB (Shop Owner)
        createNPC(scene, 'man', -10, 28);
    }
}
