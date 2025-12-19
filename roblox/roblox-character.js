/* roblox-character.js - Player Physics & Abilities */

class RobloxCharacter {
    constructor(scene, position = {x:0, y:2, z:0}, color = 0xe74c3c) {
        // 1. VISUALS
        // Simple Box for now (Replace with your custom models later)
        this.mesh = new THREE.Mesh(
            new THREE.BoxGeometry(2, 4, 2),
            new THREE.MeshStandardMaterial({ color: color })
        );
        this.mesh.position.set(position.x, position.y, position.z);
        this.mesh.castShadow = true;
        scene.add(this.mesh);

        // 2. PHYSICS STATE
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.isGrounded = false;
        this.jumpCount = 0;

        // 3. ABILITY FLAGS (The "Soft Locks")
        // Turn these true/false in your specific game HTML file
        this.abilities = {
            runSpeed: 0.3,
            jumpPower: 0.5,
            canJump: true,
            canDoubleJump: false,
            canFly: false,
            gravity: 0.015
        };
    }

    // Call this every frame in RobloxEngine.onUpdate
    update(dt, joystick, cameraAngle, collisionSystem) {
        // --- A. MOVEMENT ---
        if (joystick && joystick.active) {
            const fX = Math.sin(cameraAngle); 
            const fZ = Math.cos(cameraAngle);
            const rX = Math.sin(cameraAngle + Math.PI/2); 
            const rZ = Math.cos(cameraAngle + Math.PI/2);
            
            // Calculate intention
            const dx = ((rX * joystick.x) + (fX * joystick.y)) * this.abilities.runSpeed;
            const dz = ((rZ * joystick.x) + (fZ * joystick.y)) * this.abilities.runSpeed;

            if (this.abilities.canFly) {
                // FLY MODE: Move purely relative to camera, no gravity
                this.mesh.position.x += dx;
                this.mesh.position.z += dz;
                // Fly Up/Down with Joystick Y if holding a button (simplified for now)
                this.mesh.position.y += (joystick.y * 0.1); 
            } else {
                // WALK MODE: Use Collision System
                collisionSystem.moveSafely(this.mesh, dx, dz);
            }

            // Rotate visual
            this.mesh.rotation.y = Math.atan2(dx, dz);
        }

        // --- B. GRAVITY & JUMPING ---
        if (!this.abilities.canFly) {
            // Apply Gravity
            this.velocity.y -= this.abilities.gravity;
            this.mesh.position.y += this.velocity.y;

            // Simple Floor Check (Replace with collisionSystem later if you have platforms)
            if (this.mesh.position.y <= 2) { 
                this.mesh.position.y = 2;
                this.velocity.y = 0;
                this.isGrounded = true;
                this.jumpCount = 0; // Reset jumps
            } else {
                this.isGrounded = false;
            }
        }
    }

    // Call this when Jump Button is pressed
    jump() {
        if (this.abilities.canFly) return; // Don't jump if flying

        // Normal Jump
        if (this.isGrounded && this.abilities.canJump) {
            this.velocity.y = this.abilities.jumpPower;
            this.isGrounded = false;
            this.jumpCount = 1;
            console.log("Jump!");
        } 
        // Double Jump
        else if (!this.isGrounded && this.abilities.canDoubleJump && this.jumpCount < 2) {
            this.velocity.y = this.abilities.jumpPower * 0.8; // Slightly weaker 2nd jump
            this.jumpCount++;
            console.log("Double Jump!");
        }
    }
    
    // Call to toggle fly mode
    toggleFly() {
        this.abilities.canFly = !this.abilities.canFly;
        this.velocity.y = 0; // Stop falling
        console.log("Fly Mode:", this.abilities.canFly);
    }
}
