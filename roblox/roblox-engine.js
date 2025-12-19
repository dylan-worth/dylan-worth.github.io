/* roblox-engine.js - Fixed (No UI Deletion) */

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
            console.error("Engine Error: Container not found!");
            return;
        }

        // 1. Setup Three.js
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); 
        this.scene.fog = new THREE.Fog(0x87CEEB, 20, 100);

        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // 2. Insert Canvas SAFELY (Do NOT wipe innerHTML)
        // We set the canvas to absolute position at z-index 0 so it sits behind UI
        this.renderer.domElement.style.position = 'absolute';
        this.renderer.domElement.style.top = '0';
        this.renderer.domElement.style.left = '0';
        this.renderer.domElement.style.zIndex = '0'; // Behind everything
        
        // Prepend adds it as the FIRST child, effectively putting it "behind" existing UI elements in DOM order
        if (container.firstChild) {
            container.insertBefore(this.renderer.domElement, container.firstChild);
        } else {
            container.appendChild(this.renderer.domElement);
        }

        // 3. Setup Touch Layer (For Camera Rotation)
        let touchLayer = document.getElementById(touchLayerId);
        if (!touchLayer) {
            touchLayer = document.createElement('div');
            touchLayer.id = touchLayerId;
            // Z-Index 10: Above Canvas (0), Below UI (20)
            touchLayer.style.cssText = "position:absolute; top:0; left:0; width:100%; height:100%; z-index:10;"; 
            container.appendChild(touchLayer);
        }

        // 4. Connect Camera Script
        if (typeof RobloxCamera !== 'undefined') {
            this.camControl = new RobloxCamera(this.camera, touchLayer);
        } else {
            console.warn("RobloxCamera script missing!");
        }

        // 5. Safety Light
        const safetyLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.5);
        this.scene.add(safetyLight);

        // 6. Resize Handling
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // 7. Start Loop
        this.animate();
    },

    animate: function() {
        requestAnimationFrame(() => this.animate());

        const dt = this.clock.getDelta();

        if (this.onUpdate) {
            try {
                this.onUpdate(dt);
            } catch (error) {
                console.error("Game Logic Crash:", error);
                this.onUpdate = null; 
            }
        }

        if (this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }
};
