import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { UI } from './ui.js';
import { CameraSystem } from './camera.js';
import { GrassSystem } from './grass.js';
import { BattleSystem } from './battle.js';
import { PlayerState } from './player.js';
import { Movement } from './movement.js';

// --- 1. ENGINE SETUP ---
const container = document.getElementById('threejs-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x7cfc00); 

const camera = new THREE.PerspectiveCamera(60, 270 / 220, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// --- 2. GLOBAL LIGHTING ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);
const sun = new THREE.DirectionalLight(0xffffff, 0.6);
sun.position.set(5, 10, 5);
scene.add(sun);

// --- 3. STATE & SYSTEMS ---
let gameState = 'OVERWORLD';
let isPaused = false;

// Load persistent data (Cash, Badges, Inventory)
PlayerState.load(); 

UI.init((paused) => { isPaused = paused; });
BattleSystem.init(scene); 
GrassSystem.spawn(scene, -3, -3, 4, 4);

// --- 4. WORLD OBJECTS ---
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
// Populating a small forest
for(let i=0; i<12; i++) {
    addTree(Math.floor(Math.random() * 10 - 5), Math.floor(Math.random() * 10 - 8));
}

// --- 5. THE PLAYER ---
const player = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 0.7, 0.7),
    new THREE.MeshStandardMaterial({ color: 0xffff00 })
);
player.position.y = 0.35;
scene.add(player);

// --- 6. BATTLE LOGIC ---
function startBattle(message) {
    const screen = document.querySelector('.gbc-screen-border');
    screen.classList.add('battle-flash'); 

    // Dim world for battle focus
    sun.intensity = 0.2;
    ambientLight.intensity = 0.4;

    setTimeout(() => {
        screen.classList.remove('battle-flash');
        gameState = 'BATTLE';
        document.getElementById('battle-ui').classList.remove('hidden');
        
        UI.typeWriter(message, ".dialog-box");
        
        // Starts battle with inventory-based monsters
        BattleSystem.start(scene, player.position, PlayerState.inventory);
    }, 600);
}

// --- 7. INPUT HANDLERS (Using Movement.js) ---
const handleInput = (dx, dz) => {
    Movement.tryMove(player, dx, dz, obstacles, gameState, isPaused, startBattle);
};

document.getElementById('btn-up').onclick = () => handleInput(0, -1);
document.getElementById('btn-down').onclick = () => handleInput(0, 1);
document.getElementById('btn-left').onclick = () => handleInput(-1, 0);
document.getElementById('btn-right').onclick = () => handleInput(1, 0);

document.getElementById('btn-a').onclick = () => {
    if (gameState === 'BATTLE') {
        gameState = 'OVERWORLD';
        document.getElementById('battle-ui').classList.add('hidden');
        
        // Full clean up of battle meshes
        BattleSystem.end(scene);
        
        sun.intensity = 0.6;
        ambientLight.intensity = 0.8;
    }
};

// Start Menu "SAVE" Button Integration
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => {
        if (item.innerText === "SAVE") PlayerState.save();
        if (item.innerText === "EXIT") isPaused = false; // Close menu
    });
});

// Keyboard Fallback
window.addEventListener('keydown', (e) => {
    if (e.key === "ArrowUp") handleInput(0, -1);
    if (e.key === "ArrowDown") handleInput(0, 1);
    if (e.key === "ArrowLeft") handleInput(-1, 0);
    if (e.key === "ArrowRight") handleInput(1, 0);
});

// --- 8. MAIN LOOP ---
function animate() {
    requestAnimationFrame(animate);
    
    // Centered camera transitions
    CameraSystem.update(camera, player, gameState);
    
    // Smooth bobbing for active monsters
    BattleSystem.update(); 
    
    renderer.render(scene, camera);
}
animate();
