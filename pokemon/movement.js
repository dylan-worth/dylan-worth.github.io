import { GrassSystem } from './grass.js';

export const Movement = {
    tryMove(player, dx, dz, obstacles, gameState, isPaused, startBattleCallback) {
        // Block movement if in battle or menu
        if (gameState !== 'OVERWORLD' || isPaused) return;

        const nextX = Math.round(player.position.x + dx);
        const nextZ = Math.round(player.position.z + dz);

        // Collision: Check if the next tile is a tree
        const isBlocked = obstacles.some(o => o.x === nextX && o.z === nextZ);
        if (isBlocked) return;

        // Execute Move
        player.position.x = nextX;
        player.position.z = nextZ;

        // Check for Tall Grass Encounter
        if (GrassSystem.checkEncounter(nextX, nextZ)) {
            startBattleCallback("A Wild Pokémon appeared!");
        }
    }
};
