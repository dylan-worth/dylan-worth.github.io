import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
export const renderer = new THREE.WebGLRenderer({ antialias: true });
export const playerGroup = new THREE.Group();

// GLOBAL EXPORTS
export let controls; 
export let sunLight;     // Modified by Day/Night cycle
export let ambientLight; // Modified by Day/Night cycle
export let playerHand;   // Where items are attached

export function initRenderer() {
    // 1. SETUP RENDERER
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.getElementById('game-container').appendChild(renderer.domElement);

    // 2. LIGHTING
    ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    sunLight = new THREE.DirectionalLight(0xffffff, 1);
    sunLight.position.set(50, 100, 50);
    sunLight.castShadow = true;
    
    // Optimize Shadow Map
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.left = -50;
    sunLight.shadow.camera.right = 50;
    sunLight.shadow.camera.top = 50;
    sunLight.shadow.camera.bottom = -50;
    
    scene.add(sunLight);

    // Initial Sky (Day)
    scene.background = new THREE.Color(0x87ceeb); 

    // 3. PLAYER MODEL
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(0.6, 0.8, 0.4), 
        new THREE.MeshStandardMaterial({ color: 0x333333 }) // Dark Grey Armor
    ); 
    body.position.y = 0.8;
    body.castShadow = true;

    const head = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.3, 0.3), 
        new THREE.MeshStandardMaterial({ color: 0xffccaa }) // Skin Tone
    );
    head.position.y = 1.4;

    // The "Hand" Anchor Point (Right side)
    playerHand = new THREE.Group();
    playerHand.position.set(0.4, 0.8, 0.2); 
    
    playerGroup.add(body, head, playerHand);
    scene.add(playerGroup);

    // 4. CAMERA & CONTROLS
    camera.position.set(0, 10, 10);
    
    controls = new OrbitControls(camera, renderer.domElement);
    
    // Smoothness
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Sensitivity Fix (0.5 is half speed)
    controls.rotateSpeed = 0.5; 
    controls.zoomSpeed = 0.5;   
    controls.panSpeed = 0.5;    
    
    // Constraints
    controls.minDistance = 5;  // Can't zoom inside player
    controls.maxDistance = 25; // Can't zoom too far out
    controls.maxPolarAngle = Math.PI / 2.1; // Can't go under ground
    
    // Start by looking at player
    controls.target.copy(playerGroup.position);

    // 5. RESIZE HANDLER
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Helper to dim lights for Night Cycle
export function setDayNight(intensity, colorHex) {
    if(sunLight) sunLight.intensity = intensity;
    if(ambientLight) ambientLight.intensity = intensity * 0.6;
    scene.background.setHex(colorHex);
}
