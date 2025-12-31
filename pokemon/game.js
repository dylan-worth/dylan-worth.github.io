import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { UI } from './ui.js';
import { CameraSystem } from './camera.js';
import { GrassSystem } from './grass.js';
import { BattleSystem } from './battle.js';

// --- 1. ENGINE SETUP ---
const container = document.getElementById('threejs-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x7cfc00); // Pokemon Green

const camera = new THREE.PerspectiveCamera(60, 270 / 220, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// --- 2. GLOBAL LIGHTING ---
// We keep references to these so we can dim them in battle
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);
const sun = new THREE.DirectionalLight(0xffffff, 0.6);
sun.position.set(5, 10, 5);
scene.add(sun);

// --- 3. STATE & SYSTEMS ---
let gameState = 'OVERWORLD';
let isPaused = false;

UI.init((paused) => { isPaused = paused; });
BattleSystem.init(scene); // Pre-loads 'pokemon.png'
GrassSystem.spawn(scene, -3, -3, 4, 4);

// --- 4. PLAYER ---
const player = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 0.7, 0.7),
    new THREE.MeshStandardMaterial({ color: 0xffff00 })
);
player.position.y = 0.35;
scene.add(player);

// --- 5. BATTLE CONTROLLER ---
function startBattle(message) {
    const screen = document.querySelector('.gbc-screen-border');
    screen.classList.add('battle-flash'); // Trigger CSS flash

    // Dim the 3D world lighting so the unlit sprite pops
    sun.intensity = 0.2;
    ambientLight.intensity = 0.4;

    setTimeout(() => {
        screen.classList.remove('battle-flash');
        gameState = 'BATTLE';
        
        // Show the UI Layer (set to z-index 10 in CSS)
        document.getElementById('battle-ui').classList.remove('hidden');
        
        UI.typeWriter(message, ".dialog-box");
        
        // Spawn the pokemon centered on the player's X axis
        BattleSystem.start(scene, player.position);
    }, 600);
}

function tryMove(dx, dz) {
    if (gameState !== 'OVERWORLD' || isPaused) return;

    const nextX = Math.round(player.position.x + dx);
    const nextZ = Math.round(player.position.z + dz);

    // Basic grid movement
    player.position.x = nextX;
    player.position.z = nextZ;

    // Check for random encounter
    if (GrassSystem.checkEncounter(nextX, nextZ)) {
        startBattle("A Wild Pokémon appeared!");
    }
}

// --- 6. INPUT BINDINGS ---
document.getElementById('btn-up').onclick = () => tryMove(0, -1);
document.getElementById('btn-down').onclick = () => tryMove(0, 1);
document.getElementById('btn-left').onclick = () => tryMove(-1, 0);
document.getElementById('btn-right').onclick = () => tryMove(1, 0);

document.getElementById('btn-a').onclick = () => {
    if (gameState === 'BATTLE') {
        gameState = 'OVERWORLD';
        document.getElementById('battle-ui').classList.add('hidden');
        
        // Clean up and restore light
        BattleSystem.end(scene);
        sun.intensity = 0.6;
        ambientLight.intensity = 0.8;
    }
};

// Keyboard support
window.addEventListener('keydown', (e) => {
    if (e.key === "ArrowUp") tryMove(0, -1);
    if (e.key === "ArrowDown") tryMove(0, 1);
    if (e.key === "ArrowLeft") tryMove(-1, 0);
    if (e.key === "ArrowRight") tryMove(1, 0);
});

// --- 7. MAIN LOOP ---
function animate() {
    requestAnimationFrame(animate);
    
    // Updates camera lerping for centering
    CameraSystem.update(camera, player, gameState);
    
    // Updates the pokemon bobbing animation
    BattleSystem.update(); 
    
    renderer.render(scene, camera);
}
animate();
