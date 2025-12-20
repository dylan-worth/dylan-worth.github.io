import { initRenderer, scene, camera, renderer } from './render.js';
import { setupMovement, updateMovement } from './movement.js';
import { setupWoodcutting } from './woodcutting.js';

// Global Game State
window.gameState = {
    player: null,
    skills: {
        woodcutting: { level: 1, xp: 0 }
    }
};

export function initGame() {
    // 1. Setup Graphics
    const { player } = initRenderer();
    window.gameState.player = player;

    // 2. Setup Modules
    // We pass scene/camera/player to these modules so they can use them
    setupMovement(camera, scene, player);
    setupWoodcutting(scene, camera);

    // 3. Start Loop
    animate();
}

function animate() {
    requestAnimationFrame(animate);

    // Update Player Movement
    updateMovement();
    
    // Render the scene
    renderer.render(scene, camera);
}
