import * as THREE from 'three';
import { Pen } from './Pen.js';
import { World } from './World.js';

// --- 1. SETUP ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa2d5c6);

const aspect = window.innerWidth / window.innerHeight;
const d = 10;
const camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 1000);
camera.position.set(10, 10, 10); 
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// --- 2. WORLD & LOGIC ---
const world = new World(scene);
const myPen = new Pen();
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Define floor for raycasting (usually part of World.js, but referenced here)
const floorGeo = new THREE.PlaneGeometry(10, 10);
const floorMat = new THREE.MeshStandardMaterial({ visible: false }); // Invisible trigger
const floorTrigger = new THREE.Mesh(floorGeo, floorMat);
floorTrigger.rotation.x = -Math.PI / 2;
scene.add(floorTrigger);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);
const sunLight = new THREE.DirectionalLight(0xffffff, 1);
sunLight.position.set(5, 10, 7);
sunLight.castShadow = true;
scene.add(sunLight);

// --- 3. ANIMAL CREATION ---
function createAnimalMesh(animal) {
    const group = new THREE.Group();
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.8, 1),
        new THREE.MeshStandardMaterial({ color: animal.gender === "Male" ? 0x5dade2 : 0xec7063 })
    );
    body.position.y = 0.4;
    body.castShadow = true;
    group.add(body);
    
    animal.mesh = group;
    animal.targetPos = new THREE.Vector3(Math.random() * 8 - 4, 0, Math.random() * 8 - 4);
    scene.add(group);
}

// Initial Pair
createAnimalMesh(myPen.addAnimal("Male", "Adult"));
createAnimalMesh(myPen.addAnimal("Female", "Adult"));

// --- 4. INTERACTION (RAYCASTING) ---
window.addEventListener('click', (event) => {
    // Prevent menu opening if we click UI buttons
    if (event.target.tagName === 'BUTTON') return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(floorTrigger);

    if (intersects.length > 0) {
        const menu = document.getElementById('pen-menu');
        menu.classList.remove('hidden');
        updateMenuSlots();
    }
});

function updateMenuSlots() {
    for (let i = 0; i < 2; i++) {
        const slot = document.getElementById(`slot-${i}`);
        const animal = myPen.animals[i];
        if (animal) {
            slot.innerHTML = `<strong>${animal.stage} ${animal.gender}</strong><br>Health: ${animal.health}%<br>Happiness: ${animal.happiness}%`;
        } else {
            slot.innerText = "Empty Slot";
        }
    }
}

document.getElementById('close-menu').addEventListener('click', () => {
    document.getElementById('pen-menu').classList.add('hidden');
});

document.getElementById('feed-btn').addEventListener('click', () => {
    myPen.foodTroughFull = true;
    world.updateTroughVisual(true);
});

// --- 5. LOOPS ---
setInterval(() => {
    myPen.tick();
    myPen.animals.forEach(animal => {
        if (!animal.mesh) createAnimalMesh(animal);
        const s = { "Baby": 0.4, "Adolescent": 0.7, "Adult": 1.0, "Elder": 0.95 }[animal.stage];
        animal.mesh.scale.set(s, s, s);
    });
    document.getElementById('stats').innerText = `Animals: ${myPen.animals.length}`;
    if (!document.getElementById('pen-menu').classList.contains('hidden')) updateMenuSlots();
}, 60000);

function animate() {
    requestAnimationFrame(animate);
    const time = Date.now() * 0.002;
    myPen.animals.forEach(animal => {
        if (animal.mesh) {
            const dist = animal.mesh.position.distanceTo(animal.targetPos);
            if (dist > 0.3) {
                animal.mesh.lookAt(animal.targetPos.x, 0, animal.targetPos.z);
                const dir = new THREE.Vector3().subVectors(animal.targetPos, animal.mesh.position).normalize();
                animal.mesh.position.addScaledVector(dir, 0.03);
                animal.mesh.position.y = Math.abs(Math.sin(time * 5)) * 0.2;
            } else if (Math.random() < 0.01) {
                animal.targetPos.set(Math.random() * 8 - 4, 0, Math.random() * 8 - 4);
            }
        }
    });
    renderer.render(scene, camera);
}
animate();
