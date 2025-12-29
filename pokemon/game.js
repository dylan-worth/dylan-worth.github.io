import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

const container = document.getElementById('threejs-container');
const battleUI = document.getElementById('battle-ui');
let gameState = 'OVERWORLD';

// --- SCENE SETUP ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x91e35d);

const camera = new THREE.PerspectiveCamera(60, 160 / 144, 0.1, 1000);
camera.position.set(0, 8, 6);

const renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setSize(160, 144);
container.appendChild(renderer.domElement);

// --- WORLD ASSETS ---
const obstacles = [];
const trainers = [];

function createObject(x, z, color, isTrainer = false) {
    const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.8, 0.8),
        new THREE.MeshStandardMaterial({ color })
    );
    mesh.position.set(x, 0.4, z);
    scene.add(mesh);
    if (isTrainer) trainers.push({ x, z });
    else obstacles.push({ x, z });
}

// Map Layout
for(let i=0; i<10; i++) {
    createObject(Math.floor(Math.random()*10-5), Math.floor(Math.random()*10-5), 0x2d5a27); // Trees
}
createObject(2, -2, 0x0000ff, true); // The Rival Trainer

// --- PLAYER ---
const player = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 0.7, 0.7),
    new THREE.MeshStandardMaterial({ color: 0xffff00 })
);
player.position.y = 0.35;
scene.add(player);

// --- LIGHTS ---
scene.add(new THREE.AmbientLight(0xffffff, 0.8));

// --- ENGINE LOGIC ---
function tryMove(dx, dz) {
    if (gameState !== 'OVERWORLD') return;

    const nextX = Math.round(player.position.x + dx);
    const nextZ = Math.round(player.position.z + dz);

    if (trainers.some(t => t.x === nextX && t.z === nextZ)) {
        gameState = 'BATTLE';
        battleUI.classList.remove('hidden');
        return;
    }

    if (!obstacles.some(o => o.x === nextX && o.z === nextZ)) {
        player.position.x = nextX;
        player.position.z = nextZ;
    }
}

// Controls
document.getElementById('btn-up').onclick = () => tryMove(0, -1);
document.getElementById('btn-down').onclick = () => tryMove(0, 1);
document.getElementById('btn-left').onclick = () => tryMove(-1, 0);
document.getElementById('btn-right').onclick = () => tryMove(1, 0);
document.getElementById('btn-a').onclick = () => {
    if (gameState === 'BATTLE') {
        gameState = 'OVERWORLD';
        battleUI.classList.add('hidden');
    }
};

// Render Loop
function animate() {
    requestAnimationFrame(animate);
    
    if (gameState === 'OVERWORLD') {
        camera.position.lerp(new THREE.Vector3(player.position.x, 6, player.position.z + 4), 0.1);
        camera.lookAt(player.position.x, 0, player.position.z);
    } else {
        camera.position.lerp(new THREE.Vector3(player.position.x, 1.5, player.position.z + 2), 0.05);
    }
    
    renderer.render(scene, camera);
}
animate();
