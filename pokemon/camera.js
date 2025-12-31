import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export const CameraSystem = {
    /**
     * Updates the camera position and focus based on the current game state.
     * @param {THREE.PerspectiveCamera} camera 
     * @param {THREE.Mesh} player 
     * @param {string} gameState 
     */
    update(camera, player, gameState) {
        let targetPos = new THREE.Vector3();
        let lookAtPos = new THREE.Vector3();

        if (gameState === 'OVERWORLD') {
            // Standard top-down follow view
            targetPos.set(
                player.position.x, 
                7, 
                player.position.z + 5
            );
            lookAtPos.set(
                player.position.x, 
                0, 
                player.position.z
            );
        } else if (gameState === 'BATTLE') {
            // BATTLE ZOOM: Perfectly centered on the X-axis
            // We set the camera height to 1.5 (eye-level) 
            // and look directly through the player at the pokemon.
            targetPos.set(
                player.position.x, 
                1.5, 
                player.position.z + 2.5
            );
            
            // Look slightly ahead of the player where the pokemon spawns
            lookAtPos.set(
                player.position.x, 
                1.5, 
                player.position.z - 2.5
            );
        }
        
        // Smoothly interpolate the camera position for a professional feel
        camera.position.lerp(targetPos, 0.1);
        
        // Update the camera's orientation
        camera.lookAt(lookAtPos);
    }
};
