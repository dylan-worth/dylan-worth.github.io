import * as THREE from 'three';

let targetPosition = null;
let isMoving = false;
const speed = 0.15; // Movement speed

export function setupMovement(camera, scene, playerGroup, onInteractCallback) {
    const raycaster = new THREE.Raycaster();
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    
    // We use 'pointerup' to distinguish between a drag (camera move) and a click (movement)
    let isDragging = false;
    let downTime = 0;

    document.addEventListener('pointerdown', () => {
        isDragging = false;
        downTime = Date.now();
    });

    document.addEventListener('pointermove', () => {
        isDragging = true;
    });

    document.addEventListener('pointerup', (event) => {
        // 1. If we dragged (held down for > 200ms or moved significantly), ignore it
        if (isDragging && (Date.now() - downTime > 200)) return;
        
        // 2. Ignore clicks on UI elements (Inventory, Chat, Windows)
        if (event.target.closest('.interactive') || event.target.closest('.panel') || event.target.closest('#chat-box')) {
            return;
        }

        // 3. Calculate Mouse Position
        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // 4. Raycast
        raycaster.setFromCamera(mouse, camera);

        // A. Check for Interactions (NPCs, Trees, Banks) first
        // We set 'recursive: true' to hit children of Groups
        const intersects = raycaster.intersectObjects(scene.children, true);

        for (let hit of intersects) {
            const obj = hit.object;
            // Check if it's an interactive object (it will have userData.parentGroup)
            if (obj.userData && obj.userData.parentGroup) {
                // Walk towards it
                targetPosition = hit.point; 
                isMoving = true;
                
                // Trigger the interaction logic in main.js
                if (onInteractCallback) onInteractCallback(mouse);
                return;
            }
        }

        // B. If no interactive object clicked, Move to Ground
        const target = new THREE.Vector3();
        raycaster.ray.intersectPlane(groundPlane, target);
        
        if (target) {
            targetPosition = target;
            isMoving = true;
        }
    });
}

export function updateMovement() {
    if (!isMoving || !targetPosition || !window.gameState.player) return;

    const player = window.gameState.player;
    const currentPos = player.position;

    // Direction vector
    const direction = new THREE.Vector3().subVectors(targetPosition, currentPos);
    direction.y = 0; // Keep movement horizontal
    const distance = direction.length();

    // Stop if close enough
    if (distance < 0.2) {
        isMoving = false;
        return;
    }

    direction.normalize();

    // Collision Check
    const nextPos = currentPos.clone().add(direction.clone().multiplyScalar(speed));
    const playerBox = new THREE.Box3().setFromCenterAndSize(
        new THREE.Vector3(nextPos.x, 1, nextPos.z), 
        new THREE.Vector3(0.8, 2, 0.8)
    );

    let collision = false;
    if (window.gameState.colliders) {
        for (let box of window.gameState.colliders) {
            if (playerBox.intersectsBox(box)) {
                collision = true;
                break;
            }
        }
    }

    if (!collision) {
        player.position.add(direction.multiplyScalar(speed));
        // Rotate player to face movement
        player.lookAt(targetPosition.x, player.position.y, targetPosition.z);
    } else {
        isMoving = false; // Stop on wall
    }
}
