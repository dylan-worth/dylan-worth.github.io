import * as THREE from 'three';
import { addChatMessage } from './chat.js'; // Import Chat to debug

let targetPosition = null;
let isMoving = false;
const speed = 0.15; 

export function setupMovement(camera, scene, playerGroup, onInteractCallback) {
    const raycaster = new THREE.Raycaster();
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    
    let isDragging = false;
    let downTime = 0;

    // Detect click vs drag
    document.addEventListener('pointerdown', () => { isDragging = false; downTime = Date.now(); });
    document.addEventListener('pointermove', () => { isDragging = true; });

    document.addEventListener('pointerup', (event) => {
        // Drag check (200ms buffer)
        if (isDragging && (Date.now() - downTime > 200)) return;
        
        // Ignore UI clicks
        if (event.target.closest('.interactive') || event.target.closest('.panel') || event.target.closest('#chat-box')) return;

        // Calculate Mouse
        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        // 1. Check Objects (Trees, NPCs)
        const intersects = raycaster.intersectObjects(scene.children, true);
        for (let hit of intersects) {
            const obj = hit.object;
            if (obj.userData && obj.userData.parentGroup) {
                targetPosition = hit.point; 
                isMoving = true;
                if (onInteractCallback) onInteractCallback(mouse);
                return;
            }
        }

        // 2. Check Ground
        const target = new THREE.Vector3();
        raycaster.ray.intersectPlane(groundPlane, target);
        
        if (target) {
            targetPosition = target;
            isMoving = true;
            // addChatMessage("Walking...", "grey"); // Debug print
        }
    });
}

export function updateMovement() {
    if (!isMoving || !targetPosition || !window.gameState.player) return;

    const player = window.gameState.player;
    const currentPos = player.position;

    const direction = new THREE.Vector3().subVectors(targetPosition, currentPos);
    direction.y = 0; 
    const distance = direction.length();

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
        player.lookAt(targetPosition.x, player.position.y, targetPosition.z);
    } else {
        isMoving = false;
    }
}
