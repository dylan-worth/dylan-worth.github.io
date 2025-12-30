import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export const GrassSystem = {
    patches: [],

    spawn(scene, xStart, zStart, width, depth) {
        const geometry = new THREE.BoxGeometry(0.9, 0.15, 0.9);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0x244d21, 
            transparent: true, 
            opacity: 0.7 
        });

        for (let x = 0; x < width; x++) {
            for (let z = 0; z < depth; z++) {
                const grass = new THREE.Mesh(geometry, material);
                const px = xStart + x;
                const pz = zStart + z;
                grass.position.set(px, 0.08, pz);
                scene.add(grass);
                this.patches.push({ x: px, z: pz });
            }
        }
    },

    checkEncounter(playerX, playerZ) {
        // Check if player is standing on a grass tile
        const inGrass = this.patches.some(g => g.x === playerX && g.z === playerZ);
        if (inGrass) {
            // 15% chance to trigger a battle
            return Math.random() < 0.15;
        }
        return false;
    }
};
