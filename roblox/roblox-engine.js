/* roblox-engine.js - Core 3D Engine & Safety Loop */

const RobloxEngine = {
    scene: null,
    camera: null,
    renderer: null,
    camControl: null,
    clock: new THREE.Clock(),
    
    // The function your game logic will hook into
    onUpdate: null, 

    init: function(containerId, touchLayerId) {
        console.log("Initializing Engine...");
        
        // 1. Setup Three.js
        const container = document.getElementById(containerId);
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); // Default Blue Sky
        this.scene.fog = new THREE.Fog(0x87CEEB, 10, 50);

        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false }); // alpha: false prevents transparent black background
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Clear container and append
        container.innerHTML = ""; 
        container.appendChild(this.renderer.domElement);
        
        // Re-add UI layers on top if they were wiped (optional safety)
        let touchLayer = document.getElementById(touchLayerId);
        if (!touchLayer) {
            touchLayer = document.createElement('div');
            touchLayer.id = touchLayerId;
            touchLayer.style.position = 'absolute';
            touchLayer.style.top = '0';
            touchLayer.style.left = '0';
            touchLayer.style.width = '100%';
            touchLayer.style.height = '100%';
            touchLayer.style.zIndex = '10';
            container.appendChild(touchLayer);
        } else {
            container.appendChild(touchLayer);
        }

        // 2. Setup Camera Control
        // Assumes roblox-cam.js is loaded
        if (typeof RobloxCamera !== 'undefined') {
            this.camControl = new RobloxCamera(this.camera, touchLayer);
        } else {
            console.warn("RobloxCamera not found. Camera locked.");
        }

        // 3. Resize Handler
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // 4. Start Loop
        this.animate();
    },

    animate: function() {
        requestAnimationFrame(() => this.animate());

        const dt = this.clock.getDelta();

        // 5. SAFETY TRY-CATCH
        // If game logic crashes, the game keeps rendering the last frame instead of going black.
        if (this.onUpdate) {
            try {
                this.onUpdate(dt);
            } catch (error) {
                console.error("GAME LOGIC CRASHED:", error);
                this.onUpdate = null; // Disable logic to save the renderer
                alert("Game Error! Check Console. (Safety Mode Active)");
            }
        }

        this.renderer.render(this.scene, this.camera);
    }
};
