import { spawnMob } from './mc-entity.js';
import { createTree } from './mc-foliage.js';
import { WATER_LEVEL } from './mc-water.js';

export let blockMap = new Map();
export let objects = [];
export const WORLD_RADIUS = 30;

let sceneRef;
const materials = {};
const blockGeo = new THREE.BoxGeometry(1, 1, 1);

export function initWorld(scene) {
    sceneRef = scene;
    const mat = (c) => new THREE.MeshLambertMaterial({ color: c });
    materials.grass = mat(0x567d46); 
    materials.dirt = mat(0x5c4033);
    materials.stone = mat(0x808080); 
    materials.sand = mat(0xeecfa1);
    materials.wood_oak = mat(0x4a3728); 
    materials.leaves_oak = mat(0x228b22);
    materials.water = new THREE.MeshBasicMaterial({ color: 0x40a4df, transparent: true, opacity: 0.6 });
    
    // NEW LANTERN MATERIAL (Glows in Dark)
    materials.lantern = new THREE.MeshLambertMaterial({ 
        color: 0xffaa00, 
        emissive: 0xffaa00, 
        emissiveIntensity: 0.8 
    });
}

export function createBlock(x, y, z, type) {
    if(blockMap.has(`${x},${y},${z}`)) return;
    const mesh = new THREE.Mesh(blockGeo, materials[type]);
    mesh.position.set(x, y, z);
    mesh.matrixAutoUpdate = false; mesh.updateMatrix();
    mesh.userData = { type: type, solid: type !== 'water' };
    sceneRef.add(mesh);
    objects.push(mesh);
    blockMap.set(`${x},${y},${z}`, mesh);
    return mesh;
}

export function generateRow(x) {
    for (let z = -WORLD_RADIUS; z <= WORLD_RADIUS; z++) {
        let h = Math.floor(Math.sin(x/7) * 4 + Math.cos(z/9) * 4);
        let riverNoise = Math.sin(x/12) + Math.cos(z/15); 
        if (Math.abs(riverNoise) < 0.2 && h > WATER_LEVEL - 2) h = WATER_LEVEL - 2;

        let type = 'grass';
        if (h <= WATER_LEVEL) type = 'sand';

        for (let y = -6; y <= h; y++) {
            let t = type; if (y < h) t = 'dirt'; if (y < h - 3) t = 'stone';
            createBlock(x, y, z, t);
        }
        for (let y = h + 1; y <= WATER_LEVEL; y++) {
            createBlock(x, y, z, 'water');
            if (Math.random() < 0.01) spawnMob(sceneRef, 'fish', x, y, z);
        }

        if (type === 'grass' && Math.abs(riverNoise) >= 0.2) {
            if (Math.random() < 0.03) createTree(x, h+1, z);
            if (Math.random() < 0.002) spawnMob(sceneRef, 'bird', x, h+10, z);
        }
        if (type === 'sand' && h === WATER_LEVEL && Math.random() < 0.005) {
            spawnMob(sceneRef, 'crab', x, h+1, z);
        }
    }
}
