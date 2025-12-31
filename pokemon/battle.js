import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export const BattleSystem = {
    active: false,
    enemyMesh: null,
    playerMesh: null,
    sheetTexture: null,
    cols: 5, rows: 2,
    isLoaded: false,

    init(scene) {
        const loader = new THREE.TextureLoader();
        this.sheetTexture = loader.load('./pokemon.png', 
            () => { this.isLoaded = true; },
            undefined,
            (err) => { console.error("pokemon.png missing"); }
        );
        this.sheetTexture.magFilter = THREE.NearestFilter;
        this.sheetTexture.minFilter = THREE.NearestFilter;
    },

    start(scene, playerPos) {
        this.active = true;

        // 1. Create Enemy (Top-Right)
        this.enemyMesh = this.createMonsterMesh(playerPos, 1.7, -2.5, 0.5); 
        
        // 2. Create Player Monster (Bottom-Left)
        // We use a different offset so it's a different monster from the sheet
        this.playerMesh = this.createMonsterMesh(playerPos, 0.8, -1.5, -0.5);
        this.playerMesh.scale.set(3, 3, 1); // Slightly smaller as it's closer

        scene.add(this.enemyMesh, this.playerMesh);
    },

    createMonsterMesh(playerPos, y, zOffset, xOffset) {
        const tex = this.sheetTexture.clone();
        tex.needsUpdate = true;
        tex.repeat.set(1 / this.cols, 1 / this.rows);
        
        // Pick a random frame for this specific instance
        const frame = Math.floor(Math.random() * 10);
        const col = frame % this.cols;
        const row = Math.floor(frame / this.cols);
        tex.offset.x = col / this.cols;
        tex.offset.y = 1 - ((row + 1) / this.rows);

        const mat = new THREE.MeshBasicMaterial({ 
            map: tex, transparent: true, alphaTest: 0.1, toneMapped: false 
        });
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 3.5), mat);
        
        mesh.position.set(playerPos.x + xOffset, y, playerPos.z + zOffset);
        mesh.renderOrder = 5;
        return mesh;
    },

    update() {
        if (this.active) {
            const time = Date.now() * 0.005;
            if (this.enemyMesh) this.enemyMesh.position.y = 1.6 + Math.sin(time) * 0.1;
            if (this.playerMesh) this.playerMesh.position.y = 0.8 + Math.sin(time + 1) * 0.05;
        }
    },

    // COMPLETE CLOSE OUT
    end(scene) {
        this.active = false;
        if (this.enemyMesh) {
            scene.remove(this.enemyMesh);
            this.enemyMesh.geometry.dispose();
            this.enemyMesh.material.dispose();
            this.enemyMesh = null;
        }
        if (this.playerMesh) {
            scene.remove(this.playerMesh);
            this.playerMesh.geometry.dispose();
            this.playerMesh.material.dispose();
            this.playerMesh = null;
        }
    }
};
