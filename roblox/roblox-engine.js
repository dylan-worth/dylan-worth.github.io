/* roblox-engine.js - Core 3D Engine & Safety Loop */

const RobloxEngine = {
    scene: null,
    camera: null,
    renderer: null,
    joystick: null,
    camControl: null,
    clock: new THREE.Clock(),
    
    // The function your game logic will hook into
    onUpdate: null, 

    init: function(containerId, touchLayerId) {
        // 1. Setup Three.js
        const container = document.getElementById(containerId);
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); // Default Blue Sky
        this.scene.fog = new THREE.Fog(0x87CEEB, 10, 50);

        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.insertBefore(this.renderer.domElement, document.getElementById(touchLayerId));

        // 2. Setup Camera Control
        this.camControl = new RobloxCamera(this.camera, document.getElementById(touchLayerId));

        // 3. Resize Handler
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // 4. Start Loop
        this.animate();
        console.log("RobloxEngine Initialized.");
    },

    animate: function() {
        requestAnimationFrame(() => this.animate());

        const dt = this.clock.getDelta();

        // 5. SAFETY TRY-CATCH
        // If game logic crashes, the game keeps rendering the last frame instead of going black.
        try {
            if (this.onUpdate) this.onUpdate(dt);
        } catch (error) {
            console.error("GAME LOGIC CRASHED:", error);
            // Optional: Stop the update loop to prevent console spam
            this.onUpdate = null; 
            alert("Game Error: Check Console. Rendering Safety Mode.");
        }

        this.renderer.render(this.scene, this.camera);
    }
};
