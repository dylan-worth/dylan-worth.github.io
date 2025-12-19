/* roblox-engine.js - The Foundation */

const RobloxEngine = {
    scene: null,
    camera: null,
    renderer: null,
    camControl: null,
    clock: new THREE.Clock(),
    onUpdate: null, // This is where your game logic plugs in

    init: function(containerId, touchLayerId) {
        console.log("Engine: Initializing...");
        const container = document.getElementById(containerId);
        
        if (!container) {
            console.error("Engine Error: Container not found!");
            return;
        }

        // 1. Setup Three.js
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); // Default Sky
        this.scene.fog = new THREE.Fog(0x87CEEB, 20, 100);

        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Wipe container and add Canvas
        container.innerHTML = "";
        container.appendChild(this.renderer.domElement);

        // 2. Re-create Touch Layer (Safe UI Stacking)
        // We create this dynamically so you don't have to put it in HTML manually
        let touchLayer = document.getElementById(touchLayerId);
        if (!touchLayer) {
            touchLayer = document.createElement('div');
            touchLayer.id = touchLayerId;
            touchLayer.style.cssText = "position:absolute; top:0; left:0; width:100%; height:100%; z-index:10;";
            container.appendChild(touchLayer);
        }

        // 3. Connect Camera Script
        if (typeof RobloxCamera !== 'undefined') {
            this.camControl = new RobloxCamera(this.camera, touchLayer);
        } else {
            console.warn("RobloxCamera script missing!");
        }

        // 4. Safety Light (Prevents total blackness if you forget lights)
        const safetyLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.5);
        this.scene.add(safetyLight);

        // 5. Resize Handling
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // 6. Start Loop
        this.animate();
    },

    animate: function() {
        // Request next frame FIRST (Prevent freezing)
        requestAnimationFrame(() => this.animate());

        const dt = this.clock.getDelta();

        // Run Game Logic (Safely)
        if (this.onUpdate) {
            try {
                this.onUpdate(dt);
            } catch (error) {
                console.error("Game Logic Crash:", error);
                this.onUpdate = null; // Stop logic, keep rendering
                alert("Game Error! Engine entered Safe Mode.");
            }
        }

        // Render
        if (this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }
};
