import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
export const renderer = new THREE.WebGLRenderer({ antialias: true });
export const playerGroup = new THREE.Group();

export let controls; 
export let sunLight;
export let ambientLight;
export let playerHand;     // Right Hand (Sword/Axe)
export let playerLeftHand; // Left Hand (Shield)

// Animation State
let isSwinging = false;
let swingProgress = 0;

export function initRenderer() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.getElementById('game-container').appendChild(renderer.domElement);

    // 1. LIGHTING
    ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    sunLight = new THREE.DirectionalLight(0xffffff, 1);
    sunLight.position.set(50, 100, 50);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    scene.add(sunLight);

    scene.background = new THREE.Color(0x87ceeb); 

    // 2. PLAYER MODEL
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(0.6, 0.8, 0.4), 
        new THREE.MeshStandardMaterial({ color: 0x333333 }) 
    ); 
    body.position.y = 0.8;
    body.castShadow = true;

    const head = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.3, 0.3), 
        new THREE.MeshStandardMaterial({ color: 0xffccaa }) 
    );
    head.position.y = 1.4;

    // HAND ANCHORS
    playerHand = new THREE.Group();
    playerHand.position.set(0.4, 0.8, 0.2); 

    playerLeftHand = new THREE.Group();
    playerLeftHand.position.set(-0.4, 0.8, 0.2); 
    
    playerGroup.add(body, head, playerHand, playerLeftHand);
    scene.add(playerGroup);

    // 3. CAMERA & CONTROLS
    camera.position.set(0, 10, 10);
    controls = new OrbitControls(camera, renderer.domElement);
    
    // Sensitivity Fixes for Touch/Mobile
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.zoomSpeed = 0.5;
    controls.panSpeed = 0.5;
    
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

// TRIGGER ATTACK ANIMATION
export function playSwingAnimation() {
    if (isSwinging) return;
    isSwinging = true;
    swingProgress = 0;
}

export function updateAnimations() {
    if (!isSwinging) return;

    swingProgress += 0.2; // Swing Speed
    
    // Rotate Right Arm forward and back using Sine wave
    playerHand.rotation.x = -Math.sin(swingProgress) * 1.5;

    if (swingProgress >= Math.PI) {
        isSwinging = false;
        playerHand.rotation.x = 0; // Reset Position
    }
}

// ENVIRONMENT SETTINGS
export function setDayNight(intensity, colorHex) {
    if(sunLight) sunLight.intensity = intensity;
    if(ambientLight) ambientLight.intensity = intensity * 0.6;
    scene.background.setHex(colorHex);
}
