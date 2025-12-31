import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export const BattleSystem = {
    active: false,
    enemyMesh: null,
    playerMesh: null,
    sheetTexture: null,
    cols: 5, 
    rows: 2,
    isLoaded: false,

    init(scene) {
        const loader = new THREE.TextureLoader();
        this.sheetTexture = loader.load('./pokemon.png', 
            () => { this.isLoaded = true; },
            undefined,
            (err) => { console.error("pokemon.png missing for battle system"); }
        );
        this.sheetTexture.magFilter = THREE.NearestFilter;
        this.sheetTexture.minFilter = THREE.NearestFilter;
    },

    /**
     * @param {THREE.Scene} scene 
     * @param {THREE.Vector3} playerPos 
     * @param {Array} inventory - Passed from PlayerState.inventory
     */
    start(scene, playerPos, inventory) {
        this.active = true;

        // 1. Setup Wild Enemy (Top-Right)
        // Picks a random index from the full sheet (0-9)
        const wildIndex = Math.floor(Math.random() * 10);
        this.enemyMesh = this.createMonsterMesh(playerPos, 1.7, -2.5, 0.5, wildIndex); 
        
        // 2. Setup Player Monster (Bottom-Left)
        // Pulls the first monster ID from your saved inventory
        const myMonsterIndex = (inventory && inventory.length > 0) ? inventory[0] : 0;
        this.playerMesh = this.createMonsterMesh(playerPos, 0.8, -1.5, -0.5, myMonsterIndex);
        
        // Visual polish for player monster (closer = slightly larger)
        this.playerMesh.scale.set(4, 4, 1); 

        scene.add(this.enemyMesh, this.playerMesh);
    },

    createMonsterMesh(playerPos, y, zOffset, xOffset, spriteIndex) {
        // Clone texture so each monster can show a different frame
        const tex = this.sheetTexture.clone();
        tex.needsUpdate = true;
        tex.repeat.set(1 / this.cols, 1 / this.rows);
        
        // Calculate UV coordinates for the specific sprite index
        const col = spriteIndex % this.cols;
        const row = Math.floor(spriteIndex / this.cols);
        tex.offset.x = col / this.cols;
        tex.offset.y = 1 - ((row + 1) / this.rows);

        const mat = new THREE.MeshBasicMaterial({ 
            map: tex, 
            transparent: true, 
            alphaTest: 0.1, 
            toneMapped: false 
        });
        
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 3.5), mat);
        mesh.position.set(playerPos.x + xOffset, y, playerPos.z + zOffset);
        mesh.renderOrder = 5; // Layered under UI but over grass
        return mesh;
    },

    update() {
        if (this.active) {
            const time = Date.now() * 0.005;
            // Enemy bobs at one frequency
            if (this.enemyMesh) this.enemyMesh.position.y = 1.7 + Math.sin(time) * 0.1;
            // Player monster bobs slightly out of sync for a natural feel
            if (this.playerMesh) this.playerMesh.position.y = 0.8 + Math.sin(time + 1) * 0.05;
        }
    },

    /**
     * Closes out the battle completely and clears memory
     */
    end(scene) {
        this.active = false;
        
        const cleanup = (mesh) => {
            if (mesh) {
                scene.remove(mesh);
                mesh.geometry.dispose();
                mesh.material.map.dispose(); // Clear the cloned texture
                mesh.material.dispose();
            }
        };

        cleanup(this.enemyMesh);
        cleanup(this.playerMesh);
        
        this.enemyMesh = null;
        this.playerMesh = null;
        console.log("Battle cleared from memory.");
    }
};
