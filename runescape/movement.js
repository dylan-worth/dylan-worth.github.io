import * as THREE from 'three';

let targetPosition = null;
let isMoving = false;
const speed = 0.25; 

export function setupMovement(camera, scene, playerGroup, onInteractCallback) {
    const raycaster = new THREE.Raycaster();
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    
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
        if (isDragging && (Date.now() - downTime > 200)) return;
        
        if (event.target.closest('.interactive') || event.target.closest('.panel') || event.target.closest('#chat-box')) {
            return;
        }

        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(scene.children, true);
        let clickedObject = null;

        for (let hit of intersects) {
            const obj = hit.object;
            if (obj.userData && obj.userData.parentGroup) {
                clickedObject = hit;
                break;
            }
        }

        if (clickedObject) {
            // Target the object's position
            targetPosition = clickedObject.point.clone();
            // Flag this as an interaction to trigger the 1.5 distance stop
            targetPosition.isInteraction = true; 
            isMoving = true;
            if (onInteractCallback) onInteractCallback(mouse);
        } else {
            // Move to Ground
            const target = new THREE.Vector3();
            raycaster.ray.intersectPlane(groundPlane, target);
            if (target) {
                targetPosition = target;
                targetPosition.isInteraction = false;
                isMoving = true;
            }
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

    // DYNAMIC STOPPING DISTANCE
    // If we are moving to attack/talk, stop at 1.5 units. Otherwise 0.2.
    const stopThreshold = targetPosition.isInteraction ? 1.5 : 0.2;

    if (distance < stopThreshold) {
        isMoving = false;
        return;
    }

    direction.normalize();

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
