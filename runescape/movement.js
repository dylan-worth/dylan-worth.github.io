import * as THREE from 'three';

let targetPosition = new THREE.Vector3();
let isMoving = false;
let moveSpeed = 0.15;
let playerRef, cameraRef, sceneRef;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

export function setupMovement(camera, scene, player) {
    cameraRef = camera;
    sceneRef = scene;
    playerRef = player;
    targetPosition.copy(player.position);

    window.addEventListener('pointerdown', onGroundClick);
}

function onGroundClick(event) {
    if (event.target.id !== 'game-ui' && event.target.tagName !== 'CANVAS') return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, cameraRef);
    const intersects = raycaster.intersectObjects(sceneRef.children, true);

    for (let hit of intersects) {
        // Only move if we clicked the GROUND
        if (hit.object.name === "ground") {
            targetPosition.set(hit.point.x, 0, hit.point.z);
            isMoving = true;
            
            // Create yellow X marker
            spawnMarker(hit.point);
            
            // UI Feedback
            const ctx = document.getElementById('context-text');
            ctx.innerText = ""; 
            ctx.style.color = "#ffff00";
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
        playerRef.position.y = 0; 
    } else {
        dir.normalize();
        playerRef.position.add(dir.multiplyScalar(moveSpeed));
        playerRef.lookAt(targetPosition.x, playerRef.position.y, targetPosition.z);

        // Bobbing animation
        playerRef.position.y = Math.abs(Math.sin(Date.now() * 0.01)) * 0.1;

        // Camera Follow
        cameraRef.position.lerp(new THREE.Vector3(playerRef.position.x, 12, playerRef.position.z + 12), 0.1);
        cameraRef.lookAt(playerRef.position);
    }
}

function spawnMarker(pos) {
    const marker = new THREE.Mesh(
        new THREE.RingGeometry(0.2, 0.3, 8),
        new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide })
    );
    marker.rotation.x = -Math.PI / 2;
    marker.position.copy(pos);
    marker.position.y = 0.05;
    sceneRef.add(marker);
    setTimeout(() => sceneRef.remove(marker), 500);
}
