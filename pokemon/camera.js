import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export const CameraSystem = {
    update(camera, player, gameState) {
        // Define our two view states
        const targetPos = (gameState === 'OVERWORLD') 
            ? new THREE.Vector3(player.position.x, 7, player.position.z + 5)
            : new THREE.Vector3(player.position.x - 1, 1.5, player.position.z + 2);
        
        // Smoothly slide the camera toward the target
        camera.position.lerp(targetPos, 0.1);
        
        // Always keep the player in focus
        camera.lookAt(player.position.x, 0, player.position.z);
    }
};
