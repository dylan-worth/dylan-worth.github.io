import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export const BattleSystem = {
    active: false,
    mesh: null,
    sheetTexture: null,
    cols: 5, 
    rows: 2,
    isLoaded: false,

    /**
     * Pre-loads the sprite sheet and sets up the texture filtering.
     * @param {THREE.Scene} scene 
     */
    init(scene) {
        const loader = new THREE.TextureLoader();
        
        // Pointing to your specific filename 'pokemon.png'
        this.sheetTexture = loader.load('./pokemon.png', 
            () => { 
                this.isLoaded = true; 
                console.log("Pokemon sheet loaded successfully!");
            },
            undefined,
            (err) => {
                this.isLoaded = false;
                console.error("Could not find pokemon.png. Check your GitHub file name.");
            }
        );

        // NearestFilter ensures the pixel art stays crisp and not blurry
        this.sheetTexture.magFilter = THREE.NearestFilter;
        this.sheetTexture.minFilter = THREE.NearestFilter;

        // Tells Three.js to only show 1/5th width and 1/2 height of the sheet
        this.sheetTexture.repeat.set(1 / this.cols, 1 / this.rows);
    },

    /**
     * Spawns a random Pokemon and centers it in the battle camera view.
     */
    start(scene, playerPos) {
        this.active = true;

        // Pick a random Pokemon from the 10 designed sprites
        const randomIndex = Math.floor(Math.random() * 10);
        this.setSpriteFrame(randomIndex);

        // PlaneGeometry allows for better centering and unlit rendering
        const geometry = new THREE.PlaneGeometry(3.5, 3.5);
        
        // MeshBasicMaterial ignores all scene lighting (fixes the 'faint' look)
        const material = new THREE.MeshBasicMaterial({ 
            map: this.isLoaded ? this.sheetTexture : null, 
            color: this.isLoaded ? 0xffffff : 0xff00ff, // Pink fallback if missing
            transparent: true,
            alphaTest: 0.1,
            side: THREE.DoubleSide
        });

        this.mesh = new THREE.Mesh(geometry, material);
        
        // POSITIONING: Placed on the same X as the player, but in front of the camera
        // y: 1.5 is eye-level for the battle zoom.
        this.mesh.position.set(playerPos.x, 1.5, playerPos.z - 2.5); 
        
        // Ensure it faces the camera perfectly
        this.mesh.rotation.y = 0; 
        
        // Forced render order to stay on top of the grass
        this.mesh.renderOrder = 999;
        
        scene.add(this.mesh);
    },

    /**
     * Shifts the texture UVs to the correct Pokemon frame.
     */
    setSpriteFrame(index) {
        if (!this.sheetTexture) return;
        const col = index % this.cols;
        const row = Math.floor(index / this.cols);

        // Calculate the UV offset for the selected sprite
        this.sheetTexture.offset.x = col / this.cols;
        this.sheetTexture.offset.y = 1 - ((row + 1) / this.rows);
    },

    /**
     * Called in the main animate() loop to provide a bobbing motion
     */
    update() {
        if (this.active && this.mesh) {
            // Smooth sine-wave bobbing effect
            this.mesh.position.y = 1.5 + Math.sin(Date.now() * 0.005) * 0.1;
        }
    },

    /**
     * Removes the Pokemon from the scene when the battle ends.
     */
    end(scene) {
        this.active = false;
        if (this.mesh) {
            scene.remove(this.mesh);
            this.mesh = null;
        }
    }
};
