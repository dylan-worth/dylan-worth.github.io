import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { UI } from './ui.js';
import { CameraSystem } from './camera.js';
import { GrassSystem } from './grass.js';
import { BattleSystem } from './battle.js';

// --- 1. CORE ENGINE SETUP ---
const container = document.getElementById('threejs-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x7cfc00); // Pokemon Green

const camera = new THREE.PerspectiveCamera(60, 270 / 220, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// --- 2. LIGHTING SYSTEM ---
// We define these globally so we can dim them during battles
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const sun = new THREE.DirectionalLight(0xffffff, 0.6);
sun.position.set(5, 10, 5);
scene.add(sun);

// --- 3. GAME STATE ---
let gameState = 'OVERWORLD';
let isPaused = false;

// Initialize modular systems
UI.init((paused) => { isPaused = paused; });
BattleSystem.init(scene); // Loads the sprite sheet texture

// --- 4. WORLD GENERATION ---
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

// Generate basic environment and Tall Grass zones
for(let i=0; i<10; i++) {
    addTree(Math.floor(Math.random() * 12 - 6), Math.floor(Math.random() * 12 - 8));
}
GrassSystem.spawn(scene, -3, -3, 4, 4);

// --- 5. THE PLAYER ---
const player = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 0.7, 0.7),
    new THREE.MeshStandardMaterial({ color: 0xffff00 })
);
player.position.y = 0.35;
scene.add(player);

// --- 6. BATTLE TRANSITION LOGIC ---
function startBattle(message) {
    const screen = document.querySelector('.gbc-screen-border');
    screen.classList.add('battle-flash'); // Trigger CSS flash effect

    // Dim lights to make the 2D sprite pop against the background
    sun.intensity = 0.2; 
    ambientLight.intensity = 0.4;

    setTimeout(() => {
        screen.classList.remove('battle-flash');
        gameState = 'BATTLE';
        document.getElementById('battle-ui').classList.remove('hidden');
        
        // Use typewriter effect for the encounter message
        UI.typeWriter(message, ".dialog-box");
        
        // Spawn the Pokemon sprite from our 10-design sheet
        BattleSystem.start(scene, player.position);
    }, 600);
}

function tryMove(dx, dz) {
    if (gameState !== 'OVERWORLD' || isPaused) return;

    const nextX = Math.round(player.position.x + dx);
    const nextZ = Math.round(player.position.z + dz);

    // Collision Check
    if (obstacles.some(o => o.x === nextX && o.z === nextZ)) return;

    // Execute Movement
    player.position.x = nextX;
    player.position.z = nextZ;

    // Check for random encounters in tall grass
    if (GrassSystem.checkEncounter(nextX, nextZ)) {
        startBattle("A Wild Pokémon appeared!");
    }
}

// --- 7. INPUT BINDINGS ---
document.getElementById('btn-up').onclick = () => tryMove(0, -1);
document.getElementById('btn-down').onclick = () => tryMove(0, 1);
document.getElementById('btn-left').onclick = () => tryMove(-1, 0);
document.getElementById('btn-right').onclick = () => tryMove(1, 0);

document.getElementById('btn-a').onclick = () => {
    if (gameState === 'BATTLE') {
        gameState = 'OVERWORLD';
        document.getElementById('battle-ui').classList.add('hidden');
        
        // Cleanup the sprite and restore world lighting
        BattleSystem.end(scene);
        sun.intensity = 0.6;
        ambientLight.intensity = 0.8;
    }
};

window.addEventListener('keydown', (e) => {
    if (e.key === "ArrowUp") tryMove(0, -1);
    if (e.key === "ArrowDown") tryMove(0, 1);
    if (e.key === "ArrowLeft") tryMove(-1, 0);
    if (e.key === "ArrowRight") tryMove(1, 0);
});

// --- 8. MAIN LOOP ---
function animate() {
    requestAnimationFrame(animate);
    
    // Smoothly update camera position based on current state
    CameraSystem.update(camera, player, gameState);
    
    renderer.render(scene, camera);
}
animate();
