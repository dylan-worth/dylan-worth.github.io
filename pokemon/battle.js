import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export const BattleSystem = {
    active: false,
    sprite: null,
    sheetTexture: null,
    cols: 5, rows: 2,
    isLoaded: false,

    init(scene) {
        const loader = new THREE.TextureLoader();
        
        // We use the full callback to tell we exactly what's wrong on your screen
        this.sheetTexture = loader.load('./spritesheet.png', 
            () => { this.isLoaded = true; },
            undefined,
            (err) => {
                // This will show up in your game's text box if the file is missing!
                const box = document.querySelector('.dialog-box');
                if(box) box.innerHTML = "FILE ERROR: spritesheet.png not found!";
            }
        );

        this.sheetTexture.magFilter = THREE.NearestFilter;
        this.sheetTexture.minFilter = THREE.NearestFilter;
        this.sheetTexture.repeat.set(1 / this.cols, 1 / this.rows);
    },

    start(scene, playerPos) {
        this.active = true;
        const randomIndex = Math.floor(Math.random() * 10);
        this.setSpriteFrame(randomIndex);

        const material = new THREE.SpriteMaterial({ 
            // If the image is missing, it shows a bright PINK square
            map: this.isLoaded ? this.sheetTexture : null, 
            color: this.isLoaded ? 0xffffff : 0xff00ff, 
            transparent: true,
            alphaTest: 0.01,
            depthTest: false,
            depthWrite: false
        });

        this.sprite = new THREE.Sprite(material);
        
        // Move the sprite closer and higher to ensure it's on-screen
        this.sprite.position.set(playerPos.x, 1.6, playerPos.z - 2.5); 
        this.sprite.scale.set(3.5, 3.5, 1);
        this.sprite.renderOrder = 999;
        
        scene.add(this.sprite);
    },

    setSpriteFrame(index) {
        if (!this.sheetTexture) return;
        const col = index % this.cols;
        const row = Math.floor(index / this.cols);
        this.sheetTexture.offset.x = col / this.cols;
        this.sheetTexture.offset.y = 1 - ((row + 1) / this.rows);
    },

    end(scene) {
        this.active = false;
        if (this.sprite) {
            scene.remove(this.sprite);
            this.sprite = null;
        }
    }
};
