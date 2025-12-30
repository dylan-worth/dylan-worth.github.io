import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { UI } from './ui.js';
import { CameraSystem } from './camera.js';
import { GrassSystem } from './grass.js';
import { BattleSystem } from './battle.js';

const container = document.getElementById('threejs-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x7cfc00);
const camera = new THREE.PerspectiveCamera(60, 270 / 220, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

let gameState = 'OVERWORLD';
let isPaused = false;

UI.init((paused) => { isPaused = paused; });
BattleSystem.init(scene);
GrassSystem.spawn(scene, -3, -3, 4, 4);

const player = new THREE.Mesh(new THREE.BoxGeometry(0.7,0.7,0.7), new THREE.MeshStandardMaterial({color: 0xffff00}));
player.position.y = 0.35;
scene.add(player, new THREE.AmbientLight(0xffffff, 0.8));

function startBattle(message) {
    const screen = document.querySelector('.gbc-screen-border');
    screen.classList.add('battle-flash'); // Trigger CSS flash

    setTimeout(() => {
        screen.classList.remove('battle-flash');
        gameState = 'BATTLE';
        document.getElementById('battle-ui').classList.remove('hidden');
        UI.typeWriter(message, ".dialog-box");
        BattleSystem.start(scene, player.position); // Load 2D Pokemon
    }, 600);
}

function tryMove(dx, dz) {
    if (gameState !== 'OVERWORLD' || isPaused) return;
    player.position.x += dx;
    player.position.z += dz;
    if (GrassSystem.checkEncounter(player.position.x, player.position.z)) {
        startBattle("A Wild Pokémon appeared!");
    }
}

// Binds
document.getElementById('btn-up').onclick = () => tryMove(0, -1);
document.getElementById('btn-down').onclick = () => tryMove(0, 1);
document.getElementById('btn-left').onclick = () => tryMove(-1, 0);
document.getElementById('btn-right').onclick = () => tryMove(1, 0);
document.getElementById('btn-a').onclick = () => {
    if (gameState === 'BATTLE') {
        gameState = 'OVERWORLD';
        document.getElementById('battle-ui').classList.add('hidden');
        BattleSystem.end(scene);
    }
};

function animate() {
    requestAnimationFrame(animate);
    CameraSystem.update(camera, player, gameState);
    renderer.render(scene, camera);
}
animate();
