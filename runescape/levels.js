import { buildLumbridge } from './lumbridge.js';

/**
 * Level Manager
 * Now uses async/await to handle JSON data fetching from build functions.
 */
export async function loadLevel(scene, levelName) {
    console.log(`Loading level: ${levelName}...`);

    // 1. CLEAR EXISTING LEVEL DATA
    // Clear colliders so we don't walk on invisible walls from the old level
    window.gameState.colliders = [];
    
    // Clear lantern lights to reset day/night associations
    window.gameState.lanternLights = [];

    // 2. DISPATCH TO REGION BUILDER
    switch (levelName) {
        case 'lumbridge':
            // We await this because buildLumbridge now fetches tree.json
            await buildLumbridge(scene);
            break;
        
        case 'varrock':
            // Placeholder for future expansion
            // await buildVarrock(scene);
            break;

        default:
            console.error(`Level ${levelName} not found.`);
            break;
    }

    console.log(`${levelName} loaded successfully.`);
}
