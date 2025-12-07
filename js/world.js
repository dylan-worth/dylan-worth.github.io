import * as THREE from 'three';
import { CONFIG } from './state.js';

export const scene = new THREE.Scene();
export const treeObjects = [];
export const bushObjects = [];
export const poiObjects = [];
export const rabbitObjects = []; // New Array

// 1. Create Tree (Existing)
export function createTree(x, z, scale=1) {
    const g = new THREE.Group();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2*scale, 0.4*scale, 2*scale), new THREE.MeshStandardMaterial({color: 0x3e2723}));
    trunk.position.y = scale; trunk.castShadow = true; g.add(trunk);
    const leaves = new THREE.Mesh(new THREE.ConeGeometry(1.5*scale, 3*scale), new THREE.MeshStandardMaterial({color: 0x145a32}));
    leaves.position.y = 2.5*scale; leaves.castShadow = true; g.add(leaves);
    g.position.set(x, 0, z);
    g.userData = { type: 'tree', growing: scale===0.1, scale: scale };
    if(scale===0.1) g.scale.set(0.1,0.1,0.1);
    scene.add(g);
    treeObjects.push(g);
}

// 2. Create Bush (Existing)
export function createBush(x, z) {
    const g = new THREE.Group();
    const bush = new THREE.Mesh(new THREE.DodecahedronGeometry(0.6), new THREE.MeshStandardMaterial({color: 0x2ecc71}));
    bush.position.y = 0.4; bush.castShadow = true; g.add(bush);
    const berries = new THREE.Group();
    berries.name = "berries";
    [[0.4, 0.6, 0], [-0.3, 0.7, 0.3], [0, 0.5, -0.4]].forEach(p => {
        const berry = new THREE.Mesh(new THREE.SphereGeometry(0.1), new THREE.MeshBasicMaterial({color:0xe74c3c}));
        berry.position.set(...p); berries.add(berry);
    });
    g.add(berries);
    g.position.set(x, 0, z);
    g.userData = { type: 'bush', hasBerries: true, regenTimer: 0 };
    scene.add(g);
    bushObjects.push(g);
}

// 3. Create Rabbit (NEW)
export function createRabbit(x, z) {
    const g = new THREE.Group();
    
    // Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.3, 0.5), new THREE.MeshStandardMaterial({color: 0xffffff}));
    body.position.y = 0.15;
    body.castShadow = true;
    g.add(body);
    
    // Ears
    const ear1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.3, 0.1), new THREE.MeshStandardMaterial({color: 0xffffff}));
    ear1.position.set(0.1, 0.4, 0.2);
    g.add(ear1);
    const ear2 = ear1.clone();
    ear2.position.set(-0.1, 0.4, 0.2);
    g.add(ear2);

    g.position.set(x, 0, z);
    // AI Data: timer for movement, direction
    g.userData = { type: 'rabbit', hopTimer: 0, direction: new THREE.Vector3() };
    
    scene.add(g);
    rabbitObjects.push(g);
}

// 4. Create Sign (Existing)
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

// 5. Init World (Updated)
export function initWorld() {
    const ground = new THREE.Mesh(new THREE.CircleGeometry(60, 64), new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.8 }));
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    for(let i=0; i<150; i++) {
        let x=(Math.random()-0.5)*90, z=(Math.random()-0.5)*90;
        if(Math.sqrt(x*x+z*z)>5 && Math.abs(x-CONFIG.cabinPos.x)>6) createTree(x, z);
    }
    for(let i=0; i<20; i++) { // Bushes
        let x=(Math.random()-0.5)*90, z=(Math.random()-0.5)*90;
        if(Math.sqrt(x*x+z*z)>5) createBush(x, z);
    }
    for(let i=0; i<10; i++) { // Rabbits
        let x=(Math.random()-0.5)*90, z=(Math.random()-0.5)*90;
        if(Math.sqrt(x*x+z*z)>5) createRabbit(x, z);
    }
}
