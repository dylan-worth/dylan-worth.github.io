import * as THREE from 'three';

let targetPosition = new THREE.Vector3();
let isMoving = false;
let moveSpeed = 0.15;
let playerRef, cameraRef, sceneRef;

// Camera
let camOffset = new THREE.Vector3(0, 15, 12);
let camAngle = 0;
let camZoom = 1.0;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

export function setupMovement(camera, scene, playerGroup) {
    cameraRef = camera;
    sceneRef = scene;
    playerRef = playerGroup;
    if(playerRef) targetPosition.copy(playerRef.position);

    // 1. Zoom (Wheel)
    window.addEventListener('wheel', (e) => {
        e.preventDefault();
        camZoom += e.deltaY * 0.001;
        camZoom = Math.min(Math.max(camZoom, 0.4), 2.5); // Clamp
        updateCamOffset();
    }, { passive: false });

    // 2. Rotate (Right Click Drag)
    window.addEventListener('contextmenu', e => e.preventDefault()); // Block Menu
    window.addEventListener('pointermove', (e) => {
        if (e.buttons === 2) { // Right click held
            camAngle -= e.movementX * 0.005;
            updateCamOffset();
        }
    });

    // 3. Move (Left Click)
    window.addEventListener('pointerdown', onGroundClick);
}

function updateCamOffset() {
    const x = Math.sin(camAngle) * 12 * camZoom;
    const z = Math.cos(camAngle) * 12 * camZoom;
    const y = 15 * camZoom;
    camOffset.set(x, y, z);
}

function onGroundClick(e) {
    if (e.target.id !== 'game-ui' && e.target.tagName !== 'CANVAS') return;
    if (e.button === 2) return; // Ignore right click

    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, cameraRef);
    const intersects = raycaster.intersectObjects(sceneRef.children, true);

    for (let hit of intersects) {
        if (hit.object.name === "ground") {
            targetPosition.set(hit.point.x, 0, hit.point.z);
            isMoving = true;
            spawnMarker(hit.point);
            break;
        }
    }
}

export function updateMovement() {
    // 1. Roof Hiding
    if (window.gameState.buildings && playerRef) {
        window.gameState.buildings.forEach(b => {
            const dist = new THREE.Vector3(b.x, 0, b.z).distanceTo(playerRef.position);
            b.roofMesh.visible = (dist > b.radius);
        });
    }

    // 2. Camera Lerp
    if (playerRef && cameraRef) {
        const goal = new THREE.Vector3().addVectors(playerRef.position, camOffset);
        cameraRef.position.lerp(goal, 0.1);
        cameraRef.lookAt(playerRef.position);
    }

    // 3. Player Move
    if (!isMoving || !playerRef) return;

    const dir = new THREE.Vector3().subVectors(targetPosition, playerRef.position);
    if (dir.length() < 0.1) {
        isMoving = false;
        playerRef.position.y = 1.6;
    } else {
        dir.normalize();
        const nextPos = playerRef.position.clone().add(dir.multiplyScalar(moveSpeed));
        
        // Collision
        const pBox = new THREE.Box3().setFromCenterAndSize(nextPos, new THREE.Vector3(0.5, 1, 0.5));
        let crash = false;
        if (window.gameState.colliders) {
            for (let box of window.gameState.colliders) {
                if (pBox.intersectsBox(box)) { crash = true; isMoving = false; break; }
            }
        }

        if (!crash) {
            playerRef.position.copy(nextPos);
            playerRef.lookAt(targetPosition.x, playerRef.position.y, targetPosition.z);
            playerRef.position.y = 1.6 + Math.abs(Math.sin(Date.now()*0.01)) * 0.1;
        }
    }
}

function spawnMarker(pos) {
    const m = new THREE.Mesh(new THREE.RingGeometry(0.2,0.3,8), new THREE.MeshBasicMaterial({color:0xffff00, side:THREE.DoubleSide}));
    m.rotation.x = -Math.PI/2; m.position.copy(pos); m.position.y=0.05;
    sceneRef.add(m);
    setTimeout(()=>sceneRef.remove(m), 500);
}
