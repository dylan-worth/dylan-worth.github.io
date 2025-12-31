import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export const CameraSystem = {
    /**
     * Controls the camera transition between Overworld and Battle states.
     * @param {THREE.PerspectiveCamera} camera 
     * @param {THREE.Mesh} player 
     * @param {string} gameState 
     */
    update(camera, player, gameState) {
        const targetPos = new THREE.Vector3();
        const lookAtPos = new THREE.Vector3();

        if (gameState === 'OVERWORLD') {
            // Standard top-down follow view
            // We follow the player's X, but stay 7 units up and 5 units back
            targetPos.set(
                player.position.x, 
                7, 
                player.position.z + 5
            );
            
            // Look directly at the player on the ground
            lookAtPos.set(
                player.position.x, 
                0, 
                player.position.z
            );
        } 
        else if (gameState === 'BATTLE') {
            // BATTLE ZOOM: Eye-level centering
            // We align the camera perfectly with the player's X coordinate.
            // Height is set to 1.5 to match the Pokemon's bobbing center.
            targetPos.set(
                player.position.x, 
                1.5, 
                player.position.z + 2.5
            );
            
            // Look straight ahead through the player at the Pokemon sprite
            lookAtPos.set(
                player.position.x, 
                1.5, 
                player.position.z - 2.5
            );
        }

        // Smooth Lerp (Linear Interpolation) for that professional transition feel
        // 0.1 provides a smooth slide when the battle flash happens.
        camera.position.lerp(targetPos, 0.1);
        
        // Force the camera to stay focused on the center point
        camera.lookAt(lookAtPos);
    }
};
