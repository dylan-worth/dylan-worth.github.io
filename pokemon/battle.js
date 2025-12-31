import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export const BattleSystem = {
    active: false,
    sprite: null,
    sheetTexture: null,
    cols: 5, rows: 2, // 10 Pokemon sheet

    init(scene) {
        const loader = new THREE.TextureLoader();
        this.sheetTexture = loader.load('pokemon.png'); // Replace with your file
        this.sheetTexture.magFilter = THREE.NearestFilter; // Sharp pixels
        this.sheetTexture.minFilter = THREE.NearestFilter;
        this.sheetTexture.repeat.set(1 / this.cols, 1 / this.rows);
    },

    start(scene, playerPos) {
        this.active = true;
        const randomIndex = Math.floor(Math.random() * 10);
        this.setSpriteFrame(randomIndex);

        const material = new THREE.SpriteMaterial({ map: this.sheetTexture, transparent: true, alphaTest: 0.5 });
        this.sprite = new THREE.Sprite(material);
        this.sprite.position.set(playerPos.x, 1, playerPos.z - 2);
        this.sprite.scale.set(1.5, 1.5, 1);
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
