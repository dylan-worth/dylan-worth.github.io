import * as THREE from 'three';
import { Animal } from './animal.js';
import { Pen } from './pen.js';
import { World } from './world.js';

/**
 * --- 1. CORE INITIALIZATION ---
 * We set up the scene, isometric camera, and renderer.
 */
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa2d5c6); // Soft sky/grass blue-green

const aspect = window.innerWidth / window.innerHeight;
const d = 10; // View size
const camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 1000);
camera.position.set(10, 10, 10); 
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// --- 2. LIGHTING & ENVIRONMENT ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
sunLight.position.set(8, 15, 5);
sunLight.castShadow = true;
scene.add(sunLight);

// Build the physical world (Fences, Trough, Floor)
const world = new World(scene);
const myPen = new Pen();

/**
 * --- 3. ANIMAL VISUALIZATION ---
 * This function creates the 3D representation for our logic-based animals.
 */
function createAnimalMesh(animal) {
    const group = new THREE.Group();
    
    // Body (Colored by Gender)
    const bodyGeo = new THREE.BoxGeometry(0.8, 0.8, 1);
    const bodyMat = new THREE.MeshStandardMaterial({ 
        color: animal.gender === "Male" ? 0x5dade2 : 0xec7063 
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.4;
    body.castShadow = true;
    group.add(body);

    // Eyes (So we can see which way they walk)
    const eyeGeo = new THREE.BoxGeometry(0.15, 0.15, 0.15);
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(0.2, 0.6, 0.45);
    const eyeR = eyeL.clone();
    eyeR.position.x = -0.2;
    group.add(eyeL, eyeR);

    animal.mesh = group;
    
    // Initial random target for the Wander AI
    animal.targetPos = new THREE.Vector3(Math.random() * 8 - 4, 0, Math.random() * 8 - 4);
    
    scene.add(group);
}

// Spawn the first breeding pair
createAnimalMesh(myPen.addAnimal("Male", "Adult"));
createAnimalMesh(myPen.addAnimal("Female", "Adult"));

/**
 * --- 4. THE SIMULATION TICKER ---
 * Runs every 60 seconds (1 real-time minute).
 */
setInterval(() => {
    // 1. Run simulation logic (Aging, Breeding, Health)
    myPen.tick();
    
    // 2. Trough logic (Food depletes over time)
    // For this sim, we'll say there's a 30% chance food runs out every minute
    if (Math.random() < 0.3) {
        myPen.foodTroughFull = false;
        world.updateTroughVisual(false);
    }

    // 3. Sync Logic with Visuals
    myPen.animals.forEach(animal => {
        // If a baby was born, it needs a mesh
        if (!animal.mesh) createAnimalMesh(animal);
        
        // Update size based on stage
        const scales = { "Baby": 0.4, "Adolescent": 0.7, "Adult": 1.0, "Elder": 0.9 };
        const s = scales[animal.stage];
        animal.mesh.scale.set(s, s, s);

        // Turn grey if Elder
        if (animal.stage === "Elder") {
            animal.mesh.children[0].material.color.set(0xbdc3c7);
        }
    });
    
    document.getElementById('stats').innerText = `Animals: ${myPen.animals.length}`;
}, 60000);

/**
 * --- 5. ANIMATION & AI LOOP ---
 * Runs every frame (~60fps).
 */
function animate() {
    requestAnimationFrame(animate);
    const time = Date.now() * 0.002;

    myPen.animals.forEach(animal => {
        if (animal.mesh) {
            // Movement AI
            const dist = animal.mesh.position.distanceTo(animal.targetPos);
            
            if (dist > 0.2) {
                // Look toward target
                const lookTarget = new THREE.Vector3(animal.targetPos.x, animal.mesh.position.y, animal.targetPos.z);
                animal.mesh.lookAt(lookTarget);
                
                // Move forward (Speed based on health/happiness)
                const speed = (animal.health / 100) * 0.03;
                const direction = new THREE.Vector3().subVectors(animal.targetPos, animal.mesh.position).normalize();
                animal.mesh.position.addScaledVector(direction, speed);
                
                // Hop animation
                animal.mesh.position.y = Math.abs(Math.sin(time * 4)) * 0.2;
            } else {
                // Idle/Pick new target
                if (Math.random() < 0.02) {
                    animal.targetPos.set(Math.random() * 8 - 4, 0, Math.random() * 8 - 4);
                }
            }
        }
    });

    renderer.render(scene, camera);
}

// --- 6. UTILITIES ---
window.addEventListener('resize', () => {
    const aspect = window.innerWidth / window.innerHeight;
    camera.left = -d * aspect;
    camera.right = d * aspect;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

document.getElementById('feed-btn').addEventListener('click', () => {
    myPen.foodTroughFull = true;
    world.updateTroughVisual(true);
});

animate();
