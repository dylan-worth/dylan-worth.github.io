import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { UI } from './ui.js';

// --- SCENE SETUP ---
const container = document.getElementById('threejs-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x7cfc00); // Grass Green

const camera = new THREE.PerspectiveCamera(60, 270 / 220, 0.1, 1000);
camera.position.set(0, 8, 6);

const renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// --- LIGHTS ---
scene.add(new THREE.AmbientLight(0xffffff, 0.8));
const sun = new THREE.DirectionalLight(0xffffff, 0.6);
sun.position.set(5, 10, 5);
scene.add(sun);

// --- GAME STATE ---
let gameState = 'OVERWORLD';
let isPaused = false;

UI.init((paused) => { isPaused = paused; });

// --- WORLD ASSETS ---
const obstacles = [];
const trainers = [];

function addObject(x, z, color, type = 'tree') {
    const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.8, 0.8),
        new THREE.MeshStandardMaterial({ color })
    );
    mesh.position.set(x, 0.4, z);
    scene.add(mesh);
    if (type === 'trainer') trainers.push({ x, z });
    else obstacles.push({ x, z });
}

// Generate small forest and a trainer
for(let i=0; i<12; i++) {
    let rx = Math.floor(Math.random() * 10 - 5);
    let rz = Math.floor(Math.random() * 10 - 5);
    if(rx !== 0 || rz !== 0) addObject(rx, rz, 0x228b22);
}
addObject(2, -2, 0x0000ff, 'trainer');

// --- PLAYER ---
const player = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 0.7, 0.7),
    new THREE.MeshStandardMaterial({ color: 0xffff00 })
);
player.position.y = 0.35;
scene.add(player);

// --- MOVEMENT LOGIC ---
function tryMove(dx, dz) {
    if (gameState !== 'OVERWORLD' || isPaused) return;

    const nextX = Math.round(player.position.x + dx);
    const nextZ = Math.round(player.position.z + dz);

    // Trainer Encounter
    if (trainers.some(t => t.x === nextX && t.z === nextZ)) {
        startBattle();
        return;
    }

    // Collision check
    if (!obstacles.some(o => o.x === nextX && o.z === nextZ)) {
        player.position.x = nextX;
        player.position.z = nextZ;
    }
}

function startBattle() {
    gameState = 'BATTLE';
    document.getElementById('battle-ui').classList.remove('hidden');
    UI.typeWriter("A Trainer challenges we!", ".dialog-box");
}

// Controls
document.getElementById('btn-up').onclick = () => tryMove(0, -1);
document.getElementById('btn-down').onclick = () => tryMove(0, 1);
document.getElementById('btn-left').onclick = () => tryMove(-1, 0);
document.getElementById('btn-right').onclick = () => tryMove(1, 0);

document.getElementById('btn-a').onclick = () => {
    if (gameState === 'BATTLE') {
        gameState = 'OVERWORLD';
        document.getElementById('battle-ui').classList.add('hidden');
    }
};

// --- ANIMATION LOOP ---
function animate() {
    requestAnimationFrame(animate);
    
    // Dynamic Camera
    const target = (gameState === 'OVERWORLD') 
        ? new THREE.Vector3(player.position.x, 7, player.position.z + 5)
        : new THREE.Vector3(player.position.x - 1, 1.5, player.position.z + 2);
    
    camera.position.lerp(target, 0.1);
    camera.lookAt(player.position.x, 0, player.position.z);
    
    renderer.render(scene, camera);
}
animate();
