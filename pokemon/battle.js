import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export const BattleSystem = {
    active: false,
    sprite: null,
    sheetTexture: null,
    cols: 5, 
    rows: 2,
    isLoaded: false,

    init(scene) {
        const loader = new THREE.TextureLoader();
        
        // UPDATED: Now looks for your specific filename
        this.sheetTexture = loader.load('./pokemon.png', 
            () => { 
                this.isLoaded = true; 
                console.log("pokemon.png loaded successfully!");
            },
            undefined,
            (err) => {
                this.isLoaded = false;
                // Visible feedback on your mobile screen if it fails
                const box = document.querySelector('.dialog-box');
                if(box) box.innerHTML = "ERROR: pokemon.png not found!";
            }
        );

        this.sheetTexture.magFilter = THREE.NearestFilter; // Sharp 8-bit pixels
        this.sheetTexture.minFilter = THREE.NearestFilter;
        this.sheetTexture.repeat.set(1 / this.cols, 1 / this.rows);
    },

    start(scene, playerPos) {
        this.active = true;
        
        // Pick one of your 10 designs
        const randomIndex = Math.floor(Math.random() * 10);
        this.setSpriteFrame(randomIndex);

        const material = new THREE.SpriteMaterial({ 
            map: this.isLoaded ? this.sheetTexture : null, 
            color: this.isLoaded ? 0xffffff : 0xff00ff, // Pink fallback
            transparent: true,
            alphaTest: 0.01,
            depthTest: false, // Forces sprite to stay in front of world objects
            depthWrite: false
        });

        this.sprite = new THREE.Sprite(material);
        
        // POSITION: Placed at eye-level and close to the camera zoom
        this.sprite.position.set(playerPos.x, 1.7, playerPos.z - 2.2); 
        this.sprite.scale.set(3.8, 3.8, 1); // Large enough to be the focal point
        this.sprite.renderOrder = 999; // Ensure it draws over the HP box if needed
        
        scene.add(this.sprite);
    },

    setSpriteFrame(index) {
        if (!this.sheetTexture) return;
        const col = index % this.cols;
        const row = Math.floor(index / this.cols);
        this.sheetTexture.offset.x = col / this.cols;
        // Flip UV coordinates for standard sprite sheet reading
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
