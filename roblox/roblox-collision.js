/* roblox-collision.js - Physics & Collision System */

const CollisionSystem = {
    colliders: [], // List of objects (Walls, Trees, etc.)
    playerBox: new THREE.Box3(), // Invisible box around player
    wallBox: new THREE.Box3(),   // Helper box for walls

    // 1. Add an object to the collision list
    add: function(mesh) {
        if(mesh.geometry) {
            mesh.geometry.computeBoundingBox(); // Ensure math is ready
        }
        this.colliders.push(mesh);
    },

    // 2. Clear all colliders (Good for level resets)
    clear: function() {
        this.colliders = [];
    },

    // 3. Move Player Safely (Handles Sliding)
    moveSafely: function(playerGroup, dx, dz) {
        const startX = playerGroup.position.x;
        const startZ = playerGroup.position.z;

        // -- TRY MOVING X --
        playerGroup.position.x += dx;
        if (this.isColliding(playerGroup)) {
            playerGroup.position.x = startX; // Undo move if hit
        }

        // -- TRY MOVING Z --
        playerGroup.position.z += dz;
        if (this.isColliding(playerGroup)) {
            playerGroup.position.z = startZ; // Undo move if hit
        }
    },

    // Helper: Check if player is inside any wall
    isColliding: function(player) {
        // Create a bounding box around the player's current position
        // Assuming player is roughly 1x2x1 in size
        const pos = player.position;
        this.playerBox.set(
            new THREE.Vector3(pos.x - 0.5, pos.y, pos.z - 0.5),
            new THREE.Vector3(pos.x + 0.5, pos.y + 2, pos.z + 0.5)
        );

        for (let mesh of this.colliders) {
            // Get the wall's box in world space
            this.wallBox.setFromObject(mesh);
            
            // Check intersection
            if (this.playerBox.intersectsBox(this.wallBox)) {
                return true;
            }
        }
        return false;
    }
};
