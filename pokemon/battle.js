import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export const BattleSystem = {
    active: false,
    sprite: null,
    sheetTexture: null,
    cols: 5, 
    rows: 2,

    init(scene) {
        const loader = new THREE.TextureLoader();
        // Use a relative path to ensure GitHub Pages finds the file
        this.sheetTexture = loader.load('./spritesheet.png', 
            () => console.log("Pokemon sheet loaded!"),
            undefined,
            (err) => console.error("Texture failed to load. Check filename!", err)
        );
        
        // NearestFilter keeps the 8-bit design sharp
        this.sheetTexture.magFilter = THREE.NearestFilter;
        this.sheetTexture.minFilter = THREE.NearestFilter;
        this.sheetTexture.repeat.set(1 / this.cols, 1 / this.rows);
    },

    start(scene, playerPos) {
        this.active = true;
        const randomIndex = Math.floor(Math.random() * 10);
        this.setSpriteFrame(randomIndex);

        // MATERIAL FIX: Basic material is unlit, so it won't be dark/invisible
        const material = new THREE.SpriteMaterial({ 
            map: this.sheetTexture, 
            transparent: true,
            alphaTest: 0.01,   // Extremely low to ensure pixels show up
            depthTest: false,  // Forces it to render over the grass/ground
            depthWrite: false, // Prevents weird 'box' artifacts
            color: 0xffffff    // Full brightness
        });

        this.sprite = new THREE.Sprite(material);
        
        // POSITION FIX: Move it closer to the battle camera zoom
        // y: 1.8 puts it at eye-level, z-2.5 puts it right in front of the lens
        this.sprite.position.set(playerPos.x, 1.8, playerPos.z - 2.5); 
        this.sprite.scale.set(3.5, 3.5, 1); // Larger scale for visibility
        
        // Ensure the sprite is always on top of the scene layers
        this.sprite.renderOrder = 999; 
        
        scene.add(this.sprite);
    },

    setSpriteFrame(index) {
        const col = index % this.cols;
        const row = Math.floor(index / this.cols);
        this.sheetTexture.offset.x = col / this.cols;
        // UV coordinate fix for Three.js sprite sheets
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
