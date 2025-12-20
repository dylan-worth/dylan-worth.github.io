import * as THREE from 'three';

let targetPosition = new THREE.Vector3();
let isMoving = false;
let moveSpeed = 0.15;
let playerRef = null;
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let cameraRef, sceneRef;

export function setupMovement(camera, scene, player) {
    cameraRef = camera;
    sceneRef = scene;
    playerRef = player;
    targetPosition.copy(player.position);

    window.addEventListener('pointerdown', onClick);
}

function onClick(event) {
    // Don't click through UI
    if (event.target.id !== 'game-ui' && event.target.tagName !== 'CANVAS') return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, cameraRef);
    const intersects = raycaster.intersectObjects(sceneRef.children, true);

    for (let hit of intersects) {
        // If we clicked the ground, move there
        if (hit.object.name === "ground") {
            targetPosition.set(hit.point.x, 0, hit.point.z);
            isMoving = true;
            spawnMarker(hit.point);
            
            // UI Feedback
            document.getElementById('context-text').innerText = "Walking...";
            document.getElementById('context-text').style.color = "#ffff00";
            break;
        }
    }
}

export function updateMovement() {
    if (!isMoving || !playerRef) return;

    const dir = new THREE.Vector3().subVectors(targetPosition, playerRef.position);
    const dist = dir.length();

    if (dist < 0.1) {
        isMoving = false;
        playerRef.position.y = 0; // Reset bob
        document.getElementById('context-text').innerText = "";
    } else {
        dir.normalize();
        playerRef.position.add(dir.multiplyScalar(moveSpeed));
        playerRef.lookAt(targetPosition.x, playerRef.position.y, targetPosition.z);

        // Bob animation
        playerRef.position.y = Math.abs(Math.sin(Date.now() * 0.01)) * 0.1;

        // Camera Follow
        cameraRef.position.lerp(new THREE.Vector3(playerRef.position.x, 12, playerRef.position.z + 12), 0.1);
        cameraRef.lookAt(playerRef.position);
    }
}

function spawnMarker(pos) {
    // Yellow X marker logic could go here
}
