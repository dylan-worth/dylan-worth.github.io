import { initRenderer, scene, camera, renderer, playerGroup } from './render.js';
import { setupMovement, updateMovement } from './movement.js';
import { setupWoodcuttingInteraction } from './woodcutting.js';
import { loadLevel } from './levels.js';

// Global State
window.gameState = {
    skills: { woodcutting: { level: 1, xp: 0 } }
};

export function initGame() {
    initRenderer();
    
    // Setup Inputs
    setupMovement(camera, scene, playerGroup);
    setupWoodcuttingInteraction(scene, camera);

    // Load Initial World
    triggerTeleport('lumbridge');

    animate();
}

export function triggerTeleport(locationName) {
    const ctx = document.getElementById('context-text');
    ctx.innerText = "Teleporting to " + locationName + "...";
    ctx.style.color = "#cc00ff";

    // Teleport Animation (Spin)
    let spins = 0;
    const interval = setInterval(() => {
        playerGroup.rotation.y += 0.5;
        playerGroup.scale.setScalar(1 - (spins * 0.05)); // Shrink
        spins++;
        if(spins > 20) {
            clearInterval(interval);
            
            // ACTUAL LOAD
            loadLevel(scene, locationName);
            
            // Reset Player
            playerGroup.position.set(0, 0, 0);
            playerGroup.scale.setScalar(1);
            playerGroup.rotation.y = 0;
            ctx.innerText = "Arrived at " + locationName;
            ctx.style.color = "#00ff00";
        }
    }, 50);
}

function animate() {
    requestAnimationFrame(animate);
    updateMovement();
    renderer.render(scene, camera);
}
