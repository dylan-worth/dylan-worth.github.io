/* roblox-engine.js - Fixed Core Engine */

const RobloxEngine = {
    scene: null,
    camera: null,
    renderer: null,
    camControl: null,
    clock: new THREE.Clock(),
    onUpdate: null, 

    init: function(containerId, touchLayerId) {
        console.log("Engine: Initializing...");
        const container = document.getElementById(containerId);
        
        if (!container) {
            console.error("Engine Error: Container '" + containerId + "' not found!");
            return;
        }

        // 1. Setup Three.js
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); 
        
        // Lighter Fog (Start at 20, fade out at 100)
        this.scene.fog = new THREE.Fog(0x87CEEB, 20, 100); 

        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Clear and Append
        container.innerHTML = ""; 
        container.appendChild(this.renderer.domElement);

        // 2. Re-create Touch Layer (Safe UI Stacking)
        let touchLayer = document.getElementById(touchLayerId);
        if (!touchLayer) {
            touchLayer = document.createElement('div');
            touchLayer.id = touchLayerId;
            touchLayer.style.cssText = "position:absolute; top:0; left:0; width:100%; height:100%; z-index:10;";
            container.appendChild(touchLayer);
        } else {
            container.appendChild(touchLayer); // Move existing to top
        }

        // 3. Setup Camera Control
        if (typeof RobloxCamera !== 'undefined') {
            this.camControl = new RobloxCamera(this.camera, touchLayer);
        }

        // 4. SAFETY LIGHT (Prevents Pitch Black Screens)
        const safetyLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.5);
        this.scene.add(safetyLight);

        // 5. Resize Handler
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // 6. Start Loop
        console.log("Engine: Starting Loop...");
        this.animate();
    },

    animate: function() {
        // 1. Request Frame FIRST (Ensures loop continues even if logic crashes)
        requestAnimationFrame(() => this.animate());

        const dt = this.clock.getDelta();

        // 2. Run Game Logic (Safely)
        if (this.onUpdate) {
            try {
                this.onUpdate(dt);
            } catch (error) {
                console.error("GAME CRASH:", error);
                this.onUpdate = null; // Disable broken logic
            }
        }

        // 3. Render Scene
        if (this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }
};
