import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export const BattleSystem = {
    active: false,
    mesh: null,
    sheetTexture: null,
    cols: 5, 
    rows: 2,
    isLoaded: false,

    init(scene) {
        const loader = new THREE.TextureLoader();
        // Pointing to your specific filename
        this.sheetTexture = loader.load('./pokemon.png', 
            () => { this.isLoaded = true; },
            undefined,
            (err) => { console.error("Missing pokemon.png on GitHub"); }
        );

        this.sheetTexture.magFilter = THREE.NearestFilter; // Sharp 8-bit look
        this.sheetTexture.minFilter = THREE.NearestFilter;
        this.sheetTexture.repeat.set(1 / this.cols, 1 / this.rows);
    },

    start(scene, playerPos) {
        this.active = true;
        const randomIndex = Math.floor(Math.random() * 10);
        this.setSpriteFrame(randomIndex);

        // PlaneGeometry for a flat, clear image
        const geometry = new THREE.PlaneGeometry(4.2, 4.2);
        
        // BasicMaterial ignores all scene lighting (fixes the faintness)
        const material = new THREE.MeshBasicMaterial({ 
            map: this.isLoaded ? this.sheetTexture : null, 
            color: this.isLoaded ? 0xffffff : 0xff00ff, 
            transparent: true,
            alphaTest: 0.05,
            side: THREE.DoubleSide,
            toneMapped: false // Prevents the colors from being washed out
        });

        this.mesh = new THREE.Mesh(geometry, material);
        
        // POSITION: Dead center on the X-axis, at eye-level
        this.mesh.position.set(playerPos.x, 1.5, playerPos.z - 2.5); 
        
        // Ensure it sits behind the UI but in front of the world
        this.mesh.renderOrder = 5; 
        
        scene.add(this.mesh);
    },

    setSpriteFrame(index) {
        if (!this.sheetTexture) return;
        const col = index % this.cols;
        const row = Math.floor(index / this.cols);
        this.sheetTexture.offset.x = col / this.cols;
        this.sheetTexture.offset.y = 1 - ((row + 1) / this.rows); // UV flip
    },

    /**
     * Call this in your main game.js animate() loop
     */
    update() {
        if (this.active && this.mesh) {
            // Smooth sine bobbing
            this.mesh.position.y = 1.5 + Math.sin(Date.now() * 0.005) * 0.12;
        }
    },

    end(scene) {
        this.active = false;
        if (this.mesh) {
            scene.remove(this.mesh);
            this.mesh = null;
        }
    }
};
