import * as THREE from 'three';

// State variables
let targetPosition = new THREE.Vector3();
let isMoving = false;
let moveSpeed = 0.15;
let playerRef, cameraRef, sceneRef;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

export function setupMovement(camera, scene, playerGroup) {
    cameraRef = camera;
    sceneRef = scene;
    playerRef = playerGroup;
    
    // Start target at current position so we don't bolt off immediately
    if (playerRef) {
        targetPosition.copy(playerRef.position);
    }

    // Listen for clicks on the ground
    window.addEventListener('pointerdown', onGroundClick);
}

function onGroundClick(event) {
    // 1. Ignore clicks if touching UI
    if (event.target.id !== 'game-ui' && event.target.tagName !== 'CANVAS') return;

    // 2. Raycast
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, cameraRef);
    const intersects = raycaster.intersectObjects(sceneRef.children, true);

    for (let hit of intersects) {
        // Only move if we clicked the object named "ground" (created in assets.js)
        if (hit.object.name === "ground") {
            targetPosition.set(hit.point.x, 0, hit.point.z);
            isMoving = true;
            
            // Visual Feedback (Yellow X)
            spawnMarker(hit.point);
            
            // Update Text
            const ctx = document.getElementById('context-text');
            if(ctx) {
                ctx.innerText = ""; 
                ctx.style.color = "#ffff00";
            }
            break; 
        }
    }
}

export function updateMovement() {
    if (!isMoving || !playerRef) return;

    // Calculate distance to target
    const dir = new THREE.Vector3().subVectors(targetPosition, playerRef.position);
    const dist = dir.length();

    if (dist < 0.1) {
        // Arrived
        isMoving = false;
        playerRef.position.y = 1.6; // Reset height (matches render.js body height)
    } else {
        // Move
        dir.normalize();
        playerRef.position.add(dir.multiplyScalar(moveSpeed));
        playerRef.lookAt(targetPosition.x, playerRef.position.y, targetPosition.z);

        // Bobbing animation (Walking)
        // Base height is 1.6, we bob up and down slightly
        playerRef.position.y = 1.6 + Math.abs(Math.sin(Date.now() * 0.01)) * 0.1;

        // Camera Follow
        if(cameraRef) {
            cameraRef.position.lerp(new THREE.Vector3(playerRef.position.x, 15, playerRef.position.z + 12), 0.1);
            cameraRef.lookAt(playerRef.position);
        }
    }
}

function spawnMarker(pos) {
    const marker = new THREE.Mesh(
        new THREE.RingGeometry(0.2, 0.3, 8),
        new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide })
    );
    marker.rotation.x = -Math.PI / 2;
    marker.position.copy(pos);
    marker.position.y = 0.05; // Slightly above ground
    sceneRef.add(marker);
    
    // Remove after 0.5 seconds
    setTimeout(() => {
        if(sceneRef) sceneRef.remove(marker);
    }, 500);
}
