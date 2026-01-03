import * as THREE from 'three';
import { Pen } from './pen.js';
import { World } from './world.js';

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

// Invisible floor for clicking the pen area
const floorTrigger = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({ visible: false })
);
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

// --- 4. WORLD-DRIVEN INTERACTION ---
window.addEventListener('mousedown', (event) => {
    if (event.target.tagName === 'BUTTON') return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    // PRIORITY 1: Click the Trough to Feed
    const troughHit = raycaster.intersectObject(world.troughGroup, true);
    if (troughHit.length > 0) {
        myPen.foodTroughFull = true;
        world.updateTroughVisual(true);
        return; 
    }

    // PRIORITY 2: Click the Pen to open Info HUD
    const penHit = raycaster.intersectObject(floorTrigger);
    if (penHit.length > 0) {
        document.getElementById('pen-menu').classList.remove('hidden');
        updateMenuSlots();
    }
});

function updateMenuSlots() {
    document.getElementById('total-count').innerText = `Total Animals in Pen: ${myPen.animals.length}`;
    for (let i = 0; i < 2; i++) {
        const slot = document.getElementById(`slot-${i}`);
        const animal = myPen.animals[i];
        if (animal) {
            slot.innerHTML = `<strong>${animal.stage} ${animal.gender}</strong><br>HP: ${animal.health}% | Hap: ${animal.happiness}%`;
        } else {
            slot.innerText = "Empty Slot";
        }
    }
}

document.getElementById('close-menu').addEventListener('click', () => {
    document.getElementById('pen-menu').classList.add('hidden');
});

// --- 5. LOOPS ---
setInterval(() => {
    myPen.tick();
    
    // Trough depletes (Chance-based or time-based)
    if (Math.random() < 0.25) {
        myPen.foodTroughFull = false;
        world.updateTroughVisual(false);
    }

    myPen.animals.forEach(animal => {
        if (!animal.mesh) createAnimalMesh(animal);
        const s = { "Baby": 0.4, "Adolescent": 0.7, "Adult": 1.0, "Elder": 0.95 }[animal.stage];
        animal.mesh.scale.set(s, s, s);
    });
    
    if (!document.getElementById('pen-menu').classList.contains('hidden')) updateMenuSlots();
}, 60000);

function animate() {
    requestAnimationFrame(animate);
    myPen.animals.forEach(animal => {
        if (animal.mesh) {
            const dist = animal.mesh.position.distanceTo(animal.targetPos);
            if (dist > 0.3) {
                animal.mesh.lookAt(animal.targetPos.x, 0.4, animal.targetPos.z);
                const dir = new THREE.Vector3().subVectors(animal.targetPos, animal.mesh.position).normalize();
                animal.mesh.position.addScaledVector(dir, 0.03);
            } else if (Math.random() < 0.01) {
                animal.targetPos.set(Math.random() * 8 - 4, 0, Math.random() * 8 - 4);
            }
        }
    });
    renderer.render(scene, camera);
}
animate();
