import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

// --- INITIAL SETUP ---
const container = document.getElementById('threejs-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(0, 5, 5);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// --- WORLD ELEMENTS ---
// Grass Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ color: 0x4caf50 })
);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// Our "Pokémon" Player
const playerGeometry = new THREE.BoxGeometry(1, 1, 1);
const playerMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const player = new THREE.Mesh(playerGeometry, playerMaterial);
player.position.y = 0.5; // Sit on top of floor
scene.add(player);

// Lights
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 5);
scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff, 0.5));

// --- MOVEMENT LOGIC ---
const moveDistance = 0.2;

function moveUp()    { player.position.z -= moveDistance; }
function moveDown()  { player.position.z += moveDistance; }
function moveLeft()  { player.position.x -= moveDistance; }
function moveRight() { player.position.x += moveDistance; }

// Link CSS Buttons to JS Functions
document.getElementById('btn-up').addEventListener('mousedown', moveUp);
document.getElementById('btn-down').addEventListener('mousedown', moveDown);
document.getElementById('btn-left').addEventListener('mousedown', moveLeft);
document.getElementById('btn-right').addEventListener('mousedown', moveRight);

// Allow Keyboard control too for testing
window.addEventListener('keydown', (e) => {
    if (e.key === "ArrowUp") moveUp();
    if (e.key === "ArrowDown") moveDown();
    if (e.key === "ArrowLeft") moveLeft();
    if (e.key === "ArrowRight") moveRight();
});

// --- RENDER LOOP ---
function animate() {
    requestAnimationFrame(animate);
    
    // Make the camera follow the player slightly
    camera.position.x = player.position.x;
    camera.position.z = player.position.z + 5;
    
    renderer.render(scene, camera);
}
animate();
