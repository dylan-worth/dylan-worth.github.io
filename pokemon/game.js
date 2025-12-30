import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { UI } from './ui.js';
import { CameraSystem } from './camera.js';
import { GrassSystem } from './grass.js';

// --- 1. CORE ENGINE SETUP ---
const container = document.getElementById('threejs-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x7cfc00); // Classic Pokémon Grass Green

const camera = new THREE.PerspectiveCamera(60, 270 / 220, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// --- 2. GAME STATE ---
let gameState = 'OVERWORLD';
let isPaused = false;

// Initialize UI and pass a callback to handle menu pausing
UI.init((paused) => { 
    isPaused = paused; 
});

// --- 3. WORLD GENERATION ---
// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);
const sun = new THREE.DirectionalLight(0xffffff, 0.6);
sun.position.set(5, 10, 5);
scene.add(sun);

// Static Obstacles
const obstacles = [];
function addTree(x, z) {
    const tree = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 1.2, 0.8),
        new THREE.MeshStandardMaterial({ color: 0x228b22 })
    );
    tree.position.set(x, 0.6, z);
    scene.add(tree);
    obstacles.push({ x, z });
}

// Add some trees and our Tall Grass system
for(let i=0; i<8; i++) {
    addTree(Math.floor(Math.random() * 10 - 5), Math.floor(Math.random() * 10 - 8));
}
GrassSystem.spawn(scene, -3, -3, 4, 4); // Spawn a 4x4 grass patch

// --- 4. THE PLAYER ---
const player = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 0.7, 0.7),
    new THREE.MeshStandardMaterial({ color: 0xffff00 }) // Pikachu Yellow
);
player.position.y = 0.35;
scene.add(player);

// --- 5. INTERACTION LOGIC ---
function startBattle(message) {
    gameState = 'BATTLE';
    document.getElementById('battle-ui').classList.remove('hidden');
    UI.typeWriter(message, ".dialog-box");
}

function tryMove(dx, dz) {
    // Prevent movement if battling or menu is open
    if (gameState !== 'OVERWORLD' || isPaused) return;

    const nextX = Math.round(player.position.x + dx);
    const nextZ = Math.round(player.position.z + dz);

    // Collision Check
    if (obstacles.some(o => o.x === nextX && o.z === nextZ)) return;

    // Execute Move
    player.position.x = nextX;
    player.position.z = nextZ;

    // Check for Grass Encounter
    if (GrassSystem.checkEncounter(nextX, nextZ)) {
        startBattle("A Wild Pokémon appeared!");
    }
}

// --- 6. INPUT BINDINGS ---
// GBC Button Clicks
document.getElementById('btn-up').onclick = () => tryMove(0, -1);
document.getElementById('btn-down').onclick = () => tryMove(0, 1);
document.getElementById('btn-left').onclick = () => tryMove(-1, 0);
document.getElementById('btn-right').onclick = () => tryMove(1, 0);

// Battle Action
document.getElementById('btn-a').onclick = () => {
    if (gameState === 'BATTLE') {
        gameState = 'OVERWORLD';
        document.getElementById('battle-ui').classList.add('hidden');
    }
};

// Keyboard Support
window.addEventListener('keydown', (e) => {
    if (e.key === "ArrowUp") tryMove(0, -1);
    if (e.key === "ArrowDown") tryMove(0, 1);
    if (e.key === "ArrowLeft") tryMove(-1, 0);
    if (e.key === "ArrowRight") tryMove(1, 0);
});

// --- 7. MAIN LOOP ---
function animate() {
    requestAnimationFrame(animate);
    
    // Smoothly update camera position based on current gameState
    CameraSystem.update(camera, player, gameState);
    
    renderer.render(scene, camera);
}
animate();
