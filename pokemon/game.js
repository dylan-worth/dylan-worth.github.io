import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { UI } from './ui.js';

// --- SETUP ---
const container = document.getElementById('threejs-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x7cfc00);
const camera = new THREE.PerspectiveCamera(60, 270 / 220, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// --- STATE ---
let gameState = 'OVERWORLD';
let isPaused = false;

UI.init((paused) => { isPaused = paused; });

// --- PLAYER & WORLD ---
const player = new THREE.Mesh(new THREE.BoxGeometry(0.7,0.7,0.7), new THREE.MeshStandardMaterial({color: 0xffcc00}));
player.position.y = 0.35;
scene.add(player);
scene.add(new THREE.AmbientLight(0xffffff, 1));

// Movement
function tryMove(dx, dz) {
    if (gameState !== 'OVERWORLD' || isPaused) return;
    player.position.x += dx;
    player.position.z += dz;
    
    // Check for Battle (Simple distance check for example)
    if (player.position.x === 2 && player.position.z === -2) {
        gameState = 'BATTLE';
        document.getElementById('battle-ui').classList.remove('hidden');
    }
}

// Controls
document.getElementById('btn-up').onclick = () => tryMove(0, -1);
document.getElementById('btn-down').onclick = () => tryMove(0, 1);
document.getElementById('btn-left').onclick = () => tryMove(-1, 0);
document.getElementById('btn-right').onclick = () => tryMove(1, 0);
document.getElementById('btn-a').onclick = () => {
    if(gameState === 'BATTLE') {
        gameState = 'OVERWORLD';
        document.getElementById('battle-ui').classList.add('hidden');
    }
};

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    const targetCam = (gameState === 'OVERWORLD') 
        ? new THREE.Vector3(player.position.x, 6, player.position.z + 4)
        : new THREE.Vector3(player.position.x - 1, 1.5, player.position.z + 2);
    
    camera.position.lerp(targetCam, 0.1);
    camera.lookAt(player.position.x, 0, player.position.z);
    renderer.render(scene, camera);
}
animate();
