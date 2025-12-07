import * as THREE from 'three';
import { CONFIG } from './state.js';

export const scene = new THREE.Scene();
export const treeObjects = [];
export const bushObjects = [];
export const poiObjects = [];

// --- ASSETS GENERATION ---

// 1. Create a Tree
export function createTree(x, z, scale=1) {
    const g = new THREE.Group();
    // Trunk
    const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2*scale, 0.4*scale, 2*scale), 
        new THREE.MeshStandardMaterial({color: 0x3e2723})
    );
    trunk.position.y = scale; 
    trunk.castShadow = true; 
    g.add(trunk);
    
    // Leaves
    const leaves = new THREE.Mesh(
        new THREE.ConeGeometry(1.5*scale, 3*scale), 
        new THREE.MeshStandardMaterial({color: 0x145a32})
    );
    leaves.position.y = 2.5*scale; 
    leaves.castShadow = true; 
    g.add(leaves);
    
    g.position.set(x, 0, z);
    g.userData = { type: 'tree', growing: scale===0.1, scale: scale };
    
    if(scale===0.1) g.scale.set(0.1,0.1,0.1);
    
    scene.add(g);
    treeObjects.push(g);
}

// 2. Create a Berry Bush
export function createBush(x, z) {
    const g = new THREE.Group();
    
    // Bush body
    const bush = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.6),
        new THREE.MeshStandardMaterial({color: 0x2ecc71})
    );
    bush.position.y = 0.4;
    bush.castShadow = true;
    g.add(bush);

    // Berries (Red dots)
    const berries = new THREE.Group();
    berries.name = "berries";
    const pos = [[0.4, 0.6, 0], [-0.3, 0.7, 0.3], [0, 0.5, -0.4]];
    pos.forEach(p => {
        const berry = new THREE.Mesh(new THREE.SphereGeometry(0.1), new THREE.MeshBasicMaterial({color:0xe74c3c}));
        berry.position.set(...p);
        berries.add(berry);
    });
    g.add(berries);

    g.position.set(x, 0, z);
    g.userData = { type: 'bush', hasBerries: true, regenTimer: 0 };
    
    scene.add(g);
    bushObjects.push(g);
}

// 3. World Generation Loop
export function initWorld() {
    // Ground
    const ground = new THREE.Mesh(new THREE.CircleGeometry(60, 64), new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.8 }));
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Trees
    for(let i=0; i<150; i++) {
        let x=(Math.random()-0.5)*90, z=(Math.random()-0.5)*90;
        if(Math.sqrt(x*x+z*z)>5 && Math.abs(x-CONFIG.cabinPos.x)>6) createTree(x, z);
    }

    // Bushes
    for(let i=0; i<30; i++) {
        let x=(Math.random()-0.5)*90, z=(Math.random()-0.5)*90;
        if(Math.sqrt(x*x+z*z)>5) createBush(x, z);
    }
}

// 4. Create POI Signs
export function createSign(data) {
    const g = new THREE.Group();
    g.position.set(data.x, 0, data.z);
    
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2, 0.2), new THREE.MeshStandardMaterial({color: 0x5d4037}));
    post.position.y = 1; g.add(post);
    
    const board = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.8, 0.1), new THREE.MeshStandardMaterial({color: data.color}));
    board.position.set(0, 1.8, 0.1); g.add(board);
    
    const light = new THREE.PointLight(data.color, 1, 5);
    light.position.y = 2; g.add(light);
    
    g.userData = data;
    scene.add(g);
    poiObjects.push(g);
}
