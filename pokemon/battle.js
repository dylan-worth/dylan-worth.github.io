import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export const BattleSystem = {
    active: false,
    sprite: null,
    sheetTexture: null,
    cols: 5, rows: 2,

    init(scene) {
        const loader = new THREE.TextureLoader();
        this.sheetTexture = loader.load('./spritesheet.png');
        this.sheetTexture.magFilter = THREE.NearestFilter;
        this.sheetTexture.minFilter = THREE.NearestFilter;
        this.sheetTexture.repeat.set(1 / this.cols, 1 / this.rows);
    },

    start(scene, playerPos) {
        this.active = true;
        const randomIndex = Math.floor(Math.random() * 10);
        this.setSpriteFrame(randomIndex);

        // FIX: Use BasicMaterial so lighting doesn't wash it out
        // This makes the sprite "self-illuminated"
        const material = new THREE.SpriteMaterial({ 
            map: this.sheetTexture, 
            transparent: true,
            alphaTest: 0.05, // Very low so we don't lose faint pixels
            color: 0xffffff // Ensure it stays bright
        });

        this.sprite = new THREE.Sprite(material);
        
        // FIX: Move it much closer to the camera and higher up
        // Based on your zoom, it was too far back.
        this.sprite.position.set(playerPos.x, 1.8, playerPos.z - 2.5); 
        this.sprite.scale.set(3, 3, 1); // Bumped size to 3x
        
        scene.add(this.sprite);
    },

    setSpriteFrame(index) {
        const col = index % this.cols;
        const row = Math.floor(index / this.cols);
        this.sheetTexture.offset.x = col / this.cols;
        this.sheetTexture.offset.y = 1 - ((row + 1) / this.rows);
    },

    end(scene) {
        this.active = false;
        if (this.sprite) { scene.remove(this.sprite); this.sprite = null; }
    }
};
