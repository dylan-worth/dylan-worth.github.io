import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

const container = document.getElementById('threejs-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x7cfc00); // Grass Green

const camera = new THREE.PerspectiveCamera(60, 160 / 144, 0.1, 1000);
camera.position.set(0, 8, 6);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: false }); // Pixelated feel
renderer.setSize(160, 144);
container.appendChild(renderer.domElement);

// --- LIGHTING ---
const ambient = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambient);
const sun = new THREE.DirectionalLight(0xffffff, 0.5);
sun.position.set(5, 10, 5);
scene.add(sun);

// --- WORLD ASSETS ---
const obstacles = [];

// Create a simple Tree function
function createTree(x, z) {
    const trunk = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.8, 0.4), new THREE.MeshStandardMaterial({color: 0x8b4513}));
    const leaves = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({color: 0x228b22}));
    trunk.position.set(x, 0.4, z);
    leaves.position.set(x, 1.2, z);
    scene.add(trunk, leaves);
    obstacles.push({x, z}); // Register for collision
}

// Generate a small random forest
for(let i=0; i<15; i++) {
    let rx = Math.floor(Math.random() * 10 - 5);
    let rz = Math.floor(Math.random() * 10 - 5);
    if(rx !== 0 || rz !== 0) createTree(rx, rz);
}

// --- PLAYER ---
const player = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 0.7, 0.7),
    new THREE.MeshStandardMaterial({ color: 0xeed202 }) // Pikachu Yellow!
);
player.position.y = 0.35;
scene.add(player);

// --- MOVEMENT LOGIC ---
function tryMove(dx, dz) {
    const nextX = Math.round(player.position.x + dx);
    const nextZ = Math.round(player.position.z + dz);
    
    // Collision Check
    const isBlocked = obstacles.some(obj => obj.x === nextX && obj.z === nextZ);
    
    if (!isBlocked) {
        player.position.x = nextX;
        player.position.z = nextZ;
    }
}

// Input Handlers
document.getElementById('btn-up').onclick = () => tryMove(0, -1);
document.getElementById('btn-down').onclick = () => tryMove(0, 1);
document.getElementById('btn-left').onclick = () => tryMove(-1, 0);
document.getElementById('btn-right').onclick = () => tryMove(1, 0);

window.addEventListener('keydown', (e) => {
    if(e.key === "ArrowUp") tryMove(0, -1);
    if(e.key === "ArrowDown") tryMove(0, 1);
    if(e.key === "ArrowLeft") tryMove(-1, 0);
    if(e.key === "ArrowRight") tryMove(1, 0);
});

function animate() {
    requestAnimationFrame(animate);
    // Smooth Camera Follow
    camera.position.x += (player.position.x - camera.position.x) * 0.1;
    camera.position.z += ((player.position.z + 4) - camera.position.z) * 0.1;
    renderer.render(scene, camera);
}
animate();
