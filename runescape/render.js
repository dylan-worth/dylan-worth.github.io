import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
export const renderer = new THREE.WebGLRenderer({ antialias: true });
export const playerGroup = new THREE.Group();

// Export controls so main.js can update them
export let controls; 

export function initRenderer() {
    // 1. Setup Renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.getElementById('game-container').appendChild(renderer.domElement);

    // 2. Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);
    
    const sun = new THREE.DirectionalLight(0xffffff, 1);
    sun.position.set(50, 100, 50);
    sun.castShadow = true;
    sun.shadow.camera.left = -50;
    sun.shadow.camera.right = 50;
    sun.shadow.camera.top = 50;
    sun.shadow.camera.bottom = -50;
    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;
    scene.add(sun);

    // 3. Sky & Fog
    scene.background = new THREE.Color(0x87ceeb); // Sky Blue
    // scene.fog = new THREE.Fog(0x87ceeb, 20, 100); // Optional Fog

    // 4. Player Setup
    // Simple blocky character
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(0.6, 0.8, 0.4), 
        new THREE.MeshStandardMaterial({ color: 0x333333 }) // Dark Armor
    ); 
    body.position.y = 0.8;
    body.castShadow = true;

    const head = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.3, 0.3), 
        new THREE.MeshStandardMaterial({ color: 0xffccaa }) // Skin tone
    );
    head.position.y = 1.4;

    playerGroup.add(body, head);
    scene.add(playerGroup);

    // 5. Camera Initial Position
    camera.position.set(0, 10, 10);
    
    // 6. SETUP CONTROLS (Rotation/Zoom)
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Smoothness
    controls.dampingFactor = 0.05;
    controls.minDistance = 5; // Zoom limit in
    controls.maxDistance = 25; // Zoom limit out
    controls.maxPolarAngle = Math.PI / 2.1; // Prevent going underground
    
    // Focus controls on player initially
    controls.target.copy(playerGroup.position);
    
    // Handle Window Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}
