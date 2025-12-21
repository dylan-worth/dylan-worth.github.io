import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
export const renderer = new THREE.WebGLRenderer({ antialias: true });
export const playerGroup = new THREE.Group();

// GLOBAL EXPORTS for Main.js to control
export let controls; 
export let sunLight;     // To dim at night
export let ambientLight; // To dim at night
export let playerHand;   // To attach items to

export function initRenderer() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.getElementById('game-container').appendChild(renderer.domElement);

    // 1. DYNAMIC LIGHTING
    ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    sunLight = new THREE.DirectionalLight(0xffffff, 1);
    sunLight.position.set(50, 100, 50);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    scene.add(sunLight);

    // Initial Sky Color (Day)
    scene.background = new THREE.Color(0x87ceeb); 

    // 2. PLAYER MODEL WITH HAND
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 0.4), new THREE.MeshStandardMaterial({ color: 0x333333 })); 
    body.position.y = 0.8;
    body.castShadow = true;

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), new THREE.MeshStandardMaterial({ color: 0xffccaa }));
    head.position.y = 1.4;

    // --- NEW: THE HAND ---
    playerHand = new THREE.Group();
    playerHand.position.set(0.4, 0.8, 0.2); // Right side of body
    
    playerGroup.add(body, head, playerHand);
    scene.add(playerGroup);

    // 3. CAMERA
    camera.position.set(0, 10, 10);
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 5;
    controls.maxDistance = 25;
    controls.maxPolarAngle = Math.PI / 2.1;
    controls.target.copy(playerGroup.position);

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// HELPER: Change Environment
export function setDayNight(intensity, colorHex) {
    if(sunLight) sunLight.intensity = intensity;
    if(ambientLight) ambientLight.intensity = intensity * 0.6;
    scene.background.setHex(colorHex);
}
