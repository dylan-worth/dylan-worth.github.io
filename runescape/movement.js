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
        // If we dragged or held for too long, it's not a click
        if (isDragging && (Date.now() - downTime > 200)) return;
        
        // Ignore clicks on UI elements (Inventory, Chat, etc)
        if (event.target.closest('.interactive') || event.target.closest('.panel') || event.target.closest('#chat-box')) {
            return;
        }

        // 1. Calculate Mouse Position
        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // 2. Raycast
        raycaster.setFromCamera(mouse, camera);

        // A. Check for Interactions (NPCs, Trees) first
        const intersects = raycaster.intersectObjects(scene.children, true);
        let clickedObject = false;

        // Filter out the player itself and ground
        for (let hit of intersects) {
            const obj = hit.object;
            // Check if it's an interactive object (has parentGroup)
            if (obj.userData && obj.userData.parentGroup) {
                // If it's a tree, npc, or bank
                clickedObject = true;
                // Walk to it
                targetPosition = hit.point; 
                isMoving = true;
                // Trigger interaction
                if (onInteractCallback) onInteractCallback(mouse);
                return;
            }
        }

        // B. If no object clicked, Move to Ground
        const target = new THREE.Vector3();
        raycaster.ray.intersectPlane(groundPlane, target);
        
        if (target) {
            targetPosition = target;
            isMoving = true;
            
            // Create a visual marker (optional debug)
            // const marker = new THREE.Mesh(new THREE.BoxGeometry(0.2,0.2,0.2), new THREE.MeshBasicMaterial({color:0xffff00}));
            // marker.position.copy(target);
            // scene.add(marker);
            // setTimeout(() => scene.remove(marker), 500);
        }
    });
}

export function updateMovement() {
    if (!isMoving || !targetPosition || !window.gameState.player) return;

    const player = window.gameState.player;
    const currentPos = player.position;

    // Direction vector
    const direction = new THREE.Vector3().subVectors(targetPosition, currentPos);
    direction.y = 0; // Keep on ground
    const distance = direction.length();

    if (distance < 0.2) {
        isMoving = false;
        return;
    }

    direction.normalize();

    // Check Collision
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
